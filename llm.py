"""Server-side LLM calls for the voice mock interviewer.

The React app never sees an API key: it sends a prompt through the Streamlit
component value, streamlit_app.py calls `complete`, and the text comes back
as a component argument.

Two providers are supported, chosen by which Streamlit secret is set:
  ANTHROPIC_API_KEY -> Claude (paid)
  GROQ_API_KEY      -> Groq free tier (open-weight models)
"""

from __future__ import annotations

from typing import Any

from dataclasses import dataclass

import anthropic
import groq

DEFAULT_MODEL = "claude-opus-5"
DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b"
MAX_TOKENS_CAP = 4000
MAX_PROMPT_CHARS = 40_000

# Server-side refusal fallback (only offered for models that support it).
FALLBACK_MODELS = {"claude-opus-5": "claude-opus-4-8", "claude-fable-5-1": "claude-opus-4-8"}


def _validate(request: dict[str, Any]) -> tuple[str, list[dict[str, str]], int]:
    system = request.get("system")
    messages = request.get("messages")
    if not isinstance(system, str) or not isinstance(messages, list) or not messages:
        raise ValueError("Malformed LLM request.")
    clean: list[dict[str, str]] = []
    for m in messages:
        if not isinstance(m, dict) or m.get("role") not in ("user", "assistant") or not isinstance(m.get("content"), str):
            raise ValueError("Malformed LLM message.")
        clean.append({"role": m["role"], "content": m["content"]})
    if len(system) + sum(len(m["content"]) for m in clean) > MAX_PROMPT_CHARS:
        raise ValueError("LLM request is too large.")
    max_tokens = int(request.get("max_tokens") or 1000)
    return system, clean, max(64, min(max_tokens, MAX_TOKENS_CAP))


@dataclass(frozen=True)
class Provider:
    name: str  # "Anthropic" or "Groq"
    api_key: str
    model: str


def configured_provider(secret) -> Provider | None:
    """Picks the provider from Streamlit secrets; Anthropic wins if both are set."""
    if key := secret("ANTHROPIC_API_KEY"):
        return Provider("Anthropic", key, secret("ANTHROPIC_MODEL") or DEFAULT_MODEL)
    if key := secret("GROQ_API_KEY"):
        return Provider("Groq", key, secret("GROQ_MODEL") or DEFAULT_GROQ_MODEL)
    return None


def complete(provider: Provider, request: dict[str, Any]) -> dict[str, str]:
    """Returns {"text": ...} on success or {"error": ...} on any failure."""
    try:
        system, messages, max_tokens = _validate(request)
    except (TypeError, ValueError) as exc:
        return {"error": str(exc)}
    if provider.name == "Groq":
        return _complete_groq(provider, system, messages, max_tokens)
    return _complete_anthropic(provider.api_key, provider.model, system, messages, max_tokens)


def _complete_groq(provider: Provider, system: str, messages: list[dict[str, str]], max_tokens: int) -> dict[str, str]:
    client = groq.Groq(api_key=provider.api_key, timeout=60.0, max_retries=2)
    kwargs: dict[str, Any] = {
        "model": provider.model,
        "messages": [{"role": "system", "content": system}, *messages],
        "max_tokens": max_tokens,
        "temperature": 0.4,
        # The interviewer always replies with one JSON object.
        "response_format": {"type": "json_object"},
    }
    if provider.model.startswith("openai/gpt-oss"):
        kwargs["reasoning_effort"] = "low"  # keeps turns around a second
    try:
        response = client.chat.completions.create(**kwargs)
    except groq.AuthenticationError:
        return {"error": "The Groq API key was rejected. Check GROQ_API_KEY in Streamlit secrets."}
    except groq.NotFoundError:
        return {"error": f"Groq model '{provider.model}' was not found. Check GROQ_MODEL in Streamlit secrets."}
    except groq.RateLimitError:
        return {"error": "Groq's free-tier rate limit was reached. Wait a minute and try again."}
    except groq.BadRequestError as exc:
        return {"error": f"Groq rejected the request: {exc.message}"}
    except groq.APIStatusError as exc:
        return {"error": f"Groq returned an error ({exc.status_code})."}
    except groq.APIConnectionError:
        return {"error": "Could not reach Groq (network error)."}
    text = response.choices[0].message.content or ""
    if not text.strip():
        return {"error": "Groq returned an empty response."}
    return {"text": text}


def _complete_anthropic(api_key: str, model: str, system: str, messages: list[dict[str, str]], max_tokens: int) -> dict[str, str]:
    client = anthropic.Anthropic(api_key=api_key, timeout=60.0, max_retries=2)
    kwargs: dict[str, Any] = {
        "model": model,
        "max_tokens": max_tokens,
        "system": system,
        "messages": messages,
        # Interview turns need to be quick; low effort keeps latency down.
        "output_config": {"effort": "low"},
    }
    if model in FALLBACK_MODELS:
        kwargs["betas"] = ["server-side-fallback-2026-06-01"]
        kwargs["fallbacks"] = [{"model": FALLBACK_MODELS[model]}]

    try:
        response = client.beta.messages.create(**kwargs)
    except anthropic.AuthenticationError:
        return {"error": "The Anthropic API key was rejected. Check ANTHROPIC_API_KEY in Streamlit secrets."}
    except anthropic.PermissionDeniedError:
        return {"error": "The Anthropic API key does not have access to this model."}
    except anthropic.NotFoundError:
        return {"error": f"Model '{model}' was not found. Check ANTHROPIC_MODEL in Streamlit secrets."}
    except anthropic.RateLimitError:
        return {"error": "The AI provider is rate limiting requests. Try again shortly."}
    except anthropic.BadRequestError as exc:
        return {"error": f"The AI provider rejected the request: {exc.message}"}
    except anthropic.APIStatusError as exc:
        return {"error": f"The AI provider returned an error ({exc.status_code})."}
    except anthropic.APIConnectionError:
        return {"error": "Could not reach the AI provider (network error)."}

    if response.stop_reason == "refusal":
        return {"error": "The model declined to answer this request."}
    text = "".join(block.text for block in response.content if block.type == "text")
    if not text.strip():
        return {"error": "The AI provider returned an empty response."}
    return {"text": text}

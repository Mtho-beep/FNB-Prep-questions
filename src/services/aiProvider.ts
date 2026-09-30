import { getStreamlitLlm, isStreamlit, requestLlm } from '../lib/streamlit'

// LLM provider abstraction for the voice interviewer.
//
//   server  -> streamlit_app.py calls the LLM configured in Streamlit secrets
//              (GROQ_API_KEY or ANTHROPIC_API_KEY, see llm.py). The key never
//              reaches the browser.
//   ollama  -> the browser calls a local Ollama server directly (no key).
//   offline -> no LLM; the engine uses keyword-based scoring and the
//              follow-ups already stored with each question.
//
// Only non-secret settings are read from Vite env variables.

export type ProviderKind = 'server' | 'ollama' | 'offline'
export type ProviderPreference = 'auto' | ProviderKind

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface CompletionRequest {
  system: string
  messages: ChatMessage[]
  maxTokens: number
}

export interface ProviderStatus {
  kind: ProviderKind
  label: string
  ready: boolean
  detail: string
}

const env = import.meta.env
const envProvider = (env.VITE_AI_PROVIDER as string | undefined)?.trim().toLowerCase() || 'auto'
export const ollamaUrl = ((env.VITE_OLLAMA_URL as string | undefined)?.trim() || 'http://localhost:11434').replace(/\/$/, '')
export const ollamaModel = (env.VITE_OLLAMA_MODEL as string | undefined)?.trim() || 'llama3.1:8b'

export const PROVIDER_LABELS: Record<ProviderKind, string> = {
  server: 'AI via Streamlit server',
  ollama: 'Ollama (local)',
  offline: 'Offline scoring (no AI)',
}

/** The provider to use when the user leaves the setting on "auto". */
export function defaultProvider(): ProviderKind {
  if (envProvider === 'offline') return 'offline'
  if (envProvider === 'ollama') return 'ollama'
  if (envProvider === 'server' || envProvider === 'streamlit') return 'server'
  if (isStreamlit) return getStreamlitLlm().available ? 'server' : 'offline'
  return env.VITE_OLLAMA_MODEL || env.VITE_OLLAMA_URL ? 'ollama' : 'offline'
}

export function resolveProvider(preference: ProviderPreference | 'claude'): ProviderKind {
  if (preference === 'claude') return 'server' // setting saved by an earlier version
  return preference === 'auto' ? defaultProvider() : preference
}

/** Checks that a provider can actually be reached before an interview starts. */
export async function checkProvider(kind: ProviderKind): Promise<ProviderStatus> {
  const label = PROVIDER_LABELS[kind]
  if (kind === 'offline') {
    return { kind, label, ready: true, detail: 'Answers are scored with a keyword-based estimate against the model answers.' }
  }
  if (kind === 'server') {
    if (!isStreamlit) {
      return { kind, label, ready: false, detail: 'The server AI is only available when the app runs inside streamlit_app.py.' }
    }
    const { available, model } = getStreamlitLlm()
    return available
      ? { kind, label, ready: true, detail: `Using ${model ?? 'the configured model'} through the Streamlit server.` }
      : { kind, label, ready: false, detail: 'No GROQ_API_KEY or ANTHROPIC_API_KEY is set in Streamlit secrets.' }
  }
  try {
    const res = await fetch(`${ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { models?: { name: string }[] }
    const names = (data.models ?? []).map((m) => m.name)
    const found = names.some((n) => n === ollamaModel || n === `${ollamaModel}:latest` || n.split(':')[0] === ollamaModel)
    return found
      ? { kind, label, ready: true, detail: `Using ${ollamaModel} at ${ollamaUrl}.` }
      : { kind, label, ready: false, detail: `Ollama is running but model "${ollamaModel}" is not pulled. Run: ollama pull ${ollamaModel}` }
  } catch {
    return {
      kind,
      label,
      ready: false,
      detail: `Could not reach Ollama at ${ollamaUrl}. Start it with OLLAMA_ORIGINS set to allow this page (see README).`,
    }
  }
}

async function completeWithOllama(req: CompletionRequest, disableThinking = true): Promise<string> {
  const res = await fetch(`${ollamaUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
      stream: false,
      format: 'json',
      // Reasoning models (qwen3, deepseek-r1) are ~10x slower with thinking on,
      // which is too slow for a live interview.
      ...(disableThinking ? { think: false } : {}),
      options: { temperature: 0.4, num_predict: req.maxTokens },
      messages: [{ role: 'system', content: req.system }, ...req.messages],
    }),
    signal: AbortSignal.timeout(180_000),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    if (disableThinking && res.status === 400 && /think/i.test(detail)) return completeWithOllama(req, false)
    throw new Error(`Ollama returned HTTP ${res.status}`)
  }
  const data = (await res.json()) as { message?: { content?: string } }
  const text = data.message?.content
  if (!text) throw new Error('Ollama returned an empty response.')
  return text
}

/** Sends one completion request to an AI provider. Throws on any failure. */
export async function complete(kind: ProviderKind, req: CompletionRequest): Promise<string> {
  if (kind === 'ollama') return completeWithOllama(req)
  if (kind === 'server') return requestLlm({ system: req.system, messages: req.messages, max_tokens: req.maxTokens })
  throw new Error('No AI provider is configured.')
}

/** Pulls the first JSON object out of a model response (tolerates code fences and preambles). */
export function parseJsonObject<T>(text: string): T {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('The AI response did not contain JSON.')
  return JSON.parse(text.slice(start, end + 1)) as T
}

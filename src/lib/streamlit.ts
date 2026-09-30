import { useSyncExternalStore } from 'react'

/**
 * Minimal implementation of the Streamlit custom-component protocol (the same
 * postMessage messages `streamlit-component-lib` sends), so the app can run as
 * a bidirectional component inside streamlit_app.py without extra dependencies.
 *
 * Outside Streamlit (e.g. `npm run dev`) none of this is active and the app
 * falls back to LocalStorage.
 */

/** Streamlit serves components with a `streamlitUrl` query parameter. */
export const isStreamlit = new URLSearchParams(window.location.search).has('streamlitUrl')

/** Any iframe (Streamlit component or srcdoc) has no usable URL for BrowserRouter. */
export const isEmbedded = window.self !== window.top

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface StreamlitArgs {
  progress?: unknown
  saved_rev?: string | null
  save_error?: string | null
  /** True when streamlit_app.py has an ANTHROPIC_API_KEY secret configured. */
  llm_available?: boolean
  llm_model?: string | null
  /** Answers to LLM requests, keyed by request id. */
  llm_results?: Record<string, { text?: string; error?: string }> | null
}

/** A chat completion request forwarded to streamlit_app.py (which holds the API key). */
export interface LlmRequest {
  id: string
  system: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  max_tokens: number
}

function post(type: string, extra: Record<string, unknown> = {}) {
  window.parent.postMessage({ isStreamlitMessage: true, type, ...extra }, '*')
}

// --- Save-status store (read by the header badge) ---
let saveStatus: SaveStatus = 'idle'
let saveError: string | null = null
let pendingRev: string | null = null
const listeners = new Set<() => void>()

function setSaveStatus(status: SaveStatus, error: string | null = null) {
  saveStatus = status
  saveError = error
  listeners.forEach((l) => l())
}

export function useSaveStatus(): { status: SaveStatus; error: string | null } {
  const status = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => saveStatus,
  )
  return { status, error: saveError }
}

// --- Server-side LLM proxy (used by the voice interviewer) ---
let llmAvailable = false
let llmModel: string | null = null
let lastRev: string | null = null
let lastProgress: unknown = null
const pendingLlm = new Map<
  string,
  { request: LlmRequest; resolve: (text: string) => void; reject: (err: Error) => void; timer: number }
>()

export function getStreamlitLlm(): { available: boolean; model: string | null } {
  return { available: llmAvailable, model: llmModel }
}

/**
 * Every component value carries the latest progress snapshot plus all
 * unanswered LLM requests. Streamlit only keeps the most recent value, so
 * sending everything each time means nothing is lost when posts coalesce.
 */
function postValue() {
  post('streamlit:setComponentValue', {
    value: { rev: lastRev, progress: lastProgress, llm_requests: [...pendingLlm.values()].map((p) => p.request) },
    dataType: 'json',
  })
}

/** Sends a prompt to the Python side and resolves with the model's text. */
export function requestLlm(request: Omit<LlmRequest, 'id'>, timeoutMs = 90_000): Promise<string> {
  const id = `llm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pendingLlm.delete(id)
      reject(new Error('The AI interviewer did not respond in time.'))
    }, timeoutMs)
    pendingLlm.set(id, { request: { ...request, id }, resolve, reject, timer })
    postValue()
  })
}

function applyLlmArgs(args: StreamlitArgs) {
  llmAvailable = Boolean(args.llm_available)
  llmModel = args.llm_model ?? null
  for (const [id, result] of Object.entries(args.llm_results ?? {})) {
    const pending = pendingLlm.get(id)
    if (!pending) continue
    window.clearTimeout(pending.timer)
    pendingLlm.delete(id)
    if (typeof result.text === 'string') pending.resolve(result.text)
    else pending.reject(new Error(result.error || 'The AI interviewer returned an error.'))
  }
}

function handleArgs(args: StreamlitArgs) {
  applyLlmArgs(args)
  if (!pendingRev) return
  if (args.save_error && args.saved_rev !== pendingRev) {
    setSaveStatus('error', args.save_error)
  } else if (args.saved_rev === pendingRev) {
    setSaveStatus('saved')
  }
}

/** Keep the component iframe as tall as the visible Streamlit page. */
function syncFrameHeight() {
  let height = 900
  try {
    height = Math.max(window.parent.innerHeight - 8, 600)
  } catch {
    // Parent not accessible — keep the default.
  }
  post('streamlit:setFrameHeight', { height })
}

/**
 * Tells Streamlit the component is ready and resolves with the args from the
 * first render. Later renders only update the save status.
 */
export function connectToStreamlit(): Promise<StreamlitArgs> {
  return new Promise((resolve) => {
    let first = true
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.data?.type !== 'streamlit:render') return
      const args = (event.data.args ?? {}) as StreamlitArgs
      if (first) {
        first = false
        applyLlmArgs(args)
        syncFrameHeight()
        resolve(args)
      } else {
        handleArgs(args)
      }
    })
    window.addEventListener('resize', syncFrameHeight)
    post('streamlit:componentReady', { apiVersion: 1 })
  })
}

/** Sends a progress snapshot to Python. `rev` lets Python skip duplicate saves. */
export function sendProgress(rev: string, progress: unknown) {
  pendingRev = rev
  lastRev = rev
  lastProgress = progress
  setSaveStatus('saving')
  postValue()
}

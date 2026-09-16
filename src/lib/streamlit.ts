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

function handleArgs(args: StreamlitArgs) {
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
  setSaveStatus('saving')
  post('streamlit:setComponentValue', { value: { rev, progress }, dataType: 'json' })
}

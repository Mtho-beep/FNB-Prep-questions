import { useEffect, useRef, useState } from 'react'
import type { ProgressState } from '../types/questions'
import { useLocalStorage } from './useLocalStorage'
import { isStreamlit, sendProgress } from '../lib/streamlit'

type SetState = (value: ProgressState | ((prev: ProgressState) => ProgressState)) => void

const SAVE_DEBOUNCE_MS = 700

/**
 * Progress state backed by the Neon database when running inside Streamlit
 * (snapshots are sent to streamlit_app.py, which writes them), and by
 * LocalStorage otherwise.
 */
export function usePersistentProgress(
  storageKey: string,
  emptyState: ProgressState,
  remoteInitial: ProgressState | undefined,
): [ProgressState, SetState] {
  const local = useLocalStorage<ProgressState>(storageKey, emptyState)
  const remote = useState<ProgressState>(() => remoteInitial ?? local[0])
  const [state, setState] = isStreamlit ? remote : local

  // If the database was empty but this browser has old LocalStorage progress,
  // `remoteInitial` is undefined and we start from (and upload) the local copy.
  const skipFirstSave = useRef(remoteInitial !== undefined)
  const revCounter = useRef(0)
  const sessionId = useRef(Math.random().toString(36).slice(2))

  useEffect(() => {
    if (!isStreamlit) return
    if (skipFirstSave.current) {
      skipFirstSave.current = false
      return
    }
    const timer = window.setTimeout(() => {
      revCounter.current += 1
      sendProgress(`${sessionId.current}-${revCounter.current}`, state)
    }, SAVE_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [state])

  return [state, setState]
}

import { useCallback, useEffect, useState } from 'react'

/**
 * A generic useState-like hook that persists its value to LocalStorage.
 * Reads once on mount, writes on every change, and fails gracefully
 * (falling back to in-memory state) if LocalStorage is unavailable.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // LocalStorage unavailable (private browsing, quota exceeded, etc.) — fail silently.
    }
  }, [key, value])

  const setStoredValue = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === 'function' ? (next as (prev: T) => T)(prev) : next))
  }, [])

  return [value, setStoredValue]
}

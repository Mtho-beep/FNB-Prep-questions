import { useCallback, useEffect, useRef, useState } from 'react'

// Thin wrapper around the browser Web Speech API (SpeechRecognition /
// webkitSpeechRecognition). Note: in Chrome and Edge the browser sends the
// audio to its vendor's speech service to transcribe it; the app itself never
// records or stores audio — only the resulting text.

interface RecognitionAlternative {
  transcript: string
}
interface RecognitionResult {
  isFinal: boolean
  0: RecognitionAlternative
}
interface RecognitionEvent {
  resultIndex: number
  results: ArrayLike<RecognitionResult>
}
interface RecognitionErrorEvent {
  error: string
  message?: string
}
interface Recognition {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: (() => void) | null
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionCtor = new () => Recognition

function getRecognitionCtor(): RecognitionCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export type MicPermission = 'unknown' | 'prompt' | 'granted' | 'denied'

export interface RecognitionError {
  code: string
  message: string
}

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Microphone permission was denied. You can continue in text mode.',
  'service-not-allowed': 'Speech recognition is blocked in this browser. You can continue in text mode.',
  'audio-capture': 'No microphone was found. Check that one is connected, or continue in text mode.',
  network: 'Speech recognition needs a network connection in this browser. Your typed answer is still available.',
  'no-speech': "I didn't hear anything. Tap the microphone and try again.",
  'language-not-supported': 'This speech language is not supported. Try another language in the voice settings.',
}

export function useSpeechRecognition(lang: string) {
  const supported = typeof window !== 'undefined' && Boolean(getRecognitionCtor())
  const [listening, setListening] = useState(false)
  const [finalTranscript, setFinalTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<RecognitionError | null>(null)
  const [permission, setPermission] = useState<MicPermission>('unknown')
  const [stoppedUnexpectedly, setStoppedUnexpectedly] = useState(false)
  const recognitionRef = useRef<Recognition | null>(null)
  const userStoppedRef = useRef(false)

  // Read the microphone permission where the Permissions API supports it.
  useEffect(() => {
    let status: PermissionStatus | undefined
    const update = () => status && setPermission(status.state as MicPermission)
    navigator.permissions
      ?.query({ name: 'microphone' as PermissionName })
      .then((s) => {
        status = s
        update()
        s.addEventListener('change', update)
      })
      .catch(() => {
        // Not supported (e.g. Firefox/Safari for "microphone") — stays "unknown".
      })
    return () => status?.removeEventListener('change', update)
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      setError({ code: 'unsupported', message: 'Voice recognition is not supported by this browser. You can continue using text mode.' })
      return
    }
    recognitionRef.current?.abort()
    const rec = new Ctor()
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = true
    userStoppedRef.current = false
    setError(null)
    setStoppedUnexpectedly(false)
    setFinalTranscript('')
    setInterimTranscript('')

    rec.onstart = () => {
      setListening(true)
      setPermission('granted')
    }
    rec.onresult = (e) => {
      // `results` holds every result of this recognition session.
      let final = ''
      let interim = ''
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) final += r[0].transcript
        else interim += r[0].transcript
      }
      setFinalTranscript(final.trim())
      setInterimTranscript(interim.trim())
    }
    rec.onerror = (e) => {
      if (e.error === 'aborted') return
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setPermission('denied')
      setError({ code: e.error, message: ERROR_MESSAGES[e.error] ?? `Speech recognition error: ${e.error}.` })
    }
    rec.onend = () => {
      setListening(false)
      setInterimTranscript('')
      if (!userStoppedRef.current) setStoppedUnexpectedly(true)
      if (recognitionRef.current === rec) recognitionRef.current = null
    }

    recognitionRef.current = rec
    try {
      rec.start()
    } catch (err) {
      setError({ code: 'start-failed', message: `Could not start the microphone: ${(err as Error).message}` })
    }
  }, [lang])

  /** Stops listening; any pending final result is still delivered. */
  const stop = useCallback(() => {
    userStoppedRef.current = true
    recognitionRef.current?.stop()
  }, [])

  /** Stops immediately and discards pending results. */
  const abort = useCallback(() => {
    userStoppedRef.current = true
    recognitionRef.current?.abort()
    recognitionRef.current = null
    setListening(false)
    setInterimTranscript('')
  }, [])

  const reset = useCallback(() => {
    setFinalTranscript('')
    setInterimTranscript('')
    setError(null)
    setStoppedUnexpectedly(false)
  }, [])

  useEffect(() => () => recognitionRef.current?.abort(), [])

  return {
    supported,
    listening,
    finalTranscript,
    interimTranscript,
    error,
    permission,
    stoppedUnexpectedly,
    start,
    stop,
    abort,
    reset,
  }
}

export type UseSpeechRecognitionReturn = ReturnType<typeof useSpeechRecognition>

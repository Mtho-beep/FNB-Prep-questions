import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Wrapper around window.speechSynthesis. Voices differ per browser/OS, so
// nothing is hard-coded: we pick the most natural-sounding English voice
// available and let the user override it.

const PREFERRED_NAME_HINTS = ['natural', 'online', 'neural', 'google uk english', 'google us english', 'samantha', 'daniel']
const PREFERRED_LANGS = ['en-ZA', 'en-GB', 'en-US', 'en-AU', 'en-IE']

function rankVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  let score = 0
  const langIndex = PREFERRED_LANGS.indexOf(v.lang)
  if (langIndex >= 0) score += 20 - langIndex * 2
  else if (v.lang.toLowerCase().startsWith('en')) score += 5
  PREFERRED_NAME_HINTS.forEach((hint, i) => {
    if (name.includes(hint)) score += 30 - i * 2
  })
  if (v.localService) score += 1
  return score
}

export function pickDefaultVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  return [...(english.length ? english : voices)].sort((a, b) => rankVoice(b) - rankVoice(a))[0]
}

/** Chrome cuts off long utterances, so speak sentence-sized chunks. */
function chunkText(text: string, max = 220): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text]
  const chunks: string[] = []
  let current = ''
  for (const s of sentences) {
    if ((current + s).length > max && current) {
      chunks.push(current.trim())
      current = ''
    }
    current += s
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

export interface TextToSpeechOptions {
  voiceURI: string
  rate: number
  pitch: number
}

export function useTextToSpeech({ voiceURI, rate, pitch }: TextToSpeechOptions) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const runRef = useRef(0)

  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  const selectedVoice = useMemo(
    () => voices.find((v) => v.voiceURI === voiceURI) ?? pickDefaultVoice(voices),
    [voices, voiceURI],
  )

  /** Speaks the text; resolves when finished, stopped or failed. */
  const speak = useCallback(
    (text: string): Promise<void> => {
      if (!supported || !text.trim()) return Promise.resolve()
      const synth = window.speechSynthesis
      synth.cancel()
      const run = ++runRef.current
      const chunks = chunkText(text)
      setSpeaking(true)
      setPaused(false)
      return new Promise((resolve) => {
        let remaining = chunks.length
        const done = () => {
          if (runRef.current === run) {
            setSpeaking(false)
            setPaused(false)
          }
          resolve()
        }
        for (const chunk of chunks) {
          const u = new SpeechSynthesisUtterance(chunk)
          if (selectedVoice) {
            u.voice = selectedVoice
            u.lang = selectedVoice.lang
          }
          u.rate = rate
          u.pitch = pitch
          u.onend = () => {
            remaining -= 1
            if (remaining === 0) done()
          }
          // "interrupted"/"canceled" also arrive here when stop() is called.
          u.onerror = () => {
            remaining = 0
            done()
          }
          synth.speak(u)
        }
      })
    },
    [supported, selectedVoice, rate, pitch],
  )

  const stop = useCallback(() => {
    if (!supported) return
    runRef.current++
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }, [supported])

  const pause = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.pause()
    setPaused(true)
  }, [supported])

  const resume = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.resume()
    setPaused(false)
  }, [supported])

  const englishVoices = useMemo(() => voices.filter((v) => v.lang.toLowerCase().startsWith('en')), [voices])

  return { supported, voices: englishVoices.length ? englishVoices : voices, selectedVoice, speaking, paused, speak, stop, pause, resume }
}

export type UseTextToSpeechReturn = ReturnType<typeof useTextToSpeech>

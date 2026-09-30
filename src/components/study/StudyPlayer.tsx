import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Info,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  Microscope,
  Pause,
  Play,
  RotateCcw,
  Send,
  SkipForward,
  Square,
  Volume2,
  XCircle,
  Baby,
  Headphones,
} from 'lucide-react'
import type { UseStudyTutorReturn } from '../../hooks/useStudyTutor'
import type { UseSpeechRecognitionReturn } from '../../hooks/useSpeechRecognition'
import type { UseTextToSpeechReturn } from '../../hooks/useTextToSpeech'
import type { VoiceSettings } from '../../hooks/useVoiceSettings'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { isLikelyEcho } from '../../services/tutorHelpers'
import { STUDY_MODE_LABELS } from '../../utils/studyLinks'
import { ProgressBar } from '../ProgressBar'
import { Badge } from '../Badge'
import { SourceList } from './StudySummary'

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2]
const SILENCE_MS = 1500
const SPEAKER_LABELS = { tutor: 'AI Tutor', host: 'Host', expert: 'Expert', you: 'You', system: '' } as const

const STATUS_TEXT: Partial<Record<string, string>> = {
  planning: 'Preparing your lesson plan…',
  generating: 'Preparing the next part…',
  thinking: 'Thinking about that…',
  listening: "I'm listening — ask your question, or press Play to continue.",
  stopped: 'Stopped. Press Play to continue from where we were.',
  paused: 'Paused.',
}

interface StudyPlayerProps {
  tutor: UseStudyTutorReturn
  recognition: UseSpeechRecognitionReturn
  tts: UseTextToSpeechReturn
  settings: VoiceSettings
  updateSettings: (patch: Partial<VoiceSettings>) => void
  onInterviewMe: () => void
}

export function StudyPlayer({ tutor, recognition, tts, settings, updateSettings, onInterviewMe }: StudyPlayerProps) {
  const [typed, setTyped] = useState('')
  const [capturing, setCapturing] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [handsFree, setHandsFree] = useLocalStorage('fnb-ai-interview-prep:tutor-hands-free:v1', false)
  // Where the current utterance starts inside the recogniser's running transcript.
  const [offset, setOffset] = useState(0)
  const wasListeningRef = useRef(false)
  const transcriptEndRef = useRef<HTMLDivElement>(null)
  const { start: startRec, stop: stopRec, abort: abortRec } = recognition
  const { interrupt, submit } = tutor

  const plan = tutor.plan
  const busy = tutor.status === 'planning' || tutor.status === 'thinking'
  const voiceInput = settings.voiceMode && recognition.supported
  const heard = recognition.finalTranscript.slice(offset).trim()

  // Each (re)start of recognition begins a fresh transcript.
  useEffect(() => {
    const restarted = recognition.listening && !wasListeningRef.current
    wasListeningRef.current = recognition.listening
    if (restarted) setOffset(0)
  }, [recognition.listening])

  const sendCaptured = useCallback(
    (text: string) => {
      setCapturing(false)
      setOffset(recognition.finalTranscript.length)
      if (!handsFree) stopRec()
      if (text.trim()) submit(text)
    },
    [handsFree, recognition.finalTranscript, stopRec, submit],
  )

  /** 🎙 Ask / Interrupt: stop the tutor and listen. */
  const startAsk = useCallback(() => {
    interrupt()
    if (!voiceInput) return
    setOffset(recognition.listening ? recognition.finalTranscript.length : 0)
    setCapturing(true)
    if (!recognition.listening) startRec()
  }, [interrupt, voiceInput, recognition.listening, recognition.finalTranscript, startRec])

  // Auto-send after a pause in speech.
  useEffect(() => {
    if (!capturing || !heard || recognition.interimTranscript) return
    const t = window.setTimeout(() => sendCaptured(heard), SILENCE_MS)
    return () => window.clearTimeout(t)
  }, [capturing, heard, recognition.interimTranscript, sendCaptured])

  // Manual mode: if the mic stops (error, or silence with nothing heard), stop capturing.
  const captureSawMicRef = useRef(false)
  useEffect(() => {
    if (!capturing) {
      captureSawMicRef.current = false
      return
    }
    if (recognition.listening) {
      captureSawMicRef.current = true
      return
    }
    // oxlint-disable-next-line react/set-state-in-effect -- reacting to the external recogniser stopping
    if (!handsFree && (recognition.error || (captureSawMicRef.current && !heard))) setCapturing(false)
  }, [capturing, handsFree, heard, recognition.listening, recognition.error])

  // Hands-free (experimental): keep the microphone open for the whole session.
  const sessionActive = tutor.status !== 'finished' && tutor.status !== 'idle'
  useEffect(() => {
    if (!handsFree || !voiceInput || !sessionActive || recognition.listening || recognition.error) return
    const t = window.setTimeout(() => startRec(), 500)
    return () => window.clearTimeout(t)
  }, [handsFree, voiceInput, sessionActive, recognition.listening, recognition.error, startRec])

  // Hands-free barge-in: real speech (not the tutor's own voice) interrupts.
  useEffect(() => {
    if (!handsFree || capturing || !recognition.listening) return
    const newText = `${recognition.finalTranscript.slice(offset)} ${recognition.interimTranscript}`.trim()
    if (!newText) return
    const beingSaid = tutor.nowSpeaking?.text ?? ''
    if (tts.speaking && isLikelyEcho(newText, beingSaid)) {
      // Drop the tutor's own voice from the transcript once it is final.
      // oxlint-disable-next-line react/set-state-in-effect -- reacting to the external recogniser
      if (!recognition.interimTranscript) setOffset(recognition.finalTranscript.length)
      return
    }
    if (tts.speaking && newText.split(/\s+/).length < 2) return
    interrupt()
    setCapturing(true)
  }, [handsFree, capturing, offset, recognition.listening, recognition.finalTranscript, recognition.interimTranscript, tts.speaking, tutor.nowSpeaking, interrupt])

  useEffect(() => {
    if (!handsFree) abortRec()
  }, [handsFree, abortRec])

  // Space bar = Ask / Interrupt (when not typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.code !== 'Space' || target.closest('input, textarea, select, button')) return
      e.preventDefault()
      if (capturing) sendCaptured(heard)
      else startAsk()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [capturing, heard, sendCaptured, startAsk])

  useEffect(() => {
    if (showTranscript) transcriptEndRef.current?.scrollIntoView({ block: 'nearest' })
  }, [tutor.transcript.length, showTranscript])

  function sendTyped() {
    if (!typed.trim()) return
    submit(typed)
    setTyped('')
  }

  const pending = tutor.pending
  const section = plan?.sections[tutor.activeSection]
  const speaker = tutor.nowSpeaking?.speaker
  const tutorText = tutor.nowSpeaking?.text ?? (pending?.type === 'check' || pending?.type === 'quiz' ? pending.question : '')

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
              <Headphones size={14} /> AI Study Podcast
            </p>
            <p className="text-xs text-slate-400">
              {tutor.config && STUDY_MODE_LABELS[tutor.config.mode]} · {tutor.config?.interactivity} ·{' '}
              {tutor.config?.style === 'duo' ? 'two-person' : 'solo tutor'}
            </p>
          </div>
          <h2 className="mt-1 text-lg font-bold text-navy-900">{plan?.title ?? tutor.config?.topic.label}</h2>
          {plan && (
            <div className="mt-3">
              <p className="mb-1 text-xs text-slate-500">
                Currently learning: <span className="font-semibold text-navy-900">🧠 {tutor.concept}</span>
              </p>
              <ProgressBar percent={tutor.progressPercent} label={`Lesson progress`} showPercentLabel sizeClass="h-2" />
            </div>
          )}
        </div>

        {tutor.notice && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" role="status">
            <Info size={16} className="mt-0.5 shrink-0" /> {tutor.notice}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${speaker === 'host' ? 'bg-brand-500' : 'bg-navy-900'}`}>
                <Headphones size={15} />
              </span>
              {speaker ? SPEAKER_LABELS[speaker] : 'AI Tutor'}
            </p>
            {tts.speaking && !tts.paused && <span className="text-xs font-medium text-brand-600">🔊 Speaking…</span>}
            {tutor.status === 'paused' && <span className="text-xs font-medium text-slate-500">⏸ Paused</span>}
          </div>
          {busy || tutor.status === 'generating' ? (
            <p className="flex items-center gap-2 text-slate-500">
              <Loader2 size={18} className="animate-spin" /> {STATUS_TEXT[tutor.status]}
            </p>
          ) : tutorText ? (
            <p className="text-[17px] leading-relaxed text-navy-900">"{tutorText}"</p>
          ) : (
            <p className="text-slate-500">{STATUS_TEXT[tutor.status] ?? ''}</p>
          )}

          {pending?.type === 'continue' && !busy && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => tutor.continueLesson()} className="focus-ring rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800">
                {pending.reason === 'checkpoint' ? 'Yes, continue' : 'Continue the lesson'}
              </button>
              {pending.reason === 'quiz' ? (
                <button type="button" onClick={() => tutor.quiz()} className="focus-ring rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Another question
                </button>
              ) : (
                <button type="button" onClick={() => tutor.quickAsk('simpler')} className="focus-ring rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  {pending.reason === 'checkpoint' ? 'No, explain again' : 'Explain further'}
                </button>
              )}
            </div>
          )}
          {(pending?.type === 'check' || pending?.type === 'quiz') && !busy && (
            <p className="mt-3 text-sm text-slate-500">Answer by speaking (🎙 Answer) or typing below. Say "continue" to skip.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {voiceInput ? (
              capturing ? (
                <button
                  type="button"
                  onClick={() => sendCaptured(heard)}
                  className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" /> Listening… tap to send
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startAsk}
                  disabled={tutor.status === 'planning'}
                  className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
                >
                  <Mic size={17} /> {pending?.type === 'check' || pending?.type === 'quiz' ? 'Answer' : 'Ask / Interrupt'}
                  <span className="hidden text-xs font-normal text-slate-300 sm:inline">(space)</span>
                </button>
              )
            ) : (
              <p className="flex-1 text-sm text-slate-500">
                <MicOff size={15} className="mr-1 inline" /> {settings.voiceMode ? 'Voice input is not supported in this browser — type below.' : 'Voice input is off — type below.'}
              </p>
            )}
            {voiceInput && (
              <label className="flex items-center gap-2 text-xs text-slate-500" title="Keeps the mic open so you can just start talking. Use headphones so the tutor doesn't hear itself.">
                <input type="checkbox" checked={handsFree} onChange={(e) => setHandsFree(e.target.checked)} className="accent-orange-500" />
                Hands-free (experimental, use headphones)
              </label>
            )}
          </div>
          {capturing && (heard || recognition.interimTranscript) && (
            <p className="mt-3 text-sm text-slate-700">
              "{heard} <span className="italic text-slate-400">{recognition.interimTranscript}</span>"
            </p>
          )}
          {recognition.error && recognition.error.code !== 'no-speech' && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="alert">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {recognition.error.message}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onFocus={() => tutor.status === 'speaking' && interrupt()}
              onKeyDown={(e) => e.key === 'Enter' && sendTyped()}
              placeholder={pending?.type === 'check' || pending?.type === 'quiz' ? 'Type your answer…' : 'Ask the tutor…'}
              aria-label="Ask the tutor"
              className="focus-ring min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button type="button" onClick={sendTyped} disabled={!typed.trim() || busy} className="focus-ring flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
              <Send size={14} /> Send
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4">
            {tutor.status === 'paused' || tutor.status === 'stopped' || tutor.status === 'listening' || pending ? (
              <Control label="Play" onClick={tutor.play} disabled={busy}>
                <Play size={16} />
              </Control>
            ) : (
              <Control label="Pause" onClick={tutor.pause} disabled={!tts.speaking}>
                <Pause size={16} />
              </Control>
            )}
            <Control label="Stop" onClick={tutor.stop} disabled={busy}>
              <Square size={15} />
            </Control>
            <Control label="Replay" onClick={tutor.replay} disabled={busy}>
              <RotateCcw size={15} />
            </Control>
            <Control label="Skip section" onClick={tutor.skip} disabled={busy}>
              <SkipForward size={15} />
            </Control>
            <label className="ml-2 flex items-center gap-1.5 text-xs text-slate-500">
              Speed
              <select
                value={settings.rate}
                onChange={(e) => updateSettings({ rate: Number(e.target.value) })}
                aria-label="Speech speed"
                className="focus-ring rounded-md border border-slate-200 bg-white px-1.5 py-1 text-xs"
              >
                {SPEEDS.map((s) => (
                  <option key={s} value={s}>
                    {s}x
                  </option>
                ))}
                {!SPEEDS.includes(settings.rate) && <option value={settings.rate}>{settings.rate}x</option>}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Volume2 size={14} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                aria-label="Volume"
                className="w-20 accent-orange-500"
              />
            </label>
            {!tts.supported && <span className="text-xs text-amber-700">Text-to-speech isn't available — read along below.</span>}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip onClick={() => tutor.quickAsk('simpler')} disabled={busy}>
              <Baby size={14} /> Explain Simply
            </Chip>
            <Chip onClick={() => tutor.quickAsk('deeper')} disabled={busy}>
              <Microscope size={14} /> Go Deeper
            </Chip>
            <Chip onClick={() => tutor.quickAsk('example')} disabled={busy}>
              <Lightbulb size={14} /> Give Me an Example
            </Chip>
            <Chip onClick={() => tutor.quiz()} disabled={busy}>
              <Brain size={14} /> Quiz Me
            </Chip>
            <Chip onClick={onInterviewMe}>
              <Mic size={14} /> Interview Me
            </Chip>
            <span className="ml-auto">
              {confirmEnd ? (
                <span className="flex items-center gap-2">
                  <button type="button" onClick={tutor.end} className="focus-ring rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700">
                    End session
                  </button>
                  <button type="button" onClick={() => setConfirmEnd(false)} className="focus-ring text-xs text-slate-500">
                    Cancel
                  </button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmEnd(true)} className="focus-ring flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100">
                  <XCircle size={14} /> End session
                </button>
              )}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            className="focus-ring flex w-full items-center justify-between px-5 py-3 text-sm font-semibold text-navy-900"
            aria-expanded={showTranscript}
          >
            Transcript ({tutor.transcript.length}) {showTranscript ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showTranscript && (
            <div className="max-h-96 space-y-3 overflow-y-auto border-t border-slate-100 px-5 py-4">
              {tutor.transcript.length === 0 && <p className="text-sm text-slate-400">Nothing yet.</p>}
              {tutor.transcript.map((e) => (
                <div key={e.id} className={e.role === 'you' ? 'rounded-lg bg-orange-50 p-2.5' : ''}>
                  <p className="text-xs font-semibold text-slate-400">
                    {SPEAKER_LABELS[e.role]} {e.generalKnowledge && <Badge tone="neutral">general knowledge</Badge>}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700">{e.text}</p>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        {plan && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Lesson plan</h3>
            <ol className="space-y-1.5">
              {plan.sections.map((sec, i) => {
                const done = tutor.covered.includes(i)
                const current = i === tutor.activeSection && !done
                return (
                  <li key={i} className={`flex items-start gap-2 text-sm ${current ? 'font-semibold text-navy-900' : done ? 'text-slate-600' : 'text-slate-400'}`}>
                    {done ? (
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    ) : current ? (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-brand-500" />
                    ) : (
                      <Circle size={15} className="mt-0.5 shrink-0" />
                    )}
                    <span>
                      {i + 1}. {sec.title}
                    </span>
                  </li>
                )
              })}
            </ol>
            {plan.source === 'offline' && <p className="mt-3 text-xs text-amber-700">Offline plan: reading your study notes.</p>}
          </div>
        )}
        {section && section.sourceIds.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">📚 Based on</h3>
            <SourceList ids={section.sourceIds} />
          </div>
        )}
      </aside>
    </div>
  )
}

function Control({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="focus-ring rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-navy-900 disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function Chip({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="focus-ring flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
    >
      {children}
    </button>
  )
}

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Bot,
  Code2,
  Info,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Send,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react'
import type { UseVoiceInterviewReturn } from '../../hooks/useVoiceInterview'
import type { UseSpeechRecognitionReturn } from '../../hooks/useSpeechRecognition'
import type { UseTextToSpeechReturn } from '../../hooks/useTextToSpeech'
import type { VoiceSettings } from '../../hooks/useVoiceSettings'
import { MODE_CONFIGS, estimateTotalQuestions } from '../../services/interviewPlanner'
import { QUALITY_LABELS } from '../../services/interviewEvaluator'
import { coderbyteQuestions } from '../../data'
import { ProgressBar } from '../ProgressBar'
import { formatDuration } from '../../utils/time'

function joinText(base: string, addition: string): string {
  if (!addition) return base
  if (!base.trim()) return addition
  return `${base.trimEnd()} ${addition}`
}

interface VoiceInterviewRoomProps {
  engine: UseVoiceInterviewReturn
  settings: VoiceSettings
  recognition: UseSpeechRecognitionReturn
  tts: UseTextToSpeechReturn
}

export function VoiceInterviewRoom({ engine, settings, recognition, tts }: VoiceInterviewRoomProps) {
  const session = engine.session!
  const planner = engine.planner!
  const turn = session.turns[session.turns.length - 1]
  const previous = session.turns.length > 1 ? session.turns[session.turns.length - 2] : undefined
  const config = MODE_CONFIGS[session.mode]
  const remaining = config.targetSec - planner.elapsedSec
  const processing = engine.status === 'processing'
  const voiceActive = settings.voiceMode && recognition.supported

  const [draft, setDraft] = useState(engine.initialDraft)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const baseRef = useRef('')
  const submitAfterStopRef = useRef(false)
  const lastSpokenRef = useRef<string | null>(null)
  const { speak, stop: stopSpeaking } = tts
  const { start: startRecognition, stop: stopRecognition, abort: abortRecognition, reset: resetRecognition } = recognition

  const startListening = useCallback(() => {
    stopSpeaking() // don't transcribe the interviewer's own voice
    baseRef.current = draft
    startRecognition()
  }, [draft, startRecognition, stopSpeaking])

  // New question: clear the answer box, speak it, optionally open the mic.
  useEffect(() => {
    if (lastSpokenRef.current === turn.id) return
    const isFirstRender = lastSpokenRef.current === null
    lastSpokenRef.current = turn.id
    if (!isFirstRender) setDraft('')
    abortRecognition()
    resetRecognition()
    if (settings.voiceMode && settings.autoSpeak && tts.supported) {
      speak(turn.text).then(() => {
        // Only auto-open the mic once permission is granted: without a click the
        // browser can't show a permission prompt, so starting would just fail.
        if (settings.autoListen && voiceActive && recognition.permission === 'granted' && lastSpokenRef.current === turn.id) {
          baseRef.current = ''
          startRecognition()
        }
      })
    }
    // Only react to a new turn, not to settings changes mid-question.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn.id])

  // Merge recognised speech into the editable answer.
  useEffect(() => {
    if (recognition.finalTranscript) setDraft(joinText(baseRef.current, recognition.finalTranscript))
  }, [recognition.finalTranscript])

  const { saveDraft, submitAnswer } = engine
  useEffect(() => {
    saveDraft(draft)
  }, [draft, saveDraft])

  const submit = useCallback(() => {
    if (!draft.trim() || processing) return
    submitAnswer(draft)
  }, [draft, processing, submitAnswer])

  // "Stop & submit": wait for the recogniser to deliver its last result.
  useEffect(() => {
    if (!recognition.listening && submitAfterStopRef.current) {
      submitAfterStopRef.current = false
      submit()
    }
  }, [recognition.listening, submit])

  function handleSubmit() {
    if (recognition.listening) {
      submitAfterStopRef.current = true
      stopRecognition()
    } else {
      submit()
    }
  }

  function handleSkip() {
    abortRecognition()
    stopSpeaking()
    engine.skipQuestion()
  }

  function handleEnd() {
    abortRecognition()
    stopSpeaking()
    setConfirmEnd(false)
    engine.endInterview()
  }

  const estimated = estimateTotalQuestions(planner, session.turns.length)
  const codingQuestion = turn.sourceType === 'coding' ? coderbyteQuestions.find((q) => q.id === turn.sourceId) : undefined
  const liveEvaluation = settings.liveFeedback ? previous?.evaluation : undefined

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{config.label}</p>
            <p className="text-xs text-slate-400">
              Question {session.turns.length} of approximately {estimated} · {turn.phase}
            </p>
          </div>
          <div className="text-right" role="timer" aria-live="off">
            <p className={`font-mono text-3xl font-bold tabular-nums ${remaining <= 60 ? 'text-rose-600' : 'text-navy-900'}`}>
              {remaining >= 0 ? formatDuration(remaining) : `+${formatDuration(-remaining)}`}
            </p>
            <p className="text-xs text-slate-400">{remaining >= 0 ? 'remaining' : "time's up — finish this answer"}</p>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar percent={(planner.elapsedSec / config.targetSec) * 100} sizeClass="h-1.5" />
        </div>
      </div>

      {engine.notice && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" role="status">
          <Info size={16} className="mt-0.5 shrink-0" /> {engine.notice}
        </div>
      )}

      {liveEvaluation && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <span className="font-semibold text-navy-900">Live feedback on your last answer: {QUALITY_LABELS[liveEvaluation.quality]}.</span>{' '}
          {liveEvaluation.missing[0] ?? liveEvaluation.feedback}
        </div>
      )}

      <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-white">
              <Bot size={16} />
            </span>
            AI Interviewer
          </p>
          <div className="flex items-center gap-1">
            {tts.supported && (
              <>
                <IconButton label="Replay question" onClick={() => speak(turn.text)} disabled={processing}>
                  <Volume2 size={16} />
                </IconButton>
                {tts.speaking && !tts.paused && (
                  <IconButton label="Pause speaking" onClick={tts.pause}>
                    <Pause size={16} />
                  </IconButton>
                )}
                {tts.paused && (
                  <IconButton label="Resume speaking" onClick={tts.resume}>
                    <Play size={16} />
                  </IconButton>
                )}
                {tts.speaking && (
                  <IconButton label="Stop speaking" onClick={stopSpeaking}>
                    <VolumeX size={16} />
                  </IconButton>
                )}
              </>
            )}
          </div>
        </div>

        {processing ? (
          <p className="flex items-center gap-2 text-slate-500">
            <Loader2 size={18} className="animate-spin" /> The interviewer is considering your answer…
          </p>
        ) : (
          <p className="text-lg font-semibold leading-snug text-navy-900 sm:text-xl">"{turn.text}"</p>
        )}
        {tts.speaking && !processing && <p className="mt-2 text-xs font-medium text-brand-600">🔊 Speaking…</p>}

        {codingQuestion && !processing && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="mb-2 font-semibold text-navy-900">{codingQuestion.title}</p>
            {codingQuestion.examples.slice(0, 2).map((ex, i) => (
              <p key={i} className="font-mono text-xs text-slate-600">
                Input: {ex.input} → Output: {ex.output}
              </p>
            ))}
            <Link to={`/coderbyte#${codingQuestion.id}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline">
              <Code2 size={14} /> Open the coding editor (your interview is saved — the timer pauses until you resume)
            </Link>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-navy-900">Your response</p>
          {recognition.listening && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-rose-600" aria-live="polite">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" /> 🎙 Listening…
            </span>
          )}
        </div>

        {settings.voiceMode && !recognition.supported && (
          <p className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Voice recognition is not supported by this browser. You can continue using text mode.
          </p>
        )}
        {recognition.error && recognition.error.code !== 'no-speech' && (
          <p className="mb-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="alert">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {recognition.error.message}
          </p>
        )}
        {recognition.error?.code === 'no-speech' && <p className="mb-3 text-sm text-slate-500">{recognition.error.message}</p>}
        {recognition.stoppedUnexpectedly && !recognition.error && !processing && (
          <p className="mb-3 text-sm text-slate-500">Recording stopped. Tap the microphone to continue — your transcript is kept.</p>
        )}

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          disabled={processing || recognition.listening}
          rows={6}
          aria-label="Your answer"
          placeholder={voiceActive ? 'Tap the microphone and speak, or type your answer here…' : 'Type your answer here…'}
          className="focus-ring w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-[15px] leading-relaxed text-slate-700 placeholder:text-slate-400 disabled:bg-slate-50"
        />
        {recognition.listening && recognition.interimTranscript && (
          <p className="mt-2 text-sm italic text-slate-400">"{recognition.interimTranscript}"</p>
        )}
        <p className="mt-1 text-xs text-slate-400">You can edit the transcript before submitting. Ctrl+Enter submits.</p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          {voiceActive &&
            (recognition.listening ? (
              <button
                type="button"
                onClick={stopRecognition}
                className="focus-ring flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                <Square size={15} /> Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={startListening}
                disabled={processing}
                className="focus-ring flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
              >
                {recognition.permission === 'denied' ? <MicOff size={16} /> : <Mic size={16} />}
                {draft.trim() ? 'Continue speaking' : 'Speak'}
              </button>
            ))}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={processing || (!draft.trim() && !recognition.listening)}
            className="focus-ring flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            <Send size={15} /> {recognition.listening ? 'Stop & Submit' : 'Submit Answer'}
          </button>
          {draft && !recognition.listening && (
            <button
              type="button"
              onClick={() => setDraft('')}
              disabled={processing}
              className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={15} /> Clear
            </button>
          )}
          <button
            type="button"
            onClick={handleSkip}
            disabled={processing}
            className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <SkipForward size={15} /> Skip
          </button>
          <div className="ml-auto">
            {confirmEnd ? (
              <span className="flex items-center gap-2">
                <span className="text-xs text-slate-500">End now?</span>
                <button type="button" onClick={handleEnd} className="focus-ring rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700">
                  Yes, end interview
                </button>
                <button type="button" onClick={() => setConfirmEnd(false)} className="focus-ring rounded-lg px-2 py-2 text-xs text-slate-500 hover:bg-slate-100">
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmEnd(true)}
                disabled={processing}
                className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <XCircle size={15} /> End Interview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="focus-ring rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-900 disabled:opacity-40"
    >
      {children}
    </button>
  )
}

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Briefcase,
  BrainCircuit,
  Code2,
  Loader2,
  Mic,
  RefreshCw,
  ShieldCheck,
  Users,
  Volume2,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { InterviewDifficulty, InterviewMode } from '../../types/interview'
import { MODE_CONFIGS, MODE_ORDER } from '../../services/interviewPlanner'
import { getStreamlitLlm } from '../../lib/streamlit'
import { PROVIDER_LABELS, checkProvider, resolveProvider, type ProviderKind, type ProviderStatus } from '../../services/aiProvider'
import type { VoiceSettings } from '../../hooks/useVoiceSettings'
import type { UseTextToSpeechReturn } from '../../hooks/useTextToSpeech'
import type { UseVoiceInterviewReturn } from '../../hooks/useVoiceInterview'
import { formatDuration } from '../../utils/time'

const MODE_ICONS: Record<InterviewMode, LucideIcon> = {
  full: Mic,
  technical: Bot,
  project: Briefcase,
  fundamentals: BrainCircuit,
  behavioural: Users,
  rapid: Zap,
  coding: Code2,
}

const DIFFICULTIES: InterviewDifficulty[] = ['Adaptive', 'Beginner', 'Intermediate', 'Advanced']

const LANGUAGES = [
  { value: 'en-ZA', label: 'English (South Africa)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'en-US', label: 'English (US)' },
]

interface VoiceInterviewSetupProps {
  settings: VoiceSettings
  updateSettings: (patch: Partial<VoiceSettings>) => void
  tts: UseTextToSpeechReturn
  recognitionSupported: boolean
  engine: UseVoiceInterviewReturn
  onStart: (mode: InterviewMode, difficulty: InterviewDifficulty, provider: ProviderKind) => void
}

export function VoiceInterviewSetup({ settings, updateSettings, tts, recognitionSupported, engine, onStart }: VoiceInterviewSetupProps) {
  // "Interview Me" in the study podcast opens this page with a mode preselected.
  const requestedMode = (useLocation().state as { mode?: InterviewMode } | null)?.mode
  const [mode, setMode] = useState<InterviewMode>(requestedMode && MODE_CONFIGS[requestedMode] ? requestedMode : 'full')
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Adaptive')
  const [status, setStatus] = useState<ProviderStatus | null>(null)
  const [checkCount, setCheckCount] = useState(0)
  const [checkedCount, setCheckedCount] = useState(-1)
  const provider = resolveProvider(settings.provider)

  // Re-check whenever the provider changes or the user asks to.
  useEffect(() => {
    let cancelled = false
    checkProvider(provider).then((result) => {
      if (cancelled) return
      setStatus(result)
      setCheckedCount(checkCount)
    })
    return () => {
      cancelled = true
    }
  }, [provider, checkCount])

  const runCheck = () => setCheckCount((n) => n + 1)
  const checking = status?.kind !== provider || checkedCount !== checkCount
  const ready = !checking && status?.ready

  return (
    <div className="space-y-5">
      {engine.saved && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            You have an unfinished {MODE_CONFIGS[engine.saved.session.mode].label} ({formatDuration(engine.saved.planner.elapsedSec)} in,{' '}
            {engine.saved.session.turns.length} question{engine.saved.session.turns.length === 1 ? '' : 's'} asked). Your transcripts were kept.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={engine.resumeSaved}
              className="focus-ring rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={engine.discardSaved}
              className="focus-ring rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Interview Mode</h2>
        <p className="mb-4 text-sm text-slate-500">Questions come from the app's existing question bank; the AI interviewer adapts follow-ups to your answers.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODE_ORDER.map((m) => {
            const config = MODE_CONFIGS[m]
            const Icon = MODE_ICONS[m]
            const selected = m === mode
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={selected}
                className={[
                  'focus-ring flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all',
                  selected ? 'border-brand-500 bg-orange-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50',
                ].join(' ')}
              >
                <div className="flex w-full items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${selected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={18} />
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{Math.round(config.targetSec / 60)} min</span>
                </div>
                <p className="text-sm font-semibold text-navy-900">{config.label}</p>
                <p className="text-xs leading-snug text-slate-500">{config.description}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                aria-pressed={d === difficulty}
                className={[
                  'focus-ring rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  d === difficulty ? 'bg-navy-900 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {d}
                {d === 'Adaptive' && ' (recommended)'}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">Adaptive starts gently and goes deeper after strong answers, easier after weak ones — capped at junior level.</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Volume2 size={16} /> Voice Settings
          </h2>

          <Toggle label="Voice mode" description="Speak your answers and hear the questions." checked={settings.voiceMode} onChange={(v) => updateSettings({ voiceMode: v })} />
          {settings.voiceMode && !recognitionSupported && (
            <p className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              Voice recognition is not supported by this browser. You can continue using text mode (Chrome or Edge support it).
            </p>
          )}
          {settings.voiceMode && !tts.supported && (
            <p className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Text-to-speech is not available in this browser; questions will be shown as text.</p>
          )}
          <Toggle label="Auto-speak questions" checked={settings.autoSpeak} onChange={(v) => updateSettings({ autoSpeak: v })} disabled={!settings.voiceMode} />
          <Toggle
            label="Start the microphone after each question"
            checked={settings.autoListen}
            onChange={(v) => updateSettings({ autoListen: v })}
            disabled={!settings.voiceMode || !recognitionSupported}
          />
          <Toggle
            label="Live feedback"
            description="Show a short assessment after each answer instead of only at the end."
            checked={settings.liveFeedback}
            onChange={(v) => updateSettings({ liveFeedback: v })}
          />

          <label className="mt-3 block text-xs font-semibold text-slate-500">
            Interviewer voice
            <select
              value={settings.voiceURI}
              onChange={(e) => updateSettings({ voiceURI: e.target.value })}
              disabled={!tts.supported || tts.voices.length === 0}
              className="focus-ring mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700"
            >
              <option value="">Automatic ({tts.selectedVoice?.name ?? 'browser default'})</option>
              {tts.voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>

          <label className="mt-3 block text-xs font-semibold text-slate-500">
            Speaking speed: {settings.rate.toFixed(2)}×
            <input
              type="range"
              min={0.7}
              max={1.4}
              step={0.05}
              value={settings.rate}
              onChange={(e) => updateSettings({ rate: Number(e.target.value) })}
              className="mt-1 block w-full accent-orange-500"
            />
          </label>

          <label className="mt-3 block text-xs font-semibold text-slate-500">
            Speech recognition language
            <select
              value={settings.lang}
              onChange={(e) => updateSettings({ lang: e.target.value })}
              className="focus-ring mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => tts.speak("Hello, I'll be your interviewer today. Tell me about yourself.")}
            disabled={!tts.supported}
            className="focus-ring mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <Volume2 size={15} /> Test voice
          </button>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Bot size={16} /> AI Interviewer
            </h2>
            <label className="block text-xs font-semibold text-slate-500">
              Provider
              <select
                value={settings.provider}
                onChange={(e) => updateSettings({ provider: e.target.value as VoiceSettings['provider'] })}
                className="focus-ring mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700"
              >
                <option value="auto">Automatic ({PROVIDER_LABELS[resolveProvider('auto')]})</option>
                <option value="server">{PROVIDER_LABELS.server}</option>
                <option value="ollama">{PROVIDER_LABELS.ollama}</option>
                <option value="offline">{PROVIDER_LABELS.offline}</option>
              </select>
            </label>
            <div className="mt-3 flex items-start gap-2 text-sm">
              {checking ? (
                <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin text-slate-400" />
              ) : ready ? (
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-500" />
              ) : (
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
              )}
              <p className="text-slate-600">{checking ? 'Checking connection…' : status?.detail}</p>
            </div>
            <button type="button" onClick={runCheck} className="focus-ring mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900">
              <RefreshCw size={13} /> Check again
            </button>
            {provider === 'offline' && (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Without an AI provider, follow-ups come from the follow-up questions stored with each question, and answers are scored by a keyword
                estimate that cannot check whether your claims are correct.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-slate-600">
            <h3 className="mb-2 flex items-center gap-1.5 font-semibold text-navy-900">
              <ShieldCheck size={15} /> Privacy
            </h3>
            <ul className="list-disc space-y-1 pl-4">
              <li>The app never records or stores audio. Only the text transcript is kept.</li>
              <li>
                Speech-to-text uses your browser's built-in speech recognition. In Chrome and Edge, the browser sends your audio to Google/Microsoft to
                transcribe it — this is how those browsers work, not something this app controls. Use text mode to avoid it.
              </li>
              <li>
                Transcripts are sent to the selected AI provider for evaluation:{' '}
                {provider === 'server' ? `${getStreamlitLlm().model ?? 'the AI provider'}, via this app's server` : provider === 'ollama' ? 'your local Ollama server' : 'nothing is sent (offline)'}.
              </li>
              <li>Completed interviews are saved with your progress (this browser, or your database when hosted on Streamlit).</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onStart(mode, difficulty, provider)}
          disabled={checking || !ready}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Mic size={16} /> Start Interview <ArrowRight size={16} />
        </button>
        {!checking && status && !ready && (
          <>
            <button
              type="button"
              onClick={() => onStart(mode, difficulty, 'offline')}
              className="focus-ring rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Continue with offline scoring
            </button>
            <p className="w-full text-sm text-slate-500">
              AI interviewer is temporarily unavailable. You can continue with offline scoring, or use the{' '}
              <Link to="/mock-interview" className="font-semibold text-brand-600 hover:underline">
                standard question mode
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className={`mb-3 flex cursor-pointer items-start justify-between gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <span>
        <span className="block text-sm font-medium text-slate-700">{label}</span>
        {description && <span className="block text-xs text-slate-400">{description}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-orange-500"
      />
    </label>
  )
}

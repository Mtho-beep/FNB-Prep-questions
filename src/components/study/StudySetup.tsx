import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, GraduationCap, Headphones, Loader2, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import type { Interactivity, PodcastStyle, StudyMode, StudySession } from '../../types/study'
import type { VoiceSettings } from '../../hooks/useVoiceSettings'
import { PROVIDER_LABELS, checkProvider, resolveProvider, type ProviderKind, type ProviderStatus } from '../../services/aiProvider'
import { CURRICULUM, STUDY_TOPICS, coveredTopicIds, repeatedStruggles, topicById, weakTopicScores, type StudyTopic } from '../../services/studyTopics'
import { INTERACTIVITY_LABELS } from '../../services/tutorContext'
import { STUDY_MODE_LABELS } from '../../utils/studyLinks'

export interface SetupChoice {
  kind: 'topic' | 'revision' | 'curriculum' | 'focus'
  topic?: StudyTopic
  focus?: string
  mode: StudyMode
  interactivity: Interactivity
  style: PodcastStyle
  provider: ProviderKind
}

const MODE_DESCRIPTIONS: Record<StudyMode, string> = {
  teach: 'From the basics: what, why, how, example, limitations, recap.',
  deep: 'Architecture, trade-offs, failure handling, production concerns.',
  interview: 'What FNB may ask, how to answer concisely, likely follow-ups.',
}

const GROUPS = ['AI & ML', 'Engineering', 'Your Projects & Experience', 'Interview Skills'] as const

interface StudySetupProps {
  settings: VoiceSettings
  updateSettings: (patch: Partial<VoiceSettings>) => void
  history: StudySession[]
  difficultIds: Set<string>
  requestedFocus?: string
  onStart: (choice: SetupChoice) => void
}

export function StudySetup({ settings, updateSettings, history, difficultIds, requestedFocus, onStart }: StudySetupProps) {
  const [topicId, setTopicId] = useState('rag')
  const [mode, setMode] = useState<StudyMode>('teach')
  const [interactivity, setInteractivity] = useState<Interactivity>('balanced')
  const [style, setStyle] = useState<PodcastStyle>('solo')
  const [status, setStatus] = useState<ProviderStatus | null>(null)
  const provider = resolveProvider(settings.provider)

  useEffect(() => {
    let cancelled = false
    checkProvider(provider).then((r) => !cancelled && setStatus(r))
    return () => {
      cancelled = true
    }
  }, [provider])

  const checking = status?.kind !== provider
  const aiReady = !checking && Boolean(status?.ready) && provider !== 'offline'
  const weak = useMemo(() => weakTopicScores(difficultIds, history), [difficultIds, history])
  const covered = useMemo(() => coveredTopicIds(history), [history])
  const struggles = useMemo(() => repeatedStruggles(history), [history])
  const nextCurriculum = CURRICULUM.map((id) => topicById.get(id)!).find((t) => !covered.has(t.id))
  const curriculumDone = CURRICULUM.filter((id) => covered.has(id)).length
  const topic = topicById.get(topicId)!

  // Use offline mode when the chosen provider can't be reached, so Start always works.
  const effectiveProvider: ProviderKind = aiReady ? provider : 'offline'
  const base = { mode, interactivity, style, provider: effectiveProvider }

  return (
    <div className="space-y-5">
      {requestedFocus && (
        <Banner>
          <span>
            Focused 10-minute lesson on <strong>{requestedFocus}</strong>.
          </span>
          <StartButton disabled={checking} onClick={() => onStart({ ...base, mode: 'teach', kind: 'focus', focus: requestedFocus })}>
            Start focused lesson
          </StartButton>
        </Banner>
      )}
      {struggles.slice(0, 2).map((s) => (
        <Banner key={s.concept}>
          <span>
            You have asked several questions about <strong>{s.concept}</strong>. Would you like a dedicated 10-minute lesson?
          </span>
          <StartButton disabled={checking} onClick={() => onStart({ ...base, mode: 'teach', kind: 'focus', focus: s.concept })}>
            Start lesson
          </StartButton>
        </Banner>
      ))}

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          disabled={checking}
          onClick={() => onStart({ ...base, mode: 'interview', kind: 'revision' })}
          className="focus-ring flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Zap size={20} />
          </span>
          <span>
            <span className="block font-semibold text-navy-900">⚡ 15-Minute Revision</span>
            <span className="block text-xs leading-snug text-slate-500">
              ML, LLMs, RAG, agents and your FNB project — weighted towards what you marked difficult.
            </span>
          </span>
        </button>
        <button
          type="button"
          disabled={checking || !nextCurriculum}
          onClick={() => nextCurriculum && onStart({ ...base, mode: 'teach', kind: 'curriculum', topic: nextCurriculum })}
          className="focus-ring flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
            <GraduationCap size={20} />
          </span>
          <span>
            <span className="block font-semibold text-navy-900">📚 Teach Me Everything</span>
            <span className="block text-xs leading-snug text-slate-500">
              AI interview curriculum: {curriculumDone}/{CURRICULUM.length} topics covered.{' '}
              {nextCurriculum ? `Next: ${nextCurriculum.label}.` : 'All covered — pick any topic to revise.'}
            </span>
          </span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Choose a topic</h2>
        <p className="mb-4 text-sm text-slate-500">Lessons are built from the questions, model answers and project notes already in this app.</p>
        <div className="space-y-4">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{group}</p>
              <div className="flex flex-wrap gap-2">
                {STUDY_TOPICS.filter((t) => t.group === group).map((t) => {
                  const selected = t.id === topicId
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopicId(t.id)}
                      aria-pressed={selected}
                      title={t.description}
                      className={[
                        'focus-ring flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                        selected ? 'bg-navy-900 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {t.label}
                      {covered.has(t.id) && <CheckCircle2 size={13} className={selected ? 'text-emerald-300' : 'text-emerald-500'} />}
                      {(weak.get(t.id) ?? 0) >= 1 && <span className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-amber-300' : 'bg-amber-500'}`} title="Needs work" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle" /> needs work (questions you marked difficult) ·{' '}
          <CheckCircle2 size={12} className="inline text-emerald-500" /> covered in a past session
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <Choice label="Mode">
            {(['teach', 'deep', 'interview'] as StudyMode[]).map((m) => (
              <Option key={m} selected={m === mode} onClick={() => setMode(m)} title={STUDY_MODE_LABELS[m]} description={MODE_DESCRIPTIONS[m]} />
            ))}
          </Choice>
          <Choice label="Interaction">
            {(['passive', 'balanced', 'interactive'] as Interactivity[]).map((i) => (
              <Option key={i} selected={i === interactivity} onClick={() => setInteractivity(i)} title={INTERACTIVITY_LABELS[i]} />
            ))}
          </Choice>
          <Choice label="Podcast style">
            <Option selected={style === 'solo'} onClick={() => setStyle('solo')} title="Solo tutor" description="One AI tutor teaches you." />
            <Option
              selected={style === 'duo'}
              onClick={() => setStyle('duo')}
              title="Two-person discussion (beta)"
              description="A host and an expert discuss the topic. Uses two voices when your browser has them."
            />
          </Choice>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2 text-sm">
            {checking ? (
              <Loader2 size={16} className="mt-0.5 animate-spin text-slate-400" />
            ) : aiReady ? (
              <ShieldCheck size={16} className="mt-0.5 text-emerald-500" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 text-amber-500" />
            )}
            <p className="text-slate-600">
              {checking
                ? 'Checking the AI tutor…'
                : aiReady
                  ? status?.detail
                  : `The AI tutor is unavailable (${status?.detail ?? 'no provider'}). Sessions will read your study notes instead of teaching conversationally.`}
            </p>
          </div>
          <label className="text-xs font-semibold text-slate-500">
            AI provider{' '}
            <select
              value={settings.provider}
              onChange={(e) => updateSettings({ provider: e.target.value as VoiceSettings['provider'] })}
              className="focus-ring ml-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-normal text-slate-700"
            >
              <option value="auto">Automatic ({PROVIDER_LABELS[resolveProvider('auto')]})</option>
              <option value="server">{PROVIDER_LABELS.server}</option>
              <option value="ollama">{PROVIDER_LABELS.ollama}</option>
              <option value="offline">{PROVIDER_LABELS.offline}</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Privacy: the app never records audio — only text. Chrome and Edge send your voice to Google/Microsoft to transcribe it. Your questions and
          the relevant study notes are sent to the selected AI provider.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <StartButton disabled={checking} onClick={() => onStart({ ...base, kind: 'topic', topic })} large>
          <Headphones size={17} /> {STUDY_MODE_LABELS[mode]}: {topic.label}
        </StartButton>
        <Link to="/study-sessions" className="focus-ring flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
          <BookOpen size={15} /> My Study Sessions
        </Link>
      </div>
    </div>
  )
}

function Banner({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-navy-900">{children}</div>
}

function StartButton({ children, onClick, disabled, large }: { children: ReactNode; onClick: () => void; disabled?: boolean; large?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 ${large ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-sm'}`}
    >
      {children}
      {!large && <Sparkles size={14} />}
      {large && <ArrowRight size={16} />}
    </button>
  )
}

function Choice({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Option({ selected, onClick, title, description }: { selected: boolean; onClick: () => void; title: string; description?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'focus-ring block w-full rounded-xl border px-3.5 py-2.5 text-left transition-colors',
        selected ? 'border-brand-500 bg-orange-50' : 'border-slate-200 bg-white hover:bg-slate-50',
      ].join(' ')}
    >
      <span className="block text-sm font-semibold text-navy-900">{title}</span>
      {description && <span className="block text-xs leading-snug text-slate-500">{description}</span>}
    </button>
  )
}

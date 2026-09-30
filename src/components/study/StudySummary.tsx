import { Link } from 'react-router-dom'
import { AlertTriangle, BookOpen, CheckCircle2, Circle, Clock, Headphones, HelpCircle, MessageCircleQuestion, Sparkles } from 'lucide-react'
import type { StudySession } from '../../types/study'
import { getStudySource } from '../../services/studyTopics'
import { formatDuration } from '../../utils/time'
import { Badge } from '../Badge'
import { STUDY_MODE_LABELS, sourceHref } from '../../utils/studyLinks'

const VERDICT_TONE = { correct: 'success', partly: 'warning', incorrect: 'danger' } as const

interface StudySummaryProps {
  session: StudySession
  onStartFocus?: (concept: string) => void
}

export function StudySummary({ session, onStartFocus }: StudySummaryProps) {
  const sources = session.sourceIds.map(getStudySource).filter((q) => q !== undefined)
  const recommended = session.weakConcepts[0]

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
          <Headphones size={14} /> Session {session.endedEarly ? 'ended' : 'complete'}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-navy-900">{session.topicLabel}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {STUDY_MODE_LABELS[session.mode]} · {session.interactivity} · {session.style === 'duo' ? 'two-person discussion' : 'solo tutor'} ·{' '}
          {new Date(session.date).toLocaleString()}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile icon={Clock} label="Duration" value={formatDuration(session.durationSec)} />
          <Tile icon={BookOpen} label="Sections covered" value={`${session.sectionsCovered.length}/${session.sectionTitles.length}`} />
          <Tile icon={MessageCircleQuestion} label="Questions you asked" value={String(session.questions.length)} />
          <Tile icon={HelpCircle} label="Checks & quizzes" value={String(session.checks.length)} />
        </div>
        <p className="mt-3 text-xs text-slate-400">Taught with: {session.provider}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Covered</h3>
          <ul className="space-y-1.5">
            {session.sectionTitles.map((title, i) => {
              const done = session.sectionsCovered.includes(i)
              return (
                <li key={i} className={`flex items-start gap-2 text-sm ${done ? 'text-slate-700' : 'text-slate-400'}`}>
                  {done ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /> : <Circle size={16} className="mt-0.5 shrink-0" />}
                  {title}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">You struggled with</h3>
            {session.weakConcepts.length === 0 ? (
              <p className="text-sm text-slate-400">Nothing flagged in this session.</p>
            ) : (
              <ul className="space-y-1.5">
                {session.weakConcepts.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" /> {c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {recommended && onStartFocus && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">Recommended next</p>
              <p className="mb-3 text-sm text-navy-900">10-minute lesson: {recommended}</p>
              <button
                type="button"
                onClick={() => onStartFocus(recommended)}
                className="focus-ring flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                <Sparkles size={15} /> Start focused lesson
              </button>
            </div>
          )}
        </div>
      </div>

      {(session.questions.length > 0 || session.checks.length > 0) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Your questions and answers</h3>
          <div className="space-y-4">
            {session.questions.map((q, i) => (
              <div key={`q${i}`} className="text-sm">
                <p className="font-semibold text-navy-900">
                  You asked: "{q.question}"{' '}
                  {!q.fromMaterial && <Badge tone="neutral">general knowledge</Badge>}
                </p>
                <p className="mt-1 leading-relaxed text-slate-600">{q.answer}</p>
              </div>
            ))}
            {session.checks.map((c, i) => (
              <div key={`c${i}`} className="text-sm">
                <p className="font-semibold text-navy-900">
                  {c.kind === 'quiz' ? 'Quiz' : 'Quick check'}: "{c.question}" <Badge tone={VERDICT_TONE[c.verdict]}>{c.verdict}</Badge>
                </p>
                <p className="mt-1 text-slate-500">Your answer: {c.answer}</p>
                <p className="mt-1 leading-relaxed text-slate-600">{c.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {sources.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">📚 Sources used in this lesson</h3>
          <SourceList ids={session.sourceIds} />
        </div>
      )}
    </div>
  )
}

export function SourceList({ ids }: { ids: string[] }) {
  return (
    <ul className="space-y-1">
      {ids.map((id) => {
        const q = getStudySource(id)
        if (!q) return null
        const href = sourceHref(id)
        const label = (
          <>
            <span className="flex-1">{q.text.length > 110 ? `${q.text.slice(0, 110)}…` : q.text}</span>
            <span className="shrink-0 text-xs text-slate-400">{q.category}</span>
          </>
        )
        return (
          <li key={id}>
            {href ? (
              <Link to={href} className="focus-ring flex items-start gap-2 rounded-lg p-1.5 text-sm text-navy-900 hover:bg-slate-50 hover:text-brand-600">
                {label}
              </Link>
            ) : (
              <span className="flex items-start gap-2 p-1.5 text-sm text-slate-600">{label}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Tile({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Icon size={16} className="mb-2 text-slate-400" />
      <p className="text-xl font-bold text-navy-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

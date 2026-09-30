import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, BookOpen, ChevronRight, Headphones, Trash2 } from 'lucide-react'
import type { UseProgressReturn } from '../hooks/useProgress'
import { StudySummary } from '../components/study/StudySummary'
import { STUDY_MODE_LABELS } from '../utils/studyLinks'
import { formatDuration } from '../utils/time'

interface StudySessionsPageProps {
  progress: UseProgressReturn
}

export function StudySessionsPage({ progress }: StudySessionsPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const sessions = progress.studySessionHistory
  const startFocus = (concept: string) => navigate('/study-podcast', { state: { focus: concept } })

  if (id) {
    const session = sessions.find((s) => s.id === id)
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/study-sessions" className="focus-ring flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
            <ArrowLeft size={16} /> All study sessions
          </Link>
          {session &&
            (confirmDelete ? (
              <span className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Delete this session?</span>
                <Link
                  to="/study-sessions"
                  onClick={() => progress.deleteStudySession(session.id)}
                  className="focus-ring rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Yes, delete
                </Link>
                <button type="button" onClick={() => setConfirmDelete(false)} className="focus-ring rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100">
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="focus-ring flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                <Trash2 size={14} /> Delete
              </button>
            ))}
        </div>
        {session ? (
          <StudySummary session={session} onStartFocus={startFocus} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">That session could not be found.</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-navy-900">
          <BookOpen size={20} className="text-brand-500" /> My Study Sessions
        </h1>
        <p className="text-sm text-slate-500">Every AI Study Podcast session: what was covered, what you asked, and what to revisit.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-slate-500">No study sessions yet.</p>
          <Link to="/study-podcast" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
            <Headphones size={16} /> Start your first lesson
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link to={`/study-sessions/${s.id}`} className="focus-ring group flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400">{new Date(s.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="font-semibold text-navy-900">{s.topicLabel}</p>
                  <p className="text-xs text-slate-500">
                    {formatDuration(s.durationSec)} · {STUDY_MODE_LABELS[s.mode]} · {s.interactivity} · {s.sectionsCovered.length}/{s.sectionTitles.length} sections ·{' '}
                    {s.questions.length} question{s.questions.length === 1 ? '' : 's'}
                  </p>
                  {s.weakConcepts.length > 0 && (
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-amber-700">
                      <AlertTriangle size={12} /> {s.weakConcepts.join(', ')}
                    </p>
                  )}
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-500" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

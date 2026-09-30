import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, History, Mic, Trash2 } from 'lucide-react'
import type { UseProgressReturn } from '../hooks/useProgress'
import { MODE_CONFIGS } from '../services/interviewPlanner'
import { InterviewReportView } from '../components/voice/InterviewReportView'
import { formatDuration } from '../utils/time'

interface InterviewHistoryPageProps {
  progress: UseProgressReturn
}

export function InterviewHistoryPage({ progress }: InterviewHistoryPageProps) {
  const { id } = useParams<{ id: string }>()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const sessions = progress.voiceInterviewHistory

  if (id) {
    const session = sessions.find((s) => s.id === id)
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/interview-history" className="focus-ring flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
            <ArrowLeft size={16} /> All interviews
          </Link>
          {session &&
            (confirmDelete ? (
              <span className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Delete this interview?</span>
                <Link
                  to="/interview-history"
                  onClick={() => progress.deleteVoiceInterviewSession(session.id)}
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
          <InterviewReportView session={session} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">That interview could not be found.</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-navy-900">
          <History size={20} className="text-brand-500" /> Interview History
        </h1>
        <p className="text-sm text-slate-500">Your completed AI voice mock interviews. Select one to review answers, feedback and scores.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-slate-500">No voice interviews yet.</p>
          <Link
            to="/voice-interview"
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            <Mic size={16} /> Start your first interview
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link to={`/interview-history/${s.id}`} className="focus-ring group flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                <div className="flex-1">
                  <p className="text-xs text-slate-400">
                    {new Date(s.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="font-semibold text-navy-900">{MODE_CONFIGS[s.mode].label}</p>
                  <p className="text-xs text-slate-500">
                    {formatDuration(s.durationSec)} · {s.turns.filter((t) => t.answer !== undefined).length} answered · {s.difficulty}
                    {s.endedEarly ? ' · ended early' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-navy-900">{s.report?.overall != null ? `${s.report.overall}%` : '—'}</p>
                  <p className="text-xs text-slate-400">{s.report?.label}</p>
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

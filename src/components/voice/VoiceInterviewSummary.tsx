import { Link } from 'react-router-dom'
import { ChevronRight, History, Mic } from 'lucide-react'
import type { UseProgressReturn } from '../../hooks/useProgress'
import { getSourceQuestion } from '../../services/interviewAdapter'

/** Dashboard section summarising completed voice mock interviews. */
export function VoiceInterviewSummary({ progress }: { progress: UseProgressReturn }) {
  const { voiceStats } = progress
  const last = voiceStats.last
  const recommended = (last?.report?.recommendedQuestionIds ?? []).map(getSourceQuestion).filter((q) => q !== undefined).slice(0, 3)
  const pct = (v: number | null) => (v === null ? '—' : `${v}%`)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <Mic size={16} /> Voice Mock Interviews
        </h2>
        <div className="flex gap-2">
          {voiceStats.completed > 0 && (
            <Link
              to="/interview-history"
              className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <History size={14} /> History
            </Link>
          )}
          <Link
            to="/voice-interview"
            className="focus-ring flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
          >
            <Mic size={14} /> Start voice interview
          </Link>
        </div>
      </div>

      {voiceStats.completed === 0 ? (
        <p className="text-sm text-slate-400">
          No voice interviews yet. Try the 15-minute FNB mock interview — speak your answers and get adaptive follow-ups and a practice report.
        </p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid grid-cols-3 gap-3">
            <Tile label="Interviews completed" value={String(voiceStats.completed)} />
            <Tile label="Average practice score" value={pct(voiceStats.averageScore)} />
            <Tile label="Last interview" value={last?.report?.overall != null ? `${last.report.overall}%` : '—'} />
            <Tile label="Technical" value={pct(voiceStats.technical)} />
            <Tile label="Communication" value={pct(voiceStats.communication)} />
            <Tile label="Project" value={pct(voiceStats.project)} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended from your last interview</p>
            {recommended.length === 0 ? (
              <p className="text-sm text-slate-400">Nothing flagged — keep practising a mix of modes.</p>
            ) : (
              <ul className="space-y-1">
                {recommended.map((q) => (
                  <li key={q.id}>
                    <Link to={`/question/${q.id}`} className="focus-ring group flex items-center justify-between gap-2 rounded-lg p-2 text-sm hover:bg-slate-50">
                      <span className="text-navy-900 group-hover:text-brand-600">{q.question}</span>
                      <ChevronRight size={14} className="shrink-0 text-slate-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-lg font-bold text-navy-900">{value}</p>
      <p className="text-[11px] leading-tight text-slate-500">{label}</p>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Clock, Code2, MessageSquareText, SkipForward, Sparkles, Target } from 'lucide-react'
import type { InterviewTurn, ScoreArea, VoiceInterviewSession } from '../../types/interview'
import { getInterviewQuestion } from '../../services/interviewAdapter'
import { MODE_CONFIGS } from '../../services/interviewPlanner'
import { QUALITY_LABELS, SCORE_AREA_LABELS, SCORE_WEIGHTS } from '../../services/interviewEvaluator'
import { allQuestions } from '../../data'
import { AnswerDropdown } from '../AnswerDropdown'
import { ProgressBar } from '../ProgressBar'
import { Badge } from '../Badge'
import { formatDuration } from '../../utils/time'

const AREA_ORDER: ScoreArea[] = ['technical', 'project', 'problemSolving', 'communication', 'behavioural', 'fundamentals', 'confidence']

function scoreColor(score: number): string {
  if (score >= 85) return 'bg-emerald-500'
  if (score >= 70) return 'bg-brand-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-rose-500'
}

const qualityTone = {
  strong: 'success',
  partial: 'warning',
  weak: 'danger',
  'off-topic': 'danger',
  unclear: 'warning',
} as const

function TurnReview({ turn, index }: { turn: InterviewTurn; index: number }) {
  const [showModel, setShowModel] = useState(false)
  const source = turn.sourceId ? getInterviewQuestion(turn.sourceId) : undefined
  const e = turn.evaluation

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">
          {index + 1}. {turn.kind === 'main' ? 'QUESTION' : 'FOLLOW-UP'} · {turn.phase}
        </span>
        {turn.skipped && <Badge tone="neutral">Skipped</Badge>}
        {e && <Badge tone={qualityTone[e.quality]}>{QUALITY_LABELS[e.quality]}</Badge>}
        {e?.source === 'offline' && <Badge tone="neutral">Offline estimate</Badge>}
      </div>
      <p className="mb-3 font-semibold leading-snug text-navy-900">"{turn.text}"</p>

      {!turn.skipped && turn.answer !== undefined && (
        <div className="mb-3">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Your answer</h4>
          <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            {turn.answer || <span className="text-slate-400">(empty)</span>}
          </p>
        </div>
      )}

      {e && (
        <div className="mb-3 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Feedback</h4>
          {e.feedback && <p className="text-sm leading-relaxed text-slate-600">{e.feedback}</p>}
          {e.strengths.length > 0 && (
            <ul className="space-y-1">
              {e.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                  {s}
                </li>
              ))}
            </ul>
          )}
          {e.missing.length > 0 && (
            <ul className="space-y-1">
              {e.missing.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-500" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {source?.sourceType === 'coding' && (
        <Link to={`/coderbyte#${source.sourceId}`} className="focus-ring mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
          <Code2 size={15} /> Practise this problem in the coding editor
        </Link>
      )}

      {source?.modelAnswer && (
        <>
          {turn.kind !== 'main' && (
            <p className="mb-2 text-xs text-slate-400">Model answer for the question this follow-up came from: "{source.text}"</p>
          )}
          <AnswerDropdown
            isOpen={showModel}
            onToggle={() => setShowModel((v) => !v)}
            answer={source.modelAnswer}
            keyPoints={source.keyPoints}
            followUps={source.sourceType === 'question' ? source.followUps : []}
            projectConnection={source.sourceType === 'question' ? source.projectContext : undefined}
          />
        </>
      )}
    </div>
  )
}

export function InterviewReportView({ session }: { session: VoiceInterviewSession }) {
  const report = session.report
  const answered = session.turns.filter((t) => t.answer !== undefined && !t.skipped)
  const followUps = session.turns.filter((t) => t.kind !== 'main').length
  const skipped = session.turns.filter((t) => t.skipped).length
  const questionById = new Map(allQuestions.map((q) => [q.id, q]))

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{MODE_CONFIGS[session.mode].label}</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">
              {report?.overall != null ? `${report.overall}%` : '—'}{' '}
              <span className="text-base font-semibold text-slate-500">{report?.label}</span>
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Practice score only — it is not a prediction of whether you would pass a real interview.
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>{new Date(session.date).toLocaleString()}</p>
            <p>Scored with: {report?.source === 'ai' ? session.provider : 'offline estimate'}</p>
            {session.endedEarly && <p className="text-amber-600">Ended early</p>}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryTile icon={Clock} label="Interview duration" value={formatDuration(session.durationSec)} />
          <SummaryTile icon={MessageSquareText} label="Questions answered" value={String(answered.length)} />
          <SummaryTile icon={Sparkles} label="Follow-up questions" value={String(followUps)} />
          <SummaryTile icon={SkipForward} label="Questions skipped" value={String(skipped)} />
        </div>

        {report?.summary && <p className="mt-5 text-sm leading-relaxed text-slate-600">{report.summary}</p>}
      </div>

      {report && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Practice Scores</h3>
            <div className="space-y-3">
              {AREA_ORDER.map((area) => {
                const score = report.areaScores[area]
                return (
                  <div key={area}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-700">
                        {SCORE_AREA_LABELS[area]} <span className="text-xs text-slate-400">(weight {SCORE_WEIGHTS[area]})</span>
                      </span>
                      <span className="font-semibold text-navy-900">{score != null ? `${score}%` : 'not assessed'}</span>
                    </div>
                    <ProgressBar percent={score ?? 0} colorClass={score != null ? scoreColor(score) : 'bg-slate-200'} sizeClass="h-2" />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <ListCard title="Strengths" items={report.strengths} icon="good" empty="No clear strengths recorded yet." />
            <ListCard title="Areas to Improve" items={report.improvements} icon="warn" empty="Nothing specific flagged." />
          </div>
        </div>
      )}

      {report && report.recommendedQuestionIds.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Target size={16} /> Recommended Practice
          </h3>
          <ol className="space-y-2">
            {report.recommendedQuestionIds.map((id, i) => {
              const q = questionById.get(id)
              if (!q) return null
              return (
                <li key={id}>
                  <Link to={`/question/${id}`} className="focus-ring group flex items-start gap-2 rounded-lg p-2 text-sm hover:bg-slate-50">
                    <span className="font-semibold text-slate-400">{i + 1}.</span>
                    <span className="flex-1 text-navy-900 group-hover:text-brand-600">{q.question}</span>
                    <span className="shrink-0 text-xs text-slate-400">{q.category}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Answer Transcript Review</h3>
        <div className="space-y-3">
          {session.turns.map((t, i) => (
            <TurnReview key={t.id} turn={t} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SummaryTile({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Icon size={16} className="mb-2 text-slate-400" />
      <p className="text-xl font-bold text-navy-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

function ListCard({ title, items, icon, empty }: { title: string; items: string[]; icon: 'good' | 'warn'; empty: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
              {icon === 'good' ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
              ) : (
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
              )}
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

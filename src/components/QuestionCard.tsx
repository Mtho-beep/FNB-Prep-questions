import { useState } from 'react'
import { Award, Flag, ArrowLeft, ArrowRight, PenLine, Check } from 'lucide-react'
import type { Question, QuestionProgress } from '../types/questions'
import { DifficultyBadge } from './Badge'
import { AnswerDropdown } from './AnswerDropdown'

interface QuestionCardProps {
  question: Question
  index: number
  total: number
  progress: QuestionProgress
  onToggleMastered: () => void
  onToggleDifficult: () => void
  onMarkCompleted: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
  /** Mock-interview mode hides the "think & answer" scratchpad quick actions and adjusts labels. */
  variant?: 'practice' | 'mock'
}

export function QuestionCard({
  question,
  index,
  total,
  progress,
  onToggleMastered,
  onToggleDifficult,
  onMarkCompleted,
  onNext,
  onPrevious,
  hasNext = true,
  hasPrevious = true,
  variant = 'practice',
}: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showScratchpad, setShowScratchpad] = useState(false)
  const [attemptedSelf, setAttemptedSelf] = useState(false)
  const [draft, setDraft] = useState('')

  // Note: the parent (Practice page) renders this component with
  // `key={question.id}`, so React fully remounts it on question change —
  // local state above always starts fresh per question without needing
  // an effect to reset it.

  const handleShowAnswer = () => {
    const next = !showAnswer
    setShowAnswer(next)
    if (next) onMarkCompleted()
  }

  return (
    <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-400">
            {variant === 'mock' ? `INTERVIEW QUESTION ${index + 1}/${total}` : `Question ${index + 1} of ${total}`}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-medium text-slate-500">{question.category}</span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
        <div className="flex items-center gap-1.5">
          {progress.mastered && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              <Award size={12} /> Mastered
            </span>
          )}
          {progress.difficult && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
              <Flag size={12} /> Difficult
            </span>
          )}
        </div>
      </div>

      <h3 className="mb-5 text-lg font-semibold leading-snug text-navy-900 sm:text-xl">{question.question}</h3>

      <div className="mb-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setShowScratchpad((v) => !v)}
          className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-800 shadow-sm transition-colors hover:bg-slate-50"
        >
          <PenLine size={16} />
          Think &amp; Answer
        </button>
        {!attemptedSelf && (
          <button
            type="button"
            onClick={() => setAttemptedSelf(true)}
            className="focus-ring flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100"
          >
            <Check size={16} />
            I Answered It Myself
          </button>
        )}
      </div>

      {showScratchpad && (
        <div className="animate-fade-in mb-5">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Practice answering out loud, or jot your answer here before revealing the model answer..."
            rows={4}
            className="focus-ring w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>
      )}

      <AnswerDropdown
        isOpen={showAnswer}
        onToggle={handleShowAnswer}
        answer={question.answer}
        keyPoints={question.keyPoints}
        followUps={question.followUps}
        projectConnection={question.projectConnection}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onToggleMastered}
            className={[
              'focus-ring flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
              progress.mastered
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            <Award size={16} />
            {progress.mastered ? 'Mastered' : 'Mark Mastered'}
          </button>
          <button
            type="button"
            onClick={onToggleDifficult}
            className={[
              'focus-ring flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
              progress.difficult
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            <Flag size={16} />
            {progress.difficult ? 'Difficult' : 'Mark Difficult'}
          </button>
        </div>

        {(onNext || onPrevious) && (
          <div className="flex gap-2.5">
            {onPrevious && (
              <button
                type="button"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="focus-ring flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

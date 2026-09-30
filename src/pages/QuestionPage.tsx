import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { UseProgressReturn } from '../hooks/useProgress'
import { getSourceQuestion } from '../services/interviewAdapter'
import { categoryToSlug } from '../utils/slug'
import { QuestionCard } from '../components/QuestionCard'

interface QuestionPageProps {
  progress: UseProgressReturn
}

/** A single existing question, opened from interview recommendations. */
export function QuestionPage({ progress }: QuestionPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const question = id ? getSourceQuestion(id) : undefined

  useEffect(() => {
    if (question) progress.markViewed(question.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id])

  if (!question) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">Question not found.</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => navigate(-1)} className="focus-ring flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
          <ArrowLeft size={16} /> Back
        </button>
        <Link to={`/practice/${categoryToSlug(question.category)}`} className="focus-ring text-sm font-semibold text-brand-600 hover:underline">
          Browse all {question.category} questions
        </Link>
      </div>
      <QuestionCard
        key={question.id}
        question={question}
        index={0}
        total={1}
        progress={progress.getProgress(question.id)}
        onToggleMastered={() => progress.toggleMastered(question.id)}
        onToggleDifficult={() => progress.toggleDifficult(question.id)}
        onToggleFavorite={() => progress.toggleFavorite(question.id)}
        onMarkCompleted={() => progress.markCompleted(question.id)}
        hasNext={false}
        hasPrevious={false}
      />
    </div>
  )
}

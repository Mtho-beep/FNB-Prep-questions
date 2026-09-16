import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Shuffle, Flag, ListChecks, Star } from 'lucide-react'
import type { UseProgressReturn } from '../hooks/useProgress'
import { useQuestions, defaultFilters } from '../hooks/useQuestions'
import { allQuestions, questionsByCategory } from '../data'
import { slugToCategory } from '../utils/slug'
import { QuestionCard } from '../components/QuestionCard'
import { SearchBar } from '../components/SearchBar'
import { Filters } from '../components/Filters'

interface PracticeProps {
  progress: UseProgressReturn
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function Practice({ progress }: PracticeProps) {
  const { mode } = useParams<{ mode: string }>()
  const navigate = useNavigate()
  const isRandomMode = mode === 'random'
  const isWeakAreaMode = mode === 'weak-areas'
  const isFavoritesMode = mode === 'favorites'
  const category = mode && !isRandomMode && !isWeakAreaMode && !isFavoritesMode ? slugToCategory(mode) : undefined

  const [randomOrder, setRandomOrder] = useState<string[]>(() => shuffle(allQuestions.map((q) => q.id)))
  const [index, setIndex] = useState(0)

  const questionHook = useQuestions(progress, category ? questionsByCategory(category) : allQuestions)

  // Reset the filter panel's category selector to match the current route category.
  useEffect(() => {
    if (category) {
      questionHook.setCategory(category)
    } else {
      questionHook.setCategory(defaultFilters.category)
    }
    setIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    setIndex(0)
  }, [questionHook.filters.search, questionHook.filters.difficulty, questionHook.filters.status])

  const activeList = useMemo(() => {
    if (isWeakAreaMode) return questionHook.weakAreaQuestions
    if (isFavoritesMode) return questionHook.favoriteQuestions
    if (isRandomMode) {
      const byId = new Map(allQuestions.map((q) => [q.id, q]))
      return randomOrder.map((id) => byId.get(id)!).filter(Boolean)
    }
    return questionHook.filteredQuestions
  }, [
    isWeakAreaMode,
    isFavoritesMode,
    isRandomMode,
    randomOrder,
    questionHook.filteredQuestions,
    questionHook.weakAreaQuestions,
    questionHook.favoriteQuestions,
  ])

  const currentQuestion = activeList[Math.min(index, Math.max(activeList.length - 1, 0))]

  useEffect(() => {
    if (currentQuestion) progress.markViewed(currentQuestion.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id])

  function handleReshuffle() {
    setRandomOrder(shuffle(allQuestions.map((q) => q.id)))
    setIndex(0)
  }

  const pageTitle = isRandomMode
    ? 'Random Mode'
    : isWeakAreaMode
      ? 'Weak Areas Mode'
      : isFavoritesMode
        ? 'Favorites'
        : category ?? 'All Questions'

  const pageDescription = isRandomMode
    ? 'Questions are pulled from every category in random order.'
    : isWeakAreaMode
      ? 'Only questions marked difficult, or not yet completed, appear here.'
      : isFavoritesMode
        ? 'Questions you starred. Tap the star on any question to add or remove it.'
        : 'Work through this category sequentially, or use search and filters to jump around.'

  if (!category && !isRandomMode && !isWeakAreaMode && !isFavoritesMode) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500">Unknown category. Please choose one from the sidebar.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            {isRandomMode && <Shuffle size={18} className="text-indigo-500" />}
            {isWeakAreaMode && <Flag size={18} className="text-rose-500" />}
            {isFavoritesMode && <Star size={18} className="text-amber-500" />}
            {!isRandomMode && !isWeakAreaMode && !isFavoritesMode && <ListChecks size={18} className="text-brand-500" />}
            <h1 className="text-xl font-bold text-navy-900">{pageTitle}</h1>
          </div>
          <p className="text-sm text-slate-500">{pageDescription}</p>
        </div>
        {isRandomMode && (
          <button
            type="button"
            onClick={handleReshuffle}
            className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <Shuffle size={16} />
            Shuffle Again
          </button>
        )}
      </div>

      {!isWeakAreaMode && !isFavoritesMode && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:flex-1">
            <SearchBar value={questionHook.filters.search} onChange={questionHook.setSearch} />
          </div>
          <Filters
            filters={questionHook.filters}
            onCategoryChange={(c) => {
              questionHook.setCategory(c)
              if (c === 'All') navigate('/practice/random')
            }}
            onDifficultyChange={questionHook.setDifficulty}
            onStatusChange={questionHook.setStatus}
            onClear={questionHook.clearFilters}
            showCategoryFilter={!category}
          />
        </div>
      )}

      {activeList.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            {isWeakAreaMode
              ? "No weak areas right now — nothing is marked difficult or incomplete. Nice work!"
              : isFavoritesMode
                ? 'No favorites yet. Tap the star on any question to save it here.'
                : 'No questions match your current search/filters.'}
          </p>
        </div>
      ) : (
        currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            index={index}
            total={activeList.length}
            progress={progress.getProgress(currentQuestion.id)}
            onToggleMastered={() => progress.toggleMastered(currentQuestion.id)}
            onToggleDifficult={() => progress.toggleDifficult(currentQuestion.id)}
            onToggleFavorite={() => progress.toggleFavorite(currentQuestion.id)}
            onMarkCompleted={() => progress.markCompleted(currentQuestion.id)}
            onNext={() => setIndex((i) => Math.min(i + 1, activeList.length - 1))}
            onPrevious={() => setIndex((i) => Math.max(i - 1, 0))}
            hasNext={index < activeList.length - 1}
            hasPrevious={index > 0}
          />
        )
      )}
    </div>
  )
}

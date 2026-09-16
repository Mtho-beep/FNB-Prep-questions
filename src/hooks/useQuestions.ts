import { useMemo, useState } from 'react'
import type { Category, Difficulty, FilterState, Question } from '../types/questions'
import { allQuestions } from '../data'
import type { UseProgressReturn } from './useProgress'

export const defaultFilters: FilterState = {
  category: 'All',
  difficulty: 'All',
  status: 'All',
  search: '',
}

/**
 * Provides filtered/searched question lists driven by a FilterState, plus
 * setters for each individual filter dimension. Used by the Practice page,
 * search bar and filter panel together.
 */
export function useQuestions(progress: UseProgressReturn, source: Question[] = allQuestions) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const setCategory = (category: Category | 'All') => setFilters((f) => ({ ...f, category }))
  const setDifficulty = (difficulty: Difficulty | 'All') => setFilters((f) => ({ ...f, difficulty }))
  const setStatus = (status: FilterState['status']) => setFilters((f) => ({ ...f, status }))
  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }))
  const clearFilters = () => setFilters(defaultFilters)

  const filteredQuestions = useMemo(() => {
    const term = filters.search.trim().toLowerCase()

    return source.filter((q) => {
      if (filters.category !== 'All' && q.category !== filters.category) return false
      if (filters.difficulty !== 'All' && q.difficulty !== filters.difficulty) return false

      if (filters.status !== 'All') {
        const p = progress.getProgress(q.id)
        if (filters.status === 'Completed' && !p.completed) return false
        if (filters.status === 'Not Completed' && p.completed) return false
        if (filters.status === 'Mastered' && !p.mastered) return false
        if (filters.status === 'Difficult' && !p.difficult) return false
      }

      if (term) {
        const haystack = [
          q.question,
          q.answer,
          q.category,
          ...q.keyPoints,
          ...q.followUps,
          ...q.tags,
          q.projectConnection ?? '',
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(term)) return false
      }

      return true
    })
  }, [source, filters, progress])

  const weakAreaQuestions = useMemo(
    () =>
      source.filter((q) => {
        const p = progress.getProgress(q.id)
        return p.difficult || !p.completed
      }),
    [source, progress],
  )

  return {
    filters,
    setCategory,
    setDifficulty,
    setStatus,
    setSearch,
    clearFilters,
    filteredQuestions,
    weakAreaQuestions,
  }
}

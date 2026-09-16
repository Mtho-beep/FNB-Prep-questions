import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Category, MockInterviewSession, ProgressState, QuestionProgress } from '../types/questions'
import { allQuestions, coderbyteQuestions, practiceCategories, questionsByCategory } from '../data'

const STORAGE_KEY = 'fnb-ai-interview-prep:progress:v1'

const emptyProgressState: ProgressState = {
  questions: {},
  mockInterviewHistory: [],
}

function getOrDefault(questions: Record<string, QuestionProgress>, id: string): QuestionProgress {
  return questions[id] ?? { completed: false, mastered: false, difficult: false }
}

/**
 * Central progress-tracking hook. Wraps a single LocalStorage-persisted
 * ProgressState object and exposes convenient read/write helpers used
 * throughout the app (question cards, dashboard stats, mock interview).
 */
export function useProgress() {
  const [state, setState] = useLocalStorage<ProgressState>(STORAGE_KEY, emptyProgressState)

  const getProgress = useCallback((id: string) => getOrDefault(state.questions, id), [state.questions])

  const markViewed = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        lastViewedQuestionId: id,
        questions: {
          ...prev.questions,
          [id]: { ...getOrDefault(prev.questions, id), lastViewedAt: new Date().toISOString() },
        },
      }))
    },
    [setState],
  )

  const markCompleted = useCallback(
    (id: string, completed = true) => {
      setState((prev) => ({
        ...prev,
        questions: {
          ...prev.questions,
          [id]: { ...getOrDefault(prev.questions, id), completed },
        },
      }))
    },
    [setState],
  )

  const toggleMastered = useCallback(
    (id: string) => {
      setState((prev) => {
        const current = getOrDefault(prev.questions, id)
        return {
          ...prev,
          questions: {
            ...prev.questions,
            [id]: {
              ...current,
              mastered: !current.mastered,
              difficult: !current.mastered ? false : current.difficult,
              completed: true,
            },
          },
        }
      })
    },
    [setState],
  )

  const toggleDifficult = useCallback(
    (id: string) => {
      setState((prev) => {
        const current = getOrDefault(prev.questions, id)
        return {
          ...prev,
          questions: {
            ...prev.questions,
            [id]: {
              ...current,
              difficult: !current.difficult,
              mastered: !current.difficult ? current.mastered : false,
              completed: true,
            },
          },
        }
      })
    },
    [setState],
  )

  const addMockInterviewSession = useCallback(
    (session: MockInterviewSession) => {
      setState((prev) => ({
        ...prev,
        mockInterviewHistory: [session, ...prev.mockInterviewHistory].slice(0, 50),
      }))
    },
    [setState],
  )

  const resetProgress = useCallback(() => {
    setState(emptyProgressState)
  }, [setState])

  const stats = useMemo(() => {
    const allIds = [...allQuestions.map((q) => q.id), ...coderbyteQuestions.map((q) => q.id)]
    const totalQuestions = allIds.length
    let completed = 0
    let mastered = 0
    let difficult = 0
    for (const id of allIds) {
      const p = getOrDefault(state.questions, id)
      if (p.completed) completed++
      if (p.mastered) mastered++
      if (p.difficult) difficult++
    }

    const categoryProgress: Record<Category, { total: number; completed: number; mastered: number }> = {} as Record<
      Category,
      { total: number; completed: number; mastered: number }
    >
    for (const category of practiceCategories) {
      const qs = questionsByCategory(category)
      let catCompleted = 0
      let catMastered = 0
      for (const q of qs) {
        const p = getOrDefault(state.questions, q.id)
        if (p.completed) catCompleted++
        if (p.mastered) catMastered++
      }
      categoryProgress[category] = { total: qs.length, completed: catCompleted, mastered: catMastered }
    }

    return {
      totalQuestions,
      completed,
      remaining: totalQuestions - completed,
      mastered,
      difficult,
      percentComplete: totalQuestions === 0 ? 0 : Math.round((completed / totalQuestions) * 100),
      categoryProgress,
    }
  }, [state.questions])

  const recentActivity = useMemo(() => {
    return Object.entries(state.questions)
      .filter(([, p]) => p.lastViewedAt)
      .sort((a, b) => new Date(b[1].lastViewedAt!).getTime() - new Date(a[1].lastViewedAt!).getTime())
      .slice(0, 8)
      .map(([id]) => id)
  }, [state.questions])

  return {
    state,
    getProgress,
    markViewed,
    markCompleted,
    toggleMastered,
    toggleDifficult,
    addMockInterviewSession,
    resetProgress,
    stats,
    recentActivity,
  }
}

export type UseProgressReturn = ReturnType<typeof useProgress>

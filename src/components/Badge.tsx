import type { ReactNode } from 'react'
import type { Difficulty } from '../types/questions'

const difficultyStyles: Record<Difficulty, string> = {
  Beginner: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 ring-amber-200',
  Advanced: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${difficultyStyles[difficulty]}`}
    >
      {difficulty}
    </span>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
    brand: 'bg-orange-50 text-brand-600 ring-orange-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  )
}

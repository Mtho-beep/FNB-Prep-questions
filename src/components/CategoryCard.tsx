import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Category } from '../types/questions'
import { categoryToSlug } from '../utils/slug'
import { ProgressBar } from './ProgressBar'

interface CategoryCardProps {
  category: Category
  total: number
  completed: number
  mastered: number
}

export function CategoryCard({ category, total, completed, mastered }: CategoryCardProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <Link
      to={`/practice/${categoryToSlug(category)}`}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-navy-900">{category}</h3>
        <ChevronRight size={16} className="mt-0.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
          <span>
            {completed}/{total} completed
          </span>
          <span>{mastered} mastered</span>
        </div>
        <ProgressBar percent={percent} sizeClass="h-1.5" />
      </div>
    </Link>
  )
}

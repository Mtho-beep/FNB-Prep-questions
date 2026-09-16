import type { Category, Difficulty, FilterState } from '../types/questions'
import { practiceCategories } from '../data'

interface FiltersProps {
  filters: FilterState
  onCategoryChange: (category: Category | 'All') => void
  onDifficultyChange: (difficulty: Difficulty | 'All') => void
  onStatusChange: (status: FilterState['status']) => void
  onClear: () => void
  showCategoryFilter?: boolean
}

const difficulties: (Difficulty | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced']
const statuses: FilterState['status'][] = ['All', 'Completed', 'Not Completed', 'Mastered', 'Difficult']

function selectClasses() {
  return 'focus-ring rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm'
}

export function Filters({ filters, onCategoryChange, onDifficultyChange, onStatusChange, onClear, showCategoryFilter = true }: FiltersProps) {
  const isFiltered =
    filters.category !== 'All' || filters.difficulty !== 'All' || filters.status !== 'All' || filters.search !== ''

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {showCategoryFilter && (
        <select
          value={filters.category}
          onChange={(e) => onCategoryChange(e.target.value as Category | 'All')}
          className={selectClasses()}
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {practiceCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}

      <select
        value={filters.difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'All')}
        className={selectClasses()}
        aria-label="Filter by difficulty"
      >
        {difficulties.map((d) => (
          <option key={d} value={d}>
            {d === 'All' ? 'All Difficulties' : d}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onStatusChange(e.target.value as FilterState['status'])}
        className={selectClasses()}
        aria-label="Filter by status"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s === 'All' ? 'All Statuses' : s}
          </option>
        ))}
      </select>

      {isFiltered && (
        <button
          type="button"
          onClick={onClear}
          className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-orange-50"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

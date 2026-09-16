import type { ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayCircle, Shuffle, Flag, MessageSquareText, Code2, Clock, Award, TrendingUp, Star } from 'lucide-react'
import type { UseProgressReturn } from '../hooks/useProgress'
import { allQuestions, coderbyteQuestions, practiceCategories, totalAllQuestions } from '../data'
import { ProgressBar } from '../components/ProgressBar'
import { CategoryCard } from '../components/CategoryCard'
import { categoryToSlug } from '../utils/slug'

interface DashboardProps {
  progress: UseProgressReturn
}

function findQuestionById(id: string) {
  return [...allQuestions, ...coderbyteQuestions].find((q) => q.id === id)
}

export function Dashboard({ progress }: DashboardProps) {
  const navigate = useNavigate()
  const { stats, recentActivity } = progress

  const actionCards = [
    {
      label: 'Continue Practice',
      description: 'Pick up where you left off, or browse a category',
      icon: PlayCircle,
      onClick: () => navigate(`/practice/${categoryToSlug(practiceCategories[0])}`),
      color: 'bg-brand-500',
    },
    {
      label: 'Random Question',
      description: 'Jump into a random question from any category',
      icon: Shuffle,
      onClick: () => navigate('/practice/random'),
      color: 'bg-indigo-500',
    },
    {
      label: 'Weak Areas',
      description: 'Focus on questions marked difficult or not yet completed',
      icon: Flag,
      onClick: () => navigate('/practice/weak-areas'),
      color: 'bg-rose-500',
    },
    {
      label: 'Favorites',
      description: 'Revisit the questions you starred',
      icon: Star,
      onClick: () => navigate('/practice/favorites'),
      color: 'bg-amber-500',
    },
    {
      label: 'Mock Interview',
      description: 'Simulate a real interview across all categories',
      icon: MessageSquareText,
      onClick: () => navigate('/mock-interview'),
      color: 'bg-emerald-500',
    },
    {
      label: 'Coderbyte Assessment',
      description: 'Practice technical coding questions',
      icon: Code2,
      onClick: () => navigate('/coderbyte'),
      color: 'bg-navy-800',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">FNB AI Interview Prep</p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">Interview Preparation Progress</h1>
        <div className="mt-5">
          <ProgressBar percent={stats.percentComplete} sizeClass="h-3" />
          <p className="mt-2 text-sm text-slate-500">
            Questions completed: <span className="font-semibold text-navy-900">{stats.completed}</span> /{' '}
            {stats.totalQuestions} ({stats.percentComplete}%)
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total Questions" value={totalAllQuestions} icon={TrendingUp} />
          <StatTile label="Completed" value={stats.completed} icon={PlayCircle} />
          <StatTile label="Remaining" value={stats.remaining} icon={Clock} />
          <StatTile label="Mastered" value={stats.mastered} icon={Award} accent="text-emerald-600" />
        </div>
        {stats.favorites > 0 && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-amber-600">
            <Star size={14} />
            {stats.favorites} favorite question{stats.favorites === 1 ? '' : 's'} saved.
          </p>
        )}
        {stats.difficult > 0 && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-rose-600">
            <Flag size={14} />
            {stats.difficult} question{stats.difficult === 1 ? '' : 's'} marked as difficult — check Weak Areas mode.
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {actionCards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={card.onClick}
              className="focus-ring flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color} text-white`}>
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900">{card.label}</p>
                <p className="mt-0.5 text-xs leading-snug text-slate-500">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Category Progress</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {practiceCategories.map((category) => {
            const cat = stats.categoryProgress[category]
            return <CategoryCard key={category} category={category} total={cat.total} completed={cat.completed} mastered={cat.mastered} />
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Practice Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-400">No activity yet — start practicing to see your recent questions here.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentActivity.map((id) => {
              const q = findQuestionById(id)
              if (!q) return null
              const label = 'question' in q ? q.question : q.title
              const category = 'category' in q ? q.category : 'Coderbyte Technical Assessment'
              return (
                <li key={id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="truncate text-slate-700">{label}</span>
                  <span className="shrink-0 text-xs text-slate-400">{category}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="text-center text-xs text-slate-400">
        This is an independent practice tool built to help prepare for interviews. It is not affiliated with,
        endorsed by, or built by FirstRand Bank Limited (FNB).
      </div>
    </div>
  )
}

function StatTile({
  label,
  value,
  icon: Icon,
  accent = 'text-navy-900',
}: {
  label: string
  value: number
  icon: ComponentType<{ size?: number; className?: string }>
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Icon size={16} className="mb-2 text-slate-400" />
      <p className={`text-xl font-bold ${accent}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

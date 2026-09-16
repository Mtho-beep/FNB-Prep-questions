import type { ComponentType } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BrainCircuit,
  Cpu,
  Sparkles,
  Bot,
  Terminal,
  Database,
  Landmark,
  ScaleIcon,
  Network,
  ShieldCheck,
  Code2,
  Zap,
  MessageSquareText,
  X,
  GraduationCap,
} from 'lucide-react'
import type { Category } from '../types/questions'
import { categoryToSlug } from '../utils/slug'
import { practiceCategories } from '../data'

const categoryIcons: Record<Category, ComponentType<{ size?: number; className?: string }>> = {
  'Behavioural & Soft Skills': Users,
  Teamwork: Users,
  'Project Questions': Briefcase,
  'AI Fundamentals': BrainCircuit,
  'Machine Learning': Cpu,
  'LLMs & Generative AI': Sparkles,
  'AI Agents': Bot,
  Python: Terminal,
  'SQL & Databases': Database,
  'AI + Banking': Landmark,
  'AI Ethics & Responsible AI': ScaleIcon,
  'System Design': Network,
  Security: ShieldCheck,
  'Coderbyte Technical Assessment': Code2,
  'Rapid Fire': Zap,
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function navLinkClasses(isActive: boolean) {
  return [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-brand-500/15 text-brand-500' : 'text-slate-300 hover:bg-white/5 hover:text-white',
  ].join(' ')
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-navy-950 text-white transition-transform duration-200 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">AI Interview Prep</p>
              <p className="text-[11px] leading-tight text-slate-400">Not affiliated with FNB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            <NavLink to="/" end className={({ isActive }) => navLinkClasses(isActive)} onClick={onClose}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          </div>

          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Practice Categories
            </p>
            <div className="space-y-1">
              {practiceCategories.map((category) => {
                const Icon = categoryIcons[category]
                return (
                  <NavLink
                    key={category}
                    to={`/practice/${categoryToSlug(category)}`}
                    className={({ isActive }) => navLinkClasses(isActive)}
                    onClick={onClose}
                  >
                    <Icon size={18} />
                    <span className="truncate">{category}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>

          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Practice Modes
            </p>
            <div className="space-y-1">
              <NavLink to="/coderbyte" className={({ isActive }) => navLinkClasses(isActive)} onClick={onClose}>
                <Code2 size={18} />
                Coderbyte Assessment
              </NavLink>
              <NavLink to="/rapid-fire" className={({ isActive }) => navLinkClasses(isActive)} onClick={onClose}>
                <Zap size={18} />
                Rapid Fire
              </NavLink>
              <NavLink to="/mock-interview" className={({ isActive }) => navLinkClasses(isActive)} onClick={onClose}>
                <MessageSquareText size={18} />
                Mock Interview
              </NavLink>
            </div>
          </div>
        </nav>

        <div className="border-t border-white/10 px-4 py-4 text-[11px] leading-relaxed text-slate-500">
          Practice tool for interview preparation. Not affiliated with or endorsed by FirstRand/FNB.
        </div>
      </aside>
    </>
  )
}

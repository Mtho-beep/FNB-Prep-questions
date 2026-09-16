import { ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from 'lucide-react'

interface AnswerDropdownProps {
  isOpen: boolean
  onToggle: () => void
  answer: string
  keyPoints: string[]
  followUps: string[]
  projectConnection?: string
}

export function AnswerDropdown({ isOpen, onToggle, answer, keyPoints, followUps, projectConnection }: AnswerDropdownProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-800 shadow-sm transition-colors hover:bg-slate-50"
      >
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {isOpen ? 'Hide Model Answer' : 'Show Model Answer'}
      </button>

      {isOpen && (
        <div className="animate-slide-down mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">Model Answer</h4>
            <p className="prose-answer text-[15px] leading-relaxed text-slate-700">{answer}</p>
          </div>

          {keyPoints.length > 0 && (
            <div>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">Key Points</h4>
              <ul className="space-y-1.5">
                {keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-slate-700">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {followUps.length > 0 && (
            <div>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">Follow-up Questions</h4>
              <ul className="space-y-1.5">
                {followUps.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-slate-600">
                    <ArrowRight size={15} className="mt-0.5 shrink-0 text-slate-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {projectConnection && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                Connection to Your Projects
              </h4>
              <p className="text-[14px] leading-relaxed text-slate-700">{projectConnection}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

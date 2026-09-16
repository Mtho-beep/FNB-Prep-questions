import { useState } from 'react'
import { Code2, PlayCircle } from 'lucide-react'
import type { CodingQuestion as CodingQuestionType } from '../types/questions'
import { DifficultyBadge } from './Badge'
import { CodeEditor } from './CodeEditor'

interface CodingQuestionProps {
  question: CodingQuestionType
  index: number
  total: number
}

export function CodingQuestion({ question, index, total }: CodingQuestionProps) {
  const [started, setStarted] = useState(false)

  return (
    <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Code2 size={14} />
          Problem {index + 1} of {total}
        </span>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      <h3 className="mb-3 text-lg font-bold text-navy-900 sm:text-xl">{question.title}</h3>
      <p className="prose-answer mb-5 text-[15px] leading-relaxed text-slate-700">{question.problem}</p>

      <div className="mb-5 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Examples</h4>
        {question.examples.map((ex, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600">
            <p>
              <span className="text-slate-400">Input:</span> {ex.input}
            </p>
            <p>
              <span className="text-slate-400">Output:</span> {ex.output}
            </p>
            {ex.explanation && (
              <p className="font-sans text-slate-500">
                <span className="text-slate-400 font-mono">Explanation:</span> {ex.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {!started ? (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="focus-ring flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
        >
          <PlayCircle size={18} />
          Start Coding Question
        </button>
      ) : (
        <CodeEditor question={question} />
      )}
    </div>
  )
}

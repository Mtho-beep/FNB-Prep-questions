import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { coderbyteQuestions } from '../data'
import { CodingQuestion } from '../components/CodingQuestion'

export function Coderbyte() {
  const { hash } = useLocation()

  // Voice-interview links point at a specific problem (#cb-001). Deferred so
  // it runs after AppShell's scroll-to-top on navigation.
  useEffect(() => {
    if (!hash) return
    const timer = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    return () => window.clearTimeout(timer)
  }, [hash])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Top 10 Coderbyte-Style Technical Questions</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Realistic junior software/AI engineering coding assessment questions, written for this practice app —
          not actual confidential Coderbyte questions. Code execution for JavaScript runs directly in your browser
          against the sample test cases; Python is a simulated practice environment (no backend), so use{' '}
          <strong>Show Solution</strong> to check your approach.
        </p>
      </div>

      <div className="space-y-5">
        {coderbyteQuestions.map((q, i) => (
          <CodingQuestion key={q.id} question={q} index={i} total={coderbyteQuestions.length} />
        ))}
      </div>
    </div>
  )
}

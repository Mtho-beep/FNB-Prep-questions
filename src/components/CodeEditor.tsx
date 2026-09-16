import { useState } from 'react'
import { Play, Send, Lightbulb, Eye, RotateCcw, CheckCircle2, XCircle, Info } from 'lucide-react'
import type { CodingQuestion } from '../types/questions'

type Language = 'python' | 'javascript'

interface TestResult {
  args: string
  expected: string
  actual?: string
  passed?: boolean
  error?: string
}

interface CodeEditorProps {
  question: CodingQuestion
}

/** Extracts the top-level function name from a JS snippet like "function twoSum(...) {". */
function extractFunctionName(code: string): string | null {
  const match = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/)
  return match ? match[1] : null
}

/**
 * Runs user-submitted JavaScript against the question's test cases entirely
 * client-side (no backend). Each test case's "args" is a literal JS
 * expression list (e.g. "[2, 7, 11, 15], 9"), so we can safely splice it
 * into a generated function call and evaluate the result in an isolated
 * `Function` scope, then compare it against the (also literal) expected
 * value. This is real, local execution — never a simulated/fake result.
 */
function runJavaScript(code: string, question: CodingQuestion): TestResult[] {
  const functionName = extractFunctionName(code) ?? extractFunctionName(question.starterCodeJavaScript)
  return question.testCases.map(({ args, expected }) => {
    if (!functionName) {
      return { args, expected, error: 'Could not find a function definition to call.' }
    }
    try {
      // eslint-disable-next-line no-new-func
      const runner = new Function(`${code}\nreturn ${functionName}(${args});`)
      const result = runner()
      // eslint-disable-next-line no-new-func
      const expectedValue = new Function(`return (${expected});`)()
      const actualStr = JSON.stringify(result)
      const expectedStr = JSON.stringify(expectedValue)
      return { args, expected, actual: actualStr, passed: actualStr === expectedStr }
    } catch (err) {
      return { args, expected, error: err instanceof Error ? err.message : String(err) }
    }
  })
}

export function CodeEditor({ question }: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState(question.starterCodePython)
  const [hintIndex, setHintIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [ranOnce, setRanOnce] = useState(false)

  function handleLanguageChange(next: Language) {
    setLanguage(next)
    setCode(next === 'python' ? question.starterCodePython : question.starterCodeJavaScript)
    setResults(null)
    setRanOnce(false)
  }

  function handleRun() {
    setRanOnce(true)
    if (language === 'javascript') {
      setResults(runJavaScript(code, question))
    } else {
      // No Python runtime is available in this browser-only app (no backend, no external API).
      // We are explicit about this rather than faking execution results.
      setResults(null)
    }
  }

  function handleReset() {
    setCode(language === 'python' ? question.starterCodePython : question.starterCodeJavaScript)
    setResults(null)
    setRanOnce(false)
    setShowHint(false)
    setHintIndex(0)
  }

  function handleRevealHint() {
    setShowHint(true)
    setHintIndex((i) => Math.min(i + 1, question.hints.length - 1))
  }

  const passedCount = results?.filter((r) => r.passed).length ?? 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Language</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="focus-ring rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleRun} className="focus-ring flex items-center gap-1.5 rounded-lg bg-navy-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-navy-800">
            <Play size={14} /> Run Code
          </button>
          <button type="button" onClick={handleRun} className="focus-ring flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
            <Send size={14} /> Submit
          </button>
          <button type="button" onClick={handleRevealHint} className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <Lightbulb size={14} /> Reveal Hint
          </button>
          <button type="button" onClick={() => setShowSolution((v) => !v)} className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <Eye size={14} /> {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
          <button type="button" onClick={handleReset} className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={12}
        className="w-full resize-y bg-navy-950 p-4 font-mono text-[13px] leading-relaxed text-slate-100 focus:outline-none"
      />

      {showHint && (
        <div className="animate-fade-in mx-4 mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <Lightbulb size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Hint {hintIndex + 1} of {question.hints.length}</p>
            <p>{question.hints[hintIndex]}</p>
          </div>
        </div>
      )}

      {ranOnce && language === 'python' && (
        <div className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <Info size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <p>
            Python execution is simulated in this browser-only app — there is no backend or code-execution server.
            Compare your solution's logic against the example inputs/outputs below, or use{' '}
            <strong>Show Solution</strong> to check your approach. Switch to JavaScript to actually run your code
            against the test cases in-browser.
          </p>
        </div>
      )}

      {results && language === 'javascript' && (
        <div className="mx-4 mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {passedCount} / {results.length} test cases passed
          </p>
          {results.map((r, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                r.passed ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              {r.passed ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <XCircle size={16} className="mt-0.5 shrink-0" />}
              <div className="font-mono text-xs">
                <p>Input: {r.args}</p>
                <p>Expected: {r.expected}</p>
                {r.error ? <p>Error: {r.error}</p> : <p>Got: {r.actual}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSolution && (
        <div className="animate-slide-down mx-4 mb-4 mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">Expected Approach</h4>
            <p className="text-[14px] leading-relaxed text-slate-700">{question.approach}</p>
          </div>
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
              {language === 'python' ? 'Python Solution' : 'JavaScript Solution'}
            </h4>
            <pre className="overflow-x-auto rounded-lg bg-navy-950 p-4 text-[13px] leading-relaxed text-slate-100">
              <code>{language === 'python' ? question.solutionPython : question.solutionJavaScript}</code>
            </pre>
          </div>
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">Line-by-Line Explanation</h4>
            <ul className="space-y-1.5">
              {question.explanation.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-slate-700">
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-slate-400">{i + 1}.</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Time Complexity</p>
              <p className="mt-1 text-sm text-slate-700">{question.timeComplexity}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Space Complexity</p>
              <p className="mt-1 text-sm text-slate-700">{question.spaceComplexity}</p>
            </div>
          </div>
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">Common Mistakes</h4>
            <ul className="space-y-1.5">
              {question.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-slate-700">
                  <XCircle size={15} className="mt-0.5 shrink-0 text-rose-400" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">Follow-up Question</h4>
            <p className="text-[14px] leading-relaxed text-slate-700">{question.followUp}</p>
          </div>
        </div>
      )}
    </div>
  )
}

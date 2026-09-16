import { useMemo, useState } from 'react'
import { MessageSquareText, Award, Flag, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react'
import type { Category, Question } from '../types/questions'
import { allQuestions } from '../data'
import type { UseProgressReturn } from '../hooks/useProgress'
import { DifficultyBadge } from './Badge'
import { AnswerDropdown } from './AnswerDropdown'
import { ProgressBar } from './ProgressBar'

const MOCK_INTERVIEW_CATEGORIES: Category[] = [
  'Behavioural & Soft Skills',
  'Teamwork',
  'Project Questions',
  'AI Fundamentals',
  'Machine Learning',
  'LLMs & Generative AI',
  'AI Agents',
  'Python',
  'SQL & Databases',
  'AI + Banking',
  'Security',
]

const SESSION_LENGTH = 15

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildSession(): Question[] {
  const pool = allQuestions.filter((q) => MOCK_INTERVIEW_CATEGORIES.includes(q.category))
  return shuffle(pool).slice(0, SESSION_LENGTH)
}

interface MockInterviewProps {
  progress: UseProgressReturn
}

export function MockInterview({ progress }: MockInterviewProps) {
  const [session, setSession] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [answeredIds, setAnsweredIds] = useState<string[]>([])
  const [complete, setComplete] = useState(false)

  const currentQuestion = session ? session[index] : null

  const summary = useMemo(() => {
    if (!session) return null
    const categoriesCovered = Array.from(new Set(session.map((q) => q.category)))
    let markedDifficult = 0
    let markedMastered = 0
    for (const q of session) {
      const p = progress.getProgress(q.id)
      if (p.difficult) markedDifficult++
      if (p.mastered) markedMastered++
    }
    return {
      categoriesCovered,
      questionsAnswered: answeredIds.length,
      markedDifficult,
      markedMastered,
    }
  }, [session, answeredIds, progress])

  function startSession() {
    const newSession = buildSession()
    setSession(newSession)
    setIndex(0)
    setShowAnswer(false)
    setHasAnswered(false)
    setAnsweredIds([])
    setComplete(false)
  }

  function handleIveAnswered() {
    if (!currentQuestion) return
    setHasAnswered(true)
    setAnsweredIds((prev) => (prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]))
    progress.markCompleted(currentQuestion.id)
  }

  function handleShowAnswer() {
    if (!currentQuestion) return
    setShowAnswer(true)
    handleIveAnswered()
  }

  function handleNext() {
    if (!session) return
    if (index + 1 >= session.length) {
      finishSession()
      return
    }
    setIndex((i) => i + 1)
    setShowAnswer(false)
    setHasAnswered(false)
  }

  function finishSession() {
    if (!session || !summary) return
    progress.addMockInterviewSession({
      id: `mock-${Date.now()}`,
      date: new Date().toISOString(),
      questionIds: session.map((q) => q.id),
      questionsAnswered: summary.questionsAnswered,
      markedDifficult: summary.markedDifficult,
      markedMastered: summary.markedMastered,
      categoriesCovered: summary.categoriesCovered,
    })
    setComplete(true)
  }

  // --- Intro screen ---
  if (!session) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-brand-600">
          <MessageSquareText size={26} />
        </div>
        <h2 className="mb-2 text-xl font-bold text-navy-900">Mock Interview Mode</h2>
        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-slate-500">
          The app will act as an interviewer, presenting {SESSION_LENGTH} random questions one at a time from
          across Behavioural, Teamwork, Projects, AI, ML, LLMs, Agents, Python, SQL, Banking and Security. The
          model answer stays hidden until you say you've answered.
        </p>
        <button
          type="button"
          onClick={startSession}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
        >
          Start Mock Interview
          <ArrowRight size={16} />
        </button>
      </div>
    )
  }

  // --- Completion screen ---
  if (complete && summary) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="text-xl font-bold text-navy-900">Interview Completed</h2>
          <p className="mt-1 text-sm text-slate-500">Here's a factual summary of this practice session.</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-navy-900">{summary.questionsAnswered}</p>
            <p className="text-xs text-slate-500">Questions Answered</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-navy-900">{summary.categoriesCovered.length}</p>
            <p className="text-xs text-slate-500">Categories Practiced</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-rose-600">{summary.markedDifficult}</p>
            <p className="text-xs text-slate-500">Marked Difficult</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{summary.markedMastered}</p>
            <p className="text-xs text-slate-500">Marked Mastered</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Categories Covered</p>
          <div className="flex flex-wrap gap-2">
            {summary.categoriesCovered.map((c) => (
              <span key={c} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-brand-600">
                {c}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={startSession}
          className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          <RotateCcw size={16} />
          Start Another Interview
        </button>
      </div>
    )
  }

  // --- Active question screen ---
  if (!currentQuestion) return null
  const questionProgress = progress.getProgress(currentQuestion.id)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <ProgressBar percent={((index + 1) / session.length) * 100} label={`Question ${index + 1} of ${session.length}`} showPercentLabel />
      </div>

      <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-400">
            INTERVIEW QUESTION {index + 1}/{session.length}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-medium text-slate-500">{currentQuestion.category}</span>
          <DifficultyBadge difficulty={currentQuestion.difficulty} />
        </div>

        <h3 className="mb-6 text-lg font-semibold leading-snug text-navy-900 sm:text-xl">"{currentQuestion.question}"</h3>

        <div className="mb-5 flex flex-wrap gap-2.5">
          {!hasAnswered && (
            <button
              type="button"
              onClick={handleIveAnswered}
              className="focus-ring flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100"
            >
              <CheckCircle2 size={16} />
              I've Answered
            </button>
          )}
          {!showAnswer && (
            <button
              type="button"
              onClick={handleShowAnswer}
              className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-800 shadow-sm transition-colors hover:bg-slate-50"
            >
              Show Model Answer
            </button>
          )}
        </div>

        {showAnswer && (
          <AnswerDropdown
            isOpen
            onToggle={() => setShowAnswer(false)}
            answer={currentQuestion.answer}
            keyPoints={currentQuestion.keyPoints}
            followUps={currentQuestion.followUps}
            projectConnection={currentQuestion.projectConnection}
          />
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => progress.toggleMastered(currentQuestion.id)}
              className={[
                'focus-ring flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                questionProgress.mastered ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <Award size={16} />
              Mastered
            </button>
            <button
              type="button"
              onClick={() => progress.toggleDifficult(currentQuestion.id)}
              className={[
                'focus-ring flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                questionProgress.difficult ? 'bg-rose-500 text-white hover:bg-rose-600' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <Flag size={16} />
              Difficult
            </button>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="focus-ring flex items-center gap-1.5 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            {index + 1 >= session.length ? 'Finish Interview' : 'Next Question'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

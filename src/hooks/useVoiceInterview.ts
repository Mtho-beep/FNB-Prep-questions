import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  InterviewDifficulty,
  InterviewMode,
  InterviewQuestion,
  InterviewReport,
  InterviewTurn,
  NextAction,
  TurnEvaluation,
  VoiceInterviewSession,
} from '../types/interview'
import type { UseProgressReturn } from './useProgress'
import { getInterviewQuestion } from '../services/interviewAdapter'
import {
  MODE_CONFIGS,
  adjustLevel,
  canFollowUp,
  initialPlannerState,
  nextMainPhaseIndex,
  pickQuestion,
  type PlannerState,
  type SelectionContext,
} from '../services/interviewPlanner'
import { INTERVIEWER_SYSTEM_PROMPT, buildReportPrompt, buildTurnPrompt } from '../services/interviewContext'
import { buildOfflineReport, heuristicEvaluate, heuristicNextStep, normalizeAiTurn } from '../services/interviewEvaluator'
import { PROVIDER_LABELS, complete, parseJsonObject, type ProviderKind } from '../services/aiProvider'
import { getStreamlitLlm } from '../lib/streamlit'

// The interview state machine. Owns the session, the planner and the timer;
// the UI owns speech (it speaks each new question and fills the transcript).

const ACTIVE_KEY = 'fnb-ai-interview-prep:voice-active:v1'

export type EngineStatus = 'idle' | 'starting' | 'asking' | 'processing' | 'evaluating' | 'finished' | 'error'

interface ActiveInterview {
  session: VoiceInterviewSession
  planner: PlannerState
  providerKind: ProviderKind
  draft: string
}

function readSaved(): ActiveInterview | null {
  try {
    const raw = window.localStorage.getItem(ACTIVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ActiveInterview
    return parsed?.session?.turns?.length ? parsed : null
  } catch {
    return null
  }
}

function writeSaved(active: ActiveInterview | null) {
  try {
    if (active) window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(active))
    else window.localStorage.removeItem(ACTIVE_KEY)
  } catch {
    // LocalStorage unavailable — the interview still works, it just can't be resumed.
  }
}

const LEVEL_LABELS = ['Beginner', 'Beginner', 'Intermediate', 'Advanced']
const GENERIC_TAGS = new Set(['fnb', 'studytogether', 'projects', 'overview', 'star', 'motivation', 'closing', 'experience'])

let turnCounter = 0
function makeTurn(partial: Omit<InterviewTurn, 'id'>): InterviewTurn {
  turnCounter += 1
  return { id: `turn-${Date.now().toString(36)}-${turnCounter}`, ...partial }
}

/** Finds the next main question, moving through later phases if a pool runs dry. */
function planNextMain(planner: PlannerState, ctx: SelectionContext): { phaseIndex: number; question: InterviewQuestion } | null {
  const config = MODE_CONFIGS[planner.mode]
  let index = nextMainPhaseIndex(planner)
  while (index !== null && index < config.phases.length) {
    const state = index === planner.phaseIndex ? planner : { ...planner, phaseIndex: index, mainInPhase: 0 }
    const question = pickQuestion(config.phases[index].phase, state, ctx)
    if (question) return { phaseIndex: index, question }
    index += 1
  }
  return null
}

export interface StartOptions {
  mode: InterviewMode
  difficulty: InterviewDifficulty
  providerKind: ProviderKind
  voiceUsed: boolean
}

export function useVoiceInterview(progress: UseProgressReturn) {
  const [active, setActive] = useState<ActiveInterview | null>(null)
  const [status, setStatus] = useState<EngineStatus>('idle')
  const [notice, setNotice] = useState<string | null>(null)
  const [completed, setCompleted] = useState<VoiceInterviewSession | null>(null)
  const [saved, setSaved] = useState<ActiveInterview | null>(() => readSaved())
  const activeRef = useRef<ActiveInterview | null>(null)
  const busyRef = useRef(false)

  const commit = useCallback((next: ActiveInterview | null) => {
    activeRef.current = next
    setActive(next)
    writeSaved(next)
  }, [])

  const selectionContext = useCallback((): SelectionContext => {
    const difficultIds = new Set(
      Object.entries(progress.state.questions)
        .filter(([, p]) => p.difficult)
        .map(([id]) => id),
    )
    return { difficultIds }
  }, [progress.state.questions])

  // The clock runs while a question is open or an answer is being processed.
  useEffect(() => {
    if (status !== 'asking' && status !== 'processing') return
    const timer = window.setInterval(() => {
      const cur = activeRef.current
      if (!cur) return
      const elapsedSec = cur.planner.elapsedSec + 1
      commit({ ...cur, planner: { ...cur.planner, elapsedSec }, session: { ...cur.session, durationSec: elapsedSec } })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [status, commit])

  const start = useCallback(
    (options: StartOptions) => {
      setStatus('starting')
      setNotice(null)
      setCompleted(null)
      const planner = initialPlannerState(options.mode, options.difficulty)
      const config = MODE_CONFIGS[options.mode]
      const first = pickQuestion(config.phases[0].phase, planner, selectionContext())
      if (!first) {
        setStatus('error')
        setNotice('No questions are available for this mode.')
        return
      }
      const turn = makeTurn({
        phase: config.phases[0].phase,
        kind: 'main',
        text: first.text,
        sourceId: first.sourceId,
        sourceType: first.sourceType,
        askedAtSec: 0,
      })
      commit({
        providerKind: options.providerKind,
        draft: '',
        planner: { ...planner, mainInPhase: 1, askedIds: [first.sourceId] },
        session: {
          id: `voice-${Date.now()}`,
          date: new Date().toISOString(),
          mode: options.mode,
          difficulty: options.difficulty,
          targetSec: config.targetSec,
          durationSec: 0,
          endedEarly: false,
          provider:
            options.providerKind === 'server' && getStreamlitLlm().model
              ? `${getStreamlitLlm().model} (via Streamlit server)`
              : PROVIDER_LABELS[options.providerKind],
          voiceUsed: options.voiceUsed,
          turns: [turn],
          report: null,
        },
      })
      setSaved(null)
      setStatus('asking')
    },
    [commit, selectionContext],
  )

  const finish = useCallback(
    async (session: VoiceInterviewSession, providerKind: ProviderKind) => {
      setStatus('evaluating')
      const masteredIds = new Set(
        Object.entries(progress.state.questions)
          .filter(([, p]) => p.mastered)
          .map(([id]) => id),
      )
      let report: InterviewReport = buildOfflineReport(session.turns, masteredIds)
      const answered = session.turns.some((t) => t.answer !== undefined)
      if (providerKind !== 'offline' && answered) {
        try {
          const raw = await complete(providerKind, {
            system: INTERVIEWER_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: buildReportPrompt(MODE_CONFIGS[session.mode].label, session.turns) }],
            maxTokens: 1200,
          })
          const parsed = parseJsonObject<{ strengths?: unknown; improvements?: unknown; summary?: unknown }>(raw)
          const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 6) : [])
          report = {
            ...report,
            strengths: list(parsed.strengths).length ? list(parsed.strengths) : report.strengths,
            improvements: list(parsed.improvements).length ? list(parsed.improvements) : report.improvements,
            summary: typeof parsed.summary === 'string' ? parsed.summary : report.summary,
            source: 'ai',
          }
        } catch {
          setNotice('The AI interviewer was unavailable for the final feedback, so the report uses offline scoring.')
        }
      }
      const finalSession = { ...session, report }
      progress.addVoiceInterviewSession(finalSession)
      commit(null)
      setCompleted(finalSession)
      setStatus('finished')
    },
    [commit, progress],
  )

  /** Records the answer to the open question and decides what happens next. */
  const respond = useCallback(
    async (answer: string | null) => {
      const cur = activeRef.current
      if (!cur || busyRef.current) return
      busyRef.current = true
      setStatus('processing')
      setNotice(null)
      try {
        const { planner, session, providerKind } = cur
        const config = MODE_CONFIGS[planner.mode]
        const turn = session.turns[session.turns.length - 1]
        const skipped = answer === null
        const root = turn.sourceId ? getInterviewQuestion(turn.sourceId) : undefined
        const askedTexts = new Set(session.turns.map((t) => t.text))
        const unusedFollowUps = (root?.followUps ?? []).filter((f) => !askedTexts.has(f))
        const followAllowed = !skipped && canFollowUp(planner) && turn.phase !== 'closing'
        const next = turn.phase === 'closing' ? null : planNextMain(planner, selectionContext())

        let evaluation: TurnEvaluation | undefined
        let action: NextAction = 'advance'
        let say = ''

        if (!skipped) {
          let usedAi = false
          if (providerKind !== 'offline') {
            try {
              const raw = await complete(providerKind, {
                system: INTERVIEWER_SYSTEM_PROMPT,
                messages: [
                  {
                    role: 'user',
                    content: buildTurnPrompt({
                      modeLabel: config.label,
                      phase: turn.phase,
                      remainingSec: config.targetSec - planner.elapsedSec,
                      levelLabel: `${LEVEL_LABELS[planner.level]} (junior/graduate role)`,
                      canFollowUp: followAllowed,
                      current: turn,
                      rootQuestion: root,
                      unusedFollowUps,
                      history: session.turns.slice(0, -1),
                      nextMain: next?.question ?? null,
                      answer,
                    }),
                  },
                ],
                maxTokens: 900,
              })
              const result = normalizeAiTurn(parseJsonObject(raw))
              evaluation = result.evaluation
              action = result.action
              say = result.say
              usedAi = true
            } catch {
              setNotice('AI interviewer is temporarily unavailable — this answer was scored offline and the interview continues.')
            }
          }
          if (!usedAi) {
            evaluation = heuristicEvaluate(root, answer)
            const step = heuristicNextStep(evaluation.quality, followAllowed, unusedFollowUps, root, turn.kind, next?.question ?? null)
            action = step.action
            say = step.say
          }
        }

        // Never let the model extend the interview past its time/follow-up budget.
        if (action !== 'advance' && (!followAllowed || !say)) action = 'advance'
        if (action === 'advance' && next && (!say || skipped)) say = skipped ? `No problem, let's move on. ${next.question.text}` : next.question.text

        // Re-read: the timer may have ticked while we waited for the model.
        const latest = activeRef.current
        if (!latest || latest.session.id !== session.id) return
        const answeredTurn: InterviewTurn = skipped
          ? { ...turn, skipped: true }
          : { ...turn, answer: answer ?? '', answerDurationSec: latest.planner.elapsedSec - turn.askedAtSec, evaluation }
        const turns = [...latest.session.turns.slice(0, -1), answeredTurn]

        let nextPlanner: PlannerState = { ...latest.planner }
        if (evaluation) {
          nextPlanner.level = adjustLevel(nextPlanner.level, evaluation.quality)
          if (['weak', 'off-topic', 'partial'].includes(evaluation.quality) && root) {
            nextPlanner.weakTags = [...new Set([...nextPlanner.weakTags, ...root.tags.filter((t) => !GENERIC_TAGS.has(t))])]
          }
        }

        if (action === 'advance' && !next) {
          await finish({ ...latest.session, turns }, providerKind)
          return
        }

        let newTurn: InterviewTurn
        if (action !== 'advance') {
          newTurn = makeTurn({
            phase: turn.phase,
            kind: action,
            text: say,
            sourceId: turn.sourceId,
            sourceType: turn.sourceType,
            askedAtSec: latest.planner.elapsedSec,
          })
          nextPlanner = { ...nextPlanner, followUpsInThread: nextPlanner.followUpsInThread + 1 }
        } else {
          const { phaseIndex, question } = next!
          newTurn = makeTurn({
            phase: config.phases[phaseIndex].phase,
            kind: 'main',
            text: say,
            sourceId: question.sourceId,
            sourceType: question.sourceType,
            askedAtSec: latest.planner.elapsedSec,
          })
          nextPlanner = {
            ...nextPlanner,
            phaseIndex,
            mainInPhase: phaseIndex === latest.planner.phaseIndex ? latest.planner.mainInPhase + 1 : 1,
            followUpsInThread: 0,
            askedIds: [...nextPlanner.askedIds, question.sourceId],
          }
        }

        commit({ ...latest, draft: '', planner: nextPlanner, session: { ...latest.session, turns: [...turns, newTurn] } })
        setStatus('asking')
      } catch (err) {
        // Keep the session (and the transcript in the draft) so nothing is lost.
        setNotice(`Something went wrong while processing your answer: ${(err as Error).message}. Your answer is still in the box — try submitting again.`)
        setStatus('asking')
      } finally {
        busyRef.current = false
      }
    },
    [commit, finish, selectionContext],
  )

  const submitAnswer = useCallback((answer: string) => respond(answer.trim()), [respond])
  const skipQuestion = useCallback(() => respond(null), [respond])

  const endInterview = useCallback(async () => {
    const cur = activeRef.current
    if (!cur || busyRef.current) return
    busyRef.current = true
    try {
      // Drop the open question if it was never answered.
      const turns = cur.session.turns.filter((t) => t.answer !== undefined || t.skipped)
      await finish({ ...cur.session, turns, endedEarly: true }, cur.providerKind)
    } finally {
      busyRef.current = false
    }
  }, [finish])

  /** Stores the in-progress transcript so a reload or crash doesn't lose it. */
  const saveDraft = useCallback((draft: string) => {
    const cur = activeRef.current
    if (!cur || cur.draft === draft) return
    activeRef.current = { ...cur, draft }
    writeSaved(activeRef.current)
  }, [])

  const resumeSaved = useCallback(() => {
    if (!saved) return
    commit(saved)
    setSaved(null)
    setStatus('asking')
  }, [saved, commit])

  const discardSaved = useCallback(() => {
    writeSaved(null)
    setSaved(null)
  }, [])

  const reset = useCallback(() => {
    commit(null)
    setCompleted(null)
    setNotice(null)
    setStatus('idle')
  }, [commit])

  return {
    status,
    notice,
    session: active?.session ?? null,
    planner: active?.planner ?? null,
    providerKind: active?.providerKind ?? null,
    initialDraft: active?.draft ?? '',
    completed,
    saved,
    start,
    submitAnswer,
    skipQuestion,
    endInterview,
    saveDraft,
    resumeSaved,
    discardSaved,
    reset,
  }
}

export type UseVoiceInterviewReturn = ReturnType<typeof useVoiceInterview>

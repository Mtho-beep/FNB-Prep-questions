// Data model for the Voice AI Mock Interview.
// The interviewer never owns its own question bank — every InterviewQuestion
// is adapted from the existing src/data/*.ts content (see services/interviewAdapter.ts).

import type { Difficulty } from './questions'

export type InterviewMode = 'full' | 'technical' | 'project' | 'fundamentals' | 'behavioural' | 'rapid' | 'coding'

export type InterviewDifficulty = Difficulty | 'Adaptive'

export type InterviewPhase =
  | 'introduction'
  | 'motivation'
  | 'project'
  | 'technical'
  | 'fundamentals'
  | 'behavioural'
  | 'rapid'
  | 'coding'
  | 'closing'

export type AnswerQuality = 'strong' | 'partial' | 'weak' | 'off-topic' | 'unclear'

/** What the interviewer decided to do after an answer. */
export type NextAction = 'follow_up' | 'clarify' | 'redirect' | 'advance'

/** The seven areas of the 100-point practice score. */
export type ScoreArea = 'technical' | 'project' | 'problemSolving' | 'communication' | 'behavioural' | 'fundamentals' | 'confidence'

export type InterviewStatus = 'idle' | 'starting' | 'asking' | 'speaking' | 'listening' | 'processing' | 'evaluating' | 'finished' | 'error'

/** Where an interview question came from. */
export type QuestionSourceType = 'question' | 'rapid' | 'coding' | 'profile' | 'closing'

/** An existing question, normalised into the shape the interview engine needs. */
export interface InterviewQuestion {
  sourceId: string
  sourceType: QuestionSourceType
  text: string
  category: string
  difficulty: Difficulty
  /** The existing model answer (never shown during the interview). */
  modelAnswer: string
  keyPoints: string[]
  followUps: string[]
  projectContext?: string
  tags: string[]
  scoreAreas: ScoreArea[]
}

/** Each dimension is scored 0–5. */
export interface DimensionScores {
  relevance: number
  accuracy: number
  completeness: number
  communication: number
  specificity: number
  structure: number
  depth: number
  authenticity: number
}

export interface TurnEvaluation {
  quality: AnswerQuality
  scores: DimensionScores
  strengths: string[]
  missing: string[]
  feedback: string
  /** 'ai' = scored by the configured LLM, 'offline' = keyword-based estimate. */
  source: 'ai' | 'offline'
}

export interface InterviewTurn {
  id: string
  phase: InterviewPhase
  kind: 'main' | NextAction
  /** Exactly what the interviewer said. */
  text: string
  /** The existing question this turn is based on (for follow-ups: the thread's root question). */
  sourceId?: string
  sourceType?: QuestionSourceType
  askedAtSec: number
  answer?: string
  answerDurationSec?: number
  skipped?: boolean
  evaluation?: TurnEvaluation
}

export interface InterviewReport {
  overall: number | null
  label: string
  areaScores: Partial<Record<ScoreArea, number>>
  strengths: string[]
  improvements: string[]
  summary: string
  recommendedQuestionIds: string[]
  source: 'ai' | 'offline'
}

/** A completed voice interview, persisted in ProgressState.voiceInterviewHistory. */
export interface VoiceInterviewSession {
  id: string
  date: string
  mode: InterviewMode
  difficulty: InterviewDifficulty
  targetSec: number
  durationSec: number
  endedEarly: boolean
  provider: string
  voiceUsed: boolean
  turns: InterviewTurn[]
  report: InterviewReport | null
}

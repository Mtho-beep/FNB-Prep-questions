// Data model for the AI Study Podcast / Tutor. Lessons are built on demand
// from the existing question bank (see services/studyTopics.ts); nothing here
// stores teaching content of its own except what the tutor actually said.

/** Teach Me (from basics), Deep Dive (technical), FNB Interview Prep (how to answer). */
export type StudyMode = 'teach' | 'deep' | 'interview'

/** How a session was started. */
export type StudySessionKind = 'topic' | 'focus' | 'revision' | 'curriculum'

/** How often the tutor stops to ask you something. */
export type Interactivity = 'passive' | 'balanced' | 'interactive'

export type PodcastStyle = 'solo' | 'duo'

export type Speaker = 'tutor' | 'host' | 'expert'

export interface LessonSection {
  title: string
  goal: string
  /** Ids of existing questions this section is grounded in. */
  sourceIds: string[]
}

export interface LessonPlan {
  title: string
  sections: LessonSection[]
  source: 'ai' | 'offline'
}

export interface ScriptLine {
  speaker: Speaker
  text: string
}

/** The spoken script for one section (roughly 30–90 seconds). */
export interface SectionScript {
  lines: ScriptLine[]
  /** A quick-check question to ask after the section, if any. */
  check: string | null
  /** Short name of the main concept, e.g. "Embeddings". */
  concept: string
}

/** Where the tutor is in the lesson — used to resume after an interruption. */
export interface LessonCursor {
  section: number
  line: number
}

export type TranscriptRole = Speaker | 'you' | 'system'

export interface TranscriptEntry {
  id: string
  role: TranscriptRole
  text: string
  section: number
  /** True when the tutor said it is going beyond the study material. */
  generalKnowledge?: boolean
}

export type AskKind = 'question' | 'simpler' | 'deeper' | 'example'

export interface StudyQuestionRecord {
  kind: AskKind
  question: string
  answer: string
  concept: string
  section: string
  fromMaterial: boolean
}

export type CheckVerdict = 'correct' | 'partly' | 'incorrect'

export interface CheckRecord {
  kind: 'check' | 'quiz'
  question: string
  answer: string
  verdict: CheckVerdict
  feedback: string
  concept: string
}

/** A finished study session, persisted in ProgressState.studySessionHistory. */
export interface StudySession {
  id: string
  date: string
  topicId: string
  topicLabel: string
  mode: StudyMode
  kind: StudySessionKind
  interactivity: Interactivity
  style: PodcastStyle
  focus?: string
  durationSec: number
  endedEarly: boolean
  provider: string
  sectionTitles: string[]
  sectionsCovered: number[]
  questions: StudyQuestionRecord[]
  checks: CheckRecord[]
  interruptions: number
  weakConcepts: string[]
  sourceIds: string[]
}

// Core data model for the FNB AI Interview Preparation App.
// Every practice question in the app conforms to one of the shapes below.
// This file has no runtime logic — it only defines the TypeScript contracts
// used by src/data/*.ts and consumed throughout components, hooks and pages.

/** The 17 practice categories shown in the sidebar / dashboard. */
export type Category =
  | 'Behavioural & Soft Skills'
  | 'Teamwork'
  | 'Project Questions'
  | 'AI Fundamentals'
  | 'Machine Learning'
  | 'LLMs & Generative AI'
  | 'AI Agents'
  | 'Python'
  | 'SQL & Databases'
  | 'AI + Banking'
  | 'AI Ethics & Responsible AI'
  | 'System Design'
  | 'Security'
  | 'Coderbyte Technical Assessment'
  | 'Rapid Fire'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

/** A standard interview question with a model answer. */
export interface Question {
  id: string
  category: Category
  difficulty: Difficulty
  question: string
  answer: string
  keyPoints: string[]
  followUps: string[]
  /** How this question ties back to the user's own projects, if relevant. */
  projectConnection?: string
  tags: string[]
}

/** A very short question/answer pair used in Rapid Fire mode. */
export interface RapidFireQuestion {
  id: string
  question: string
  answer: string
  tags: string[]
}

/** A worked example (input -> output) shown on a coding question. */
export interface CodeExample {
  input: string
  output: string
  explanation?: string
}

/** A Coderbyte-style coding assessment question with a full walkthrough. */
export interface CodingQuestion {
  id: string
  title: string
  difficulty: Difficulty
  problem: string
  examples: CodeExample[]
  hints: string[]
  approach: string
  solutionPython: string
  solutionJavaScript: string
  explanation: string[]
  timeComplexity: string
  spaceComplexity: string
  commonMistakes: string[]
  followUp: string
  starterCodePython: string
  starterCodeJavaScript: string
  /** Sample test cases used by the simulated "Run Code" / "Submit" buttons. */
  testCases: { args: string; expected: string }[]
}

/** Per-question progress persisted to the database (or LocalStorage). */
export interface QuestionProgress {
  completed: boolean
  mastered: boolean
  difficult: boolean
  favorite: boolean
  lastViewedAt?: string
}

/** One completed mock-interview session, kept for history. */
export interface MockInterviewSession {
  id: string
  date: string
  questionIds: string[]
  questionsAnswered: number
  markedDifficult: number
  markedMastered: number
  categoriesCovered: Category[]
}

/** The full shape persisted under a single LocalStorage key. */
export interface ProgressState {
  questions: Record<string, QuestionProgress>
  lastViewedQuestionId?: string
  mockInterviewHistory: MockInterviewSession[]
}

export type QuestionMode = 'browse' | 'random' | 'weak' | 'mock' | 'rapid'

export interface FilterState {
  category: Category | 'All'
  difficulty: Difficulty | 'All'
  status: 'All' | 'Completed' | 'Not Completed' | 'Mastered' | 'Difficult' | 'Favorites'
  search: string
}

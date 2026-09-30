import type { Category, Difficulty } from '../types/questions'
import type { InterviewDifficulty, InterviewMode, InterviewPhase, InterviewQuestion } from '../types/interview'
import {
  adaptedCoding,
  adaptedProfile,
  adaptedQuestions,
  adaptedRapidFire,
  closingQuestion,
  getInterviewQuestion,
} from './interviewAdapter'

// Decides *what* to ask and *when* to move on. The timer drives the
// interview, not a fixed question count: each phase has a time budget and a
// cap on main questions, and phases whose time has already passed are skipped.

export interface PhasePlan {
  phase: InterviewPhase
  budgetSec: number
  maxMain: number
  maxFollowUps: number
}

export interface ModeConfig {
  mode: InterviewMode
  label: string
  description: string
  targetSec: number
  phases: PhasePlan[]
  /** Starting adaptive level: 1 = Beginner, 2 = Intermediate, 3 = Advanced. */
  startLevel: number
}

export const MODE_CONFIGS: Record<InterviewMode, ModeConfig> = {
  full: {
    mode: 'full',
    label: '15-Minute FNB Mock Interview',
    description: 'Introduction, motivation, a project deep dive, technical and behavioural questions, then closing.',
    targetSec: 15 * 60,
    startLevel: 1,
    phases: [
      { phase: 'introduction', budgetSec: 90, maxMain: 1, maxFollowUps: 1 },
      { phase: 'motivation', budgetSec: 120, maxMain: 2, maxFollowUps: 1 },
      { phase: 'project', budgetSec: 300, maxMain: 2, maxFollowUps: 3 },
      { phase: 'technical', budgetSec: 210, maxMain: 3, maxFollowUps: 1 },
      { phase: 'behavioural', budgetSec: 120, maxMain: 2, maxFollowUps: 1 },
      { phase: 'closing', budgetSec: 60, maxMain: 1, maxFollowUps: 0 },
    ],
  },
  technical: {
    mode: 'technical',
    label: 'AI Technical Interview',
    description: 'Python, ML, LLMs, RAG, agents, SQL, PostgreSQL, APIs, system design and AI security.',
    targetSec: 10 * 60,
    startLevel: 2,
    phases: [
      { phase: 'technical', budgetSec: 540, maxMain: 6, maxFollowUps: 2 },
      { phase: 'closing', budgetSec: 60, maxMain: 1, maxFollowUps: 0 },
    ],
  },
  project: {
    mode: 'project',
    label: 'Project Deep Dive',
    description: 'FNB Intelligent Banking Simulation, StudyTogether and your SARAO experience.',
    targetSec: 10 * 60,
    startLevel: 1,
    phases: [
      { phase: 'project', budgetSec: 540, maxMain: 4, maxFollowUps: 3 },
      { phase: 'closing', budgetSec: 60, maxMain: 1, maxFollowUps: 0 },
    ],
  },
  fundamentals: {
    mode: 'fundamentals',
    label: 'AI Fundamentals',
    description: 'ML, deep learning, LLMs, embeddings, RAG and agents.',
    targetSec: 10 * 60,
    startLevel: 1,
    phases: [{ phase: 'fundamentals', budgetSec: 600, maxMain: 7, maxFollowUps: 2 }],
  },
  behavioural: {
    mode: 'behavioural',
    label: 'Behavioural Interview',
    description: 'Teamwork, pressure, conflict, failure, communication and learning.',
    targetSec: 10 * 60,
    startLevel: 1,
    phases: [
      { phase: 'introduction', budgetSec: 90, maxMain: 1, maxFollowUps: 1 },
      { phase: 'behavioural', budgetSec: 450, maxMain: 4, maxFollowUps: 1 },
      { phase: 'closing', budgetSec: 60, maxMain: 1, maxFollowUps: 0 },
    ],
  },
  rapid: {
    mode: 'rapid',
    label: 'Rapid Fire',
    description: 'Short questions, short answers, no follow-ups. Uses the Rapid Fire flashcards.',
    targetSec: 5 * 60,
    startLevel: 1,
    phases: [{ phase: 'rapid', budgetSec: 300, maxMain: 20, maxFollowUps: 0 }],
  },
  coding: {
    mode: 'coding',
    label: 'Coding Interview',
    description: 'Explain your approach to a Coderbyte problem out loud, then practise it in the coding page.',
    targetSec: 10 * 60,
    startLevel: 1,
    phases: [
      { phase: 'coding', budgetSec: 540, maxMain: 2, maxFollowUps: 2 },
      { phase: 'closing', budgetSec: 60, maxMain: 1, maxFollowUps: 0 },
    ],
  },
}

export const MODE_ORDER: InterviewMode[] = ['full', 'technical', 'project', 'fundamentals', 'behavioural', 'rapid', 'coding']

/** Planner state that survives between turns (and page reloads). */
export interface PlannerState {
  mode: InterviewMode
  difficulty: InterviewDifficulty
  phaseIndex: number
  mainInPhase: number
  followUpsInThread: number
  level: number
  elapsedSec: number
  askedIds: string[]
  /** Tags from answers scored weak during this interview. */
  weakTags: string[]
}

export interface SelectionContext {
  /** Questions marked difficult in the existing progress tracker. */
  difficultIds: Set<string>
  random?: () => number
}

const DIFFICULTY_RANK: Record<Difficulty, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 }

const INTRO_IDS = ['beh-001']
const MOTIVATION_IDS = ['beh-004', 'beh-006', 'beh-005', 'beh-010', 'beh-011', 'beh-008']
const PROJECT_OPENERS = ['proj-001', 'proj-041']

const TECHNICAL_CATEGORIES: Category[] = [
  'Python',
  'SQL & Databases',
  'AI Agents',
  'LLMs & Generative AI',
  'System Design',
  'Security',
  'AI + Banking',
  'Machine Learning',
]
const FUNDAMENTAL_CATEGORIES: Category[] = ['AI Fundamentals', 'Machine Learning', 'LLMs & Generative AI', 'AI Agents']
const BEHAVIOURAL_CATEGORIES: Category[] = ['Behavioural & Soft Skills', 'Teamwork']

const PROJECT_TAGS = ['fnb', 'studytogether', 'langgraph', 'projects']

function byCategory(categories: Category[]): InterviewQuestion[] {
  return adaptedQuestions.filter((q) => (categories as string[]).includes(q.category))
}

function phasePool(phase: InterviewPhase): InterviewQuestion[] {
  switch (phase) {
    case 'introduction':
      return INTRO_IDS.map((id) => getInterviewQuestion(id)!).filter(Boolean)
    case 'motivation':
      return MOTIVATION_IDS.map((id) => getInterviewQuestion(id)!).filter(Boolean)
    case 'project':
      return [...byCategory(['Project Questions']), ...adaptedProfile]
    case 'technical':
      return byCategory(TECHNICAL_CATEGORIES)
    case 'fundamentals':
      return byCategory(FUNDAMENTAL_CATEGORIES)
    case 'behavioural':
      return [
        ...byCategory(BEHAVIOURAL_CATEGORIES).filter((q) => !INTRO_IDS.includes(q.sourceId) && !MOTIVATION_IDS.includes(q.sourceId)),
        ...adaptedProfile,
      ]
    case 'rapid':
      return adaptedRapidFire
    case 'coding':
      return adaptedCoding
    case 'closing':
      return [closingQuestion]
  }
}

function pickRandom<T>(items: T[], random: () => number): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(random() * items.length)]
}

function targetRank(state: PlannerState): number {
  return state.difficulty === 'Adaptive' ? state.level : DIFFICULTY_RANK[state.difficulty]
}

/** Prefer the exact target difficulty, then anything easier, then anything at all. */
function matchDifficulty(pool: InterviewQuestion[], rank: number): InterviewQuestion[] {
  const exact = pool.filter((q) => DIFFICULTY_RANK[q.difficulty] === rank)
  if (exact.length) return exact
  const easier = pool.filter((q) => DIFFICULTY_RANK[q.difficulty] <= rank)
  return easier.length ? easier : pool
}

function capDifficulty(pool: InterviewQuestion[], rank: number): InterviewQuestion[] {
  const capped = pool.filter((q) => DIFFICULTY_RANK[q.difficulty] <= rank)
  return capped.length ? capped : pool
}

/**
 * Chooses the next main question for a phase from the existing bank.
 * Mixed phases use roughly 40% core, 30% weak areas, 20% project-linked and
 * 10% random, falling back to whatever is left when a bucket is empty.
 */
export function pickQuestion(phase: InterviewPhase, state: PlannerState, ctx: SelectionContext): InterviewQuestion | null {
  const random = ctx.random ?? Math.random
  const asked = new Set(state.askedIds)
  const pool = phasePool(phase).filter((q) => !asked.has(q.sourceId))
  if (pool.length === 0) return phase === 'closing' ? closingQuestion : null

  if (phase === 'introduction' || phase === 'closing') return pool[0]
  if (phase === 'motivation') return pickRandom(pool.slice(0, 3), random) ?? pool[0]

  if (phase === 'project') {
    const opener = PROJECT_OPENERS.find((id) => !asked.has(id))
    const openersToUse = state.mode === 'project' ? PROJECT_OPENERS : PROJECT_OPENERS.slice(0, 1)
    if (opener && openersToUse.includes(opener)) return pool.find((q) => q.sourceId === opener) ?? null
    // In project mode, give SARAO a turn once both projects are covered.
    if (state.mode === 'project') {
      const sarao = pool.find((q) => q.sourceType === 'profile')
      if (sarao && state.mainInPhase >= 2) return sarao
    }
    return pickRandom(capDifficulty(pool.filter((q) => q.sourceType === 'question'), targetRank(state)), random) ?? pool[0]
  }

  if (phase === 'rapid') return pickRandom(pool, random) ?? null
  if (phase === 'coding') return pickRandom(matchDifficulty(pool, targetRank(state)), random) ?? null

  const rank = targetRank(state)
  const weakTags = new Set(state.weakTags)
  const buckets: { weight: number; items: InterviewQuestion[] }[] = [
    { weight: 0.4, items: matchDifficulty(pool, rank) },
    {
      weight: 0.3,
      items: capDifficulty(
        pool.filter((q) => ctx.difficultIds.has(q.sourceId) || q.tags.some((t) => weakTags.has(t))),
        rank,
      ),
    },
    {
      weight: 0.2,
      items: capDifficulty(
        pool.filter((q) => q.projectContext || q.tags.some((t) => PROJECT_TAGS.includes(t))),
        rank,
      ),
    },
    { weight: 0.1, items: capDifficulty(pool, rank) },
  ].filter((b) => b.items.length > 0)

  const total = buckets.reduce((s, b) => s + b.weight, 0)
  let roll = random() * total
  for (const b of buckets) {
    roll -= b.weight
    if (roll <= 0) return pickRandom(b.items, random) ?? null
  }
  return pickRandom(pool, random) ?? null
}

function deadline(config: ModeConfig, index: number): number {
  return config.phases.slice(0, index + 1).reduce((s, p) => s + p.budgetSec, 0)
}

function closingIndex(config: ModeConfig): number {
  return config.phases.findIndex((p) => p.phase === 'closing')
}

export function isTimeUp(state: PlannerState): boolean {
  return state.elapsedSec >= MODE_CONFIGS[state.mode].targetSec
}

/** Whether the interviewer may ask another follow-up in the current thread. */
export function canFollowUp(state: PlannerState): boolean {
  const config = MODE_CONFIGS[state.mode]
  const plan = config.phases[state.phaseIndex]
  if (!plan || plan.phase === 'closing') return false
  const ci = closingIndex(config)
  const closingBudget = ci >= 0 ? config.phases[ci].budgetSec : 0
  const remaining = config.targetSec - state.elapsedSec
  return state.followUpsInThread < plan.maxFollowUps && state.elapsedSec < deadline(config, state.phaseIndex) && remaining > closingBudget + 20
}

/**
 * Which phase the next *main* question should come from, or null when the
 * interview should end. Jumps to closing when time is short, and skips
 * phases whose time has already been used up by long answers.
 */
export function nextMainPhaseIndex(state: PlannerState): number | null {
  const config = MODE_CONFIGS[state.mode]
  const current = config.phases[state.phaseIndex]
  const ci = closingIndex(config)

  if (current?.phase === 'closing') return null
  if (isTimeUp(state)) return ci >= 0 ? ci : null

  const remaining = config.targetSec - state.elapsedSec
  if (ci >= 0 && remaining <= config.phases[ci].budgetSec) return ci

  let i = state.phaseIndex
  if (state.mainInPhase >= current.maxMain || state.elapsedSec >= deadline(config, i)) {
    i += 1
    while (i < config.phases.length - 1 && config.phases[i].phase !== 'closing' && state.elapsedSec >= deadline(config, i)) i += 1
  }
  return i < config.phases.length ? i : null
}

export function estimateTotalQuestions(state: PlannerState, turnsAsked: number): number {
  const config = MODE_CONFIGS[state.mode]
  const defaultTurnSec = state.mode === 'rapid' ? 20 : 95
  const avg = turnsAsked >= 2 && state.elapsedSec > 0 ? state.elapsedSec / turnsAsked : defaultTurnSec
  return Math.max(turnsAsked, Math.round(config.targetSec / Math.max(avg, 10)))
}

export function adjustLevel(level: number, quality: string): number {
  if (quality === 'strong') return Math.min(3, level + 1)
  if (quality === 'weak' || quality === 'off-topic') return Math.max(1, level - 1)
  return level
}

export function initialPlannerState(mode: InterviewMode, difficulty: InterviewDifficulty): PlannerState {
  const config = MODE_CONFIGS[mode]
  return {
    mode,
    difficulty,
    phaseIndex: 0,
    mainInPhase: 0,
    followUpsInThread: 0,
    level: difficulty === 'Adaptive' ? config.startLevel : DIFFICULTY_RANK[difficulty],
    elapsedSec: 0,
    askedIds: [],
    weakTags: [],
  }
}

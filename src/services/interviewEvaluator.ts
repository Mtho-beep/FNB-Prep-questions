import type {
  AnswerQuality,
  DimensionScores,
  InterviewQuestion,
  InterviewReport,
  InterviewTurn,
  NextAction,
  ScoreArea,
  TurnEvaluation,
} from '../types/interview'
import { allQuestions } from '../data'
import { getInterviewQuestion } from './interviewAdapter'

// Answer evaluation and the 100-point practice score.
//
// Per-answer evaluations come from the LLM when one is configured, or from a
// transparent keyword-overlap heuristic otherwise. The final area scores are
// always computed here, deterministically, from those per-answer scores — the
// LLM is only asked for the written strengths/improvements.

export const SCORE_WEIGHTS: Record<ScoreArea, number> = {
  technical: 25,
  project: 20,
  problemSolving: 15,
  communication: 15,
  behavioural: 10,
  fundamentals: 10,
  confidence: 5,
}

export const SCORE_AREA_LABELS: Record<ScoreArea, string> = {
  technical: 'Technical Knowledge',
  project: 'Project Understanding',
  problemSolving: 'Problem Solving',
  communication: 'Communication',
  behavioural: 'Behavioural Skills',
  fundamentals: 'AI/ML Fundamentals',
  confidence: 'Confidence/Clarity',
}

export const QUALITY_LABELS: Record<AnswerQuality, string> = {
  strong: 'Strong answer',
  partial: 'Partial answer',
  weak: 'Needs work',
  'off-topic': 'Off-topic',
  unclear: 'Unclear',
}

export function scoreLabel(score: number | null): string {
  if (score === null) return 'Not enough answers to score'
  if (score >= 85) return 'Excellent practice performance'
  if (score >= 70) return 'Strong practice performance'
  if (score >= 50) return 'Developing'
  return 'Needs more practice'
}

// --- Offline heuristic -------------------------------------------------------

const STOPWORDS = new Set(
  'a an the and or but if then than that this these those is are was were be been being to of in on for with as at by from it its into about over under we our you your they their i me my he she his her them us do does did done have has had not no so such can could would should will may might just also very more most other some any each which who whom what when where why how there here all both only own same too out up down off again further once because while during before after above below between through'.split(
    ' ',
  ),
)

function stem(word: string): string {
  return word.replace(/(ing|ed|es|s)$/, '')
}

function terms(text: string): Set<string> {
  const out = new Set<string>()
  for (const raw of text.toLowerCase().match(/[a-z0-9+#]+/g) ?? []) {
    if (raw.length < 3 || STOPWORDS.has(raw)) continue
    out.add(stem(raw))
  }
  return out
}

function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0
  for (const t of a) if (b.has(t)) n++
  return n
}

const clamp5 = (n: number) => Math.max(0, Math.min(5, Math.round(n * 10) / 10))

const STRUCTURE_MARKERS = /\b(first|second|then|finally|because|so that|for example|for instance|as a result|the result|situation|task|action|which meant)\b/gi
const PROJECT_MARKERS = /\b(fnb|langgraph|postgres(ql)?|verifier|requirement agent|code agent|studytogether|study rooms?|sarao|fastapi|read-only|schema)\b/gi

/** Keyword-overlap estimate. Honest about what it is: it cannot judge correctness. */
export function heuristicEvaluate(question: InterviewQuestion | undefined, answer: string): TurnEvaluation {
  const words = answer.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const answerTerms = terms(answer)
  const reference = question ? terms([question.modelAnswer, ...question.keyPoints, question.text].join(' ')) : new Set<string>()
  const questionTerms = question ? terms(question.text) : new Set<string>()
  const hasReference = Boolean(question?.modelAnswer)

  const coverage = reference.size ? overlap(answerTerms, reference) / Math.min(reference.size, 28) : 0
  const onQuestion = questionTerms.size ? overlap(answerTerms, questionTerms) / questionTerms.size : 0
  const structureHits = (answer.match(STRUCTURE_MARKERS) ?? []).length
  const specificHits = (answer.match(PROJECT_MARKERS) ?? []).length + (answer.match(/\d/g) ? 1 : 0)

  const lengthScore = wordCount < 8 ? 0.5 : wordCount < 30 ? 2.5 : wordCount <= 260 ? 4 : wordCount <= 400 ? 3.2 : 2.5
  const relevance = hasReference ? clamp5(coverage * 9 + onQuestion * 2) : clamp5(wordCount >= 25 ? 3.5 : lengthScore)
  const completeness = hasReference ? clamp5(coverage * 10) : clamp5(lengthScore - 0.5)

  const scores: DimensionScores = {
    relevance,
    accuracy: hasReference ? clamp5(coverage * 8 + 0.5) : 3,
    completeness,
    communication: clamp5(lengthScore),
    specificity: clamp5(1 + specificHits * 0.8),
    structure: clamp5(1.5 + structureHits * 0.7),
    depth: hasReference ? clamp5(coverage * 7 + Math.min(wordCount, 200) / 100) : clamp5(lengthScore - 1),
    authenticity: specificHits > 0 ? 4 : 3,
  }

  let quality: AnswerQuality
  if (wordCount < 8) quality = 'unclear'
  else if (hasReference && coverage < 0.06 && wordCount > 25) quality = 'off-topic'
  else if (!hasReference) quality = wordCount >= 40 ? 'strong' : wordCount >= 20 ? 'partial' : 'weak'
  else if (coverage >= 0.35 && wordCount >= 35) quality = 'strong'
  else if (coverage >= 0.17) quality = 'partial'
  else quality = 'weak'

  const strengths: string[] = []
  const missing: string[] = []
  if (question) {
    for (const kp of question.keyPoints) {
      const kpTerms = terms(kp)
      const hit = kpTerms.size ? overlap(answerTerms, kpTerms) / kpTerms.size : 0
      if (hit >= 0.35) strengths.push(`Touched on: ${kp}`)
      else missing.push(`Consider covering: ${kp}`)
    }
  }
  if (structureHits >= 2) strengths.push('Answer had a clear structure.')
  if (specificHits >= 2) strengths.push('Used concrete, project-specific details.')
  if (wordCount < 30) missing.push('Answer was very short — add an example or explanation.')
  if (wordCount > 400) missing.push('Answer was long — aim for a tighter 1–2 minute response.')

  return {
    quality,
    scores,
    strengths: strengths.slice(0, 3),
    missing: missing.slice(0, 3),
    feedback: hasReference
      ? `Offline estimate: about ${Math.round(Math.min(coverage, 1) * 100)}% overlap with the model answer's key terms.`
      : 'Offline estimate based on length and structure only (no model answer for this question).',
    source: 'offline',
  }
}

const NEUTRAL_ACKS = ['Thank you.', 'Okay.', 'Understood.', 'Alright.', 'Thanks.']

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/** Rule-based next step used when no LLM is available (or it fails). */
export function heuristicNextStep(
  quality: AnswerQuality,
  canFollowUp: boolean,
  unusedFollowUps: string[],
  root: InterviewQuestion | undefined,
  currentKind: InterviewTurn['kind'],
  nextMain: InterviewQuestion | null,
): { action: NextAction; say: string } {
  if (canFollowUp) {
    if (quality === 'unclear' && currentKind !== 'clarify') {
      return { action: 'clarify', say: "I didn't quite follow that. Could you clarify what you meant, perhaps with an example?" }
    }
    if (quality === 'off-topic' && root && currentKind !== 'redirect') {
      return { action: 'redirect', say: `Let me bring us back to the question. ${root.text}` }
    }
    if ((quality === 'strong' || quality === 'partial') && unusedFollowUps.length) {
      return { action: 'follow_up', say: unusedFollowUps[0] }
    }
    if (quality === 'partial' && currentKind === 'main') {
      return { action: 'clarify', say: 'Could you go into a bit more detail on that — ideally with a concrete example?' }
    }
  }
  if (!nextMain) return { action: 'advance', say: 'Thank you. That brings us to the end of the interview.' }
  return { action: 'advance', say: `${pick(NEUTRAL_ACKS)} ${nextMain.text}` }
}

// --- AI response normalisation --------------------------------------------------

const QUALITIES: AnswerQuality[] = ['strong', 'partial', 'weak', 'off-topic', 'unclear']
const ACTIONS: NextAction[] = ['follow_up', 'clarify', 'redirect', 'advance']
const DIMENSIONS: (keyof DimensionScores)[] = ['relevance', 'accuracy', 'completeness', 'communication', 'specificity', 'structure', 'depth', 'authenticity']

interface RawTurnResponse {
  quality?: string
  scores?: Record<string, unknown>
  strengths?: unknown
  missing?: unknown
  feedback?: unknown
  action?: string
  say?: unknown
}

function stringList(v: unknown, max: number): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').slice(0, max) : []
}

/** Validates an LLM turn response; throws if it is unusable so the caller can fall back. */
export function normalizeAiTurn(raw: RawTurnResponse): { evaluation: TurnEvaluation; action: NextAction; say: string } {
  const quality = QUALITIES.includes(raw.quality as AnswerQuality) ? (raw.quality as AnswerQuality) : null
  const action = ACTIONS.includes(raw.action as NextAction) ? (raw.action as NextAction) : 'advance'
  const say = typeof raw.say === 'string' ? raw.say.trim() : ''
  if (!quality || !raw.scores) throw new Error('AI response was missing the evaluation.')
  const scores = {} as DimensionScores
  for (const d of DIMENSIONS) {
    const n = Number(raw.scores[d])
    scores[d] = Number.isFinite(n) ? clamp5(n) : 2.5
  }
  return {
    evaluation: {
      quality,
      scores,
      strengths: stringList(raw.strengths, 3),
      missing: stringList(raw.missing, 3),
      feedback: typeof raw.feedback === 'string' ? raw.feedback : '',
      source: 'ai',
    },
    action,
    say,
  }
}

// --- Scoring and report ----------------------------------------------------------

function contentScore(s: DimensionScores): number {
  return ((s.relevance + s.accuracy + s.completeness + s.specificity + s.depth) / 5) * 20
}

function avg(values: number[]): number | undefined {
  return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : undefined
}

function areasForTurn(turn: InterviewTurn): ScoreArea[] {
  if (!turn.sourceId) return []
  return getInterviewQuestion(turn.sourceId)?.scoreAreas ?? []
}

/** Area scores (0–100) and the weighted overall practice score. */
export function computeScores(turns: InterviewTurn[]): { areaScores: Partial<Record<ScoreArea, number>>; overall: number | null } {
  const buckets: Record<ScoreArea, number[]> = {
    technical: [],
    project: [],
    problemSolving: [],
    communication: [],
    behavioural: [],
    fundamentals: [],
    confidence: [],
  }
  let skipped = 0
  for (const t of turns) {
    if (t.skipped) {
      skipped++
      for (const a of areasForTurn(t)) buckets[a].push(0)
      continue
    }
    const e = t.evaluation
    if (!e) continue
    const content = contentScore(e.scores)
    for (const a of areasForTurn(t)) buckets[a].push(content)
    buckets.communication.push(((e.scores.communication + e.scores.structure) / 2) * 20)
    buckets.confidence.push(((e.scores.communication + e.scores.specificity + e.scores.relevance) / 3) * 20)
  }
  const areaScores: Partial<Record<ScoreArea, number>> = {}
  for (const area of Object.keys(buckets) as ScoreArea[]) {
    let value = avg(buckets[area])
    if (area === 'confidence' && value !== undefined) value = Math.max(0, value - skipped * 5)
    if (value !== undefined) areaScores[area] = value
  }
  let weighted = 0
  let weightTotal = 0
  for (const [area, score] of Object.entries(areaScores) as [ScoreArea, number][]) {
    weighted += score * SCORE_WEIGHTS[area]
    weightTotal += SCORE_WEIGHTS[area]
  }
  return { areaScores, overall: weightTotal ? Math.round(weighted / weightTotal) : null }
}

const GENERIC_TAGS = new Set(['fnb', 'studytogether', 'projects', 'overview', 'star', 'motivation', 'ai', 'fundamentals'])

/** Picks existing questions to practise, based on skipped or weak answers. */
export function recommendQuestions(turns: InterviewTurn[], masteredIds: Set<string>, limit = 6): string[] {
  const out: string[] = []
  const add = (id: string) => {
    if (!out.includes(id) && !masteredIds.has(id) && out.length < limit) out.push(id)
  }
  const weakTurns = turns.filter(
    (t) => t.sourceId && (t.skipped || (t.evaluation && ['weak', 'partial', 'off-topic', 'unclear'].includes(t.evaluation.quality))),
  )
  for (const t of weakTurns) {
    const source = allQuestions.find((q) => q.id === t.sourceId)
    if (!source) continue
    add(source.id)
    const tags = source.tags.filter((tag) => !GENERIC_TAGS.has(tag))
    const related = allQuestions.filter((q) => q.id !== source.id && q.tags.some((tag) => tags.includes(tag)))
    for (const q of related.slice(0, 2)) add(q.id)
  }
  return out
}

export function buildOfflineReport(turns: InterviewTurn[], masteredIds: Set<string>): InterviewReport {
  const { areaScores, overall } = computeScores(turns)
  const answered = turns.filter((t) => t.evaluation)
  const strengths = [...new Set(answered.flatMap((t) => t.evaluation!.strengths))].slice(0, 5)
  const improvements = [...new Set(answered.flatMap((t) => t.evaluation!.missing))].slice(0, 5)
  const skipped = turns.filter((t) => t.skipped).length
  if (skipped) improvements.push(`${skipped} question${skipped === 1 ? ' was' : 's were'} skipped — practise those first.`)
  return {
    overall,
    label: scoreLabel(overall),
    areaScores,
    strengths,
    improvements: improvements.slice(0, 6),
    summary:
      'Scored offline with a keyword-overlap estimate against the model answers. It rewards covering the key ideas, but it cannot judge whether your technical claims were correct.',
    recommendedQuestionIds: recommendQuestions(turns, masteredIds),
    source: 'offline',
  }
}

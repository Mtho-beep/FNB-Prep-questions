import type { InterviewMode, InterviewQuestion } from '../types/interview'
import type { StudyMode, StudySession } from '../types/study'
import { adaptedCoding, adaptedProfile, adaptedQuestions } from './interviewAdapter'

// Study topics are *selectors* over the existing question bank — each topic
// is a filter, not a copy of any content. The tutor teaches from whatever
// questions, model answers and key points the selector returns.

export type TopicGroup = 'AI & ML' | 'Engineering' | 'Your Projects & Experience' | 'Interview Skills'

export interface StudyTopic {
  id: string
  label: string
  group: TopicGroup
  description: string
  /** The voice-interview mode used by "Interview Me" for this topic. */
  interviewMode: InterviewMode
  select: (q: InterviewQuestion) => boolean
}

const inCategory = (...cats: string[]) => (q: InterviewQuestion) => cats.includes(q.category)
const hasTag = (...tags: string[]) => (q: InterviewQuestion) => q.tags.some((t) => tags.includes(t))
const mentions = (re: RegExp) => (q: InterviewQuestion) => re.test(q.text)
const any =
  (...fns: ((q: InterviewQuestion) => boolean)[]) =>
  (q: InterviewQuestion) =>
    fns.some((f) => f(q))

export const STUDY_TOPICS: StudyTopic[] = [
  { id: 'ai-fundamentals', label: 'AI Fundamentals', group: 'AI & ML', description: 'What AI is, types of learning, core vocabulary.', interviewMode: 'fundamentals', select: inCategory('AI Fundamentals') },
  { id: 'machine-learning', label: 'Machine Learning', group: 'AI & ML', description: 'Training, overfitting, metrics, evaluation.', interviewMode: 'fundamentals', select: inCategory('Machine Learning') },
  {
    id: 'deep-learning',
    label: 'Deep Learning',
    group: 'AI & ML',
    description: 'Neural networks, activations, backpropagation.',
    interviewMode: 'fundamentals',
    select: any(hasTag('deep-learning', 'neural-network', 'backpropagation', 'activation-function', 'gradient-descent', 'dropout'), mentions(/neural|backprop|activation|relu|sigmoid|softmax|gradient descent|dropout/i)),
  },
  { id: 'llms', label: 'LLMs & Generative AI', group: 'AI & ML', description: 'Tokens, prompting, hallucination, fine-tuning.', interviewMode: 'fundamentals', select: inCategory('LLMs & Generative AI') },
  {
    id: 'embeddings',
    label: 'Embeddings & Vector Search',
    group: 'AI & ML',
    description: 'Turning meaning into vectors and searching them.',
    interviewMode: 'fundamentals',
    select: any(hasTag('embeddings', 'vector-search'), mentions(/embedding|vector|semantic search/i)),
  },
  {
    id: 'rag',
    label: 'RAG',
    group: 'AI & ML',
    description: 'Retrieval-Augmented Generation end to end.',
    interviewMode: 'fundamentals',
    select: any(
      hasTag('rag', 'embeddings', 'vector-search'),
      mentions(/\bRAG\b|retriev|semantic search|vector/i),
      (q) => q.category === 'LLMs & Generative AI' && /hallucinat/i.test(q.text),
    ),
  },
  { id: 'ai-agents', label: 'AI Agents', group: 'AI & ML', description: 'Tools, state, memory, orchestration, LangGraph.', interviewMode: 'technical', select: any(inCategory('AI Agents'), hasTag('agents', 'multi-agent', 'langgraph')) },
  { id: 'python', label: 'Python', group: 'Engineering', description: 'Language fundamentals and OOP.', interviewMode: 'technical', select: inCategory('Python') },
  { id: 'sql', label: 'SQL & Databases', group: 'Engineering', description: 'Queries, joins, indexes, transactions.', interviewMode: 'technical', select: inCategory('SQL & Databases') },
  { id: 'postgresql', label: 'PostgreSQL', group: 'Engineering', description: 'PostgreSQL and read-only, least-privilege access.', interviewMode: 'technical', select: any(hasTag('postgresql', 'least-privilege', 'sql-injection'), mentions(/postgres|read-only/i)) },
  { id: 'system-design', label: 'System Design', group: 'Engineering', description: 'Designing and scaling AI systems.', interviewMode: 'technical', select: inCategory('System Design') },
  { id: 'ai-security', label: 'AI Security', group: 'Engineering', description: 'Prompt injection, SQL injection, data protection.', interviewMode: 'technical', select: any(inCategory('Security'), hasTag('prompt-injection', 'sql-injection')) },
  { id: 'ai-banking', label: 'AI in Banking', group: 'Engineering', description: 'Fraud detection, risk, regulation.', interviewMode: 'technical', select: inCategory('AI + Banking') },
  { id: 'ethics', label: 'Responsible AI', group: 'Engineering', description: 'Bias, fairness, privacy, human oversight.', interviewMode: 'technical', select: inCategory('AI Ethics & Responsible AI') },
  { id: 'fnb-project', label: 'FNB Intelligent Banking', group: 'Your Projects & Experience', description: 'Your multi-agent SQL pipeline, taught back to you.', interviewMode: 'project', select: (q) => q.category === 'Project Questions' && q.tags.includes('fnb') },
  { id: 'studytogether', label: 'StudyTogether', group: 'Your Projects & Experience', description: 'Your collaborative study platform.', interviewMode: 'project', select: (q) => q.category === 'Project Questions' && q.tags.includes('studytogether') },
  { id: 'sarao', label: 'SARAO Experience', group: 'Your Projects & Experience', description: 'How to explain your vacation work.', interviewMode: 'behavioural', select: hasTag('sarao') },
  { id: 'behavioural', label: 'Behavioural Interview', group: 'Interview Skills', description: 'STAR answers, teamwork, pressure, failure.', interviewMode: 'behavioural', select: inCategory('Behavioural & Soft Skills', 'Teamwork') },
  { id: 'coderbyte', label: 'Coderbyte Problems', group: 'Interview Skills', description: 'Explaining algorithmic approaches out loud.', interviewMode: 'coding', select: inCategory('Coderbyte Technical Assessment') },
]

export const REVISION_TOPIC: StudyTopic = {
  id: 'revision',
  label: '15-Minute Revision',
  group: 'Interview Skills',
  description: 'A mixed, high-value revision session weighted towards your weak areas.',
  interviewMode: 'full',
  select: () => false,
}

/** "Teach me everything": the recommended order through the topics. */
export const CURRICULUM: string[] = [
  'python',
  'sql',
  'machine-learning',
  'deep-learning',
  'llms',
  'embeddings',
  'rag',
  'ai-agents',
  'system-design',
  'ai-security',
  'fnb-project',
  'behavioural',
  'coderbyte',
]

export const topicById = new Map(STUDY_TOPICS.map((t) => [t.id, t]))

const ALL_SOURCES: InterviewQuestion[] = [...adaptedQuestions, ...adaptedCoding, ...adaptedProfile]
const sourceById = new Map(ALL_SOURCES.map((q) => [q.sourceId, q]))

export function getStudySource(id: string): InterviewQuestion | undefined {
  return sourceById.get(id)
}

/** Concept questions first; project questions (the "how this applies to you" part) after. */
export function topicPool(topic: StudyTopic): InterviewQuestion[] {
  const pool = ALL_SOURCES.filter(topic.select)
  if (topic.group === 'Your Projects & Experience') return pool
  return [...pool.filter((q) => q.category !== 'Project Questions'), ...pool.filter((q) => q.category === 'Project Questions')]
}

const DIFFICULTY_FIT: Record<StudyMode, Record<string, number>> = {
  teach: { Beginner: 3, Intermediate: 1.5, Advanced: 0 },
  deep: { Beginner: 0.5, Intermediate: 2.5, Advanced: 3 },
  interview: { Beginner: 2.5, Intermediate: 2.5, Advanced: 0.5 },
}

function focusTerms(focus: string): string[] {
  return focus
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2)
    .map((t) => t.replace(/(ings?|s)$/, ''))
}

function focusScore(q: InterviewQuestion, terms: string[]): number {
  if (!terms.length) return 0
  const text = `${q.text} ${q.tags.join(' ')}`.toLowerCase()
  return terms.filter((t) => text.includes(t)).length / terms.length
}

export interface SourceOptions {
  mode: StudyMode
  difficultIds: Set<string>
  focus?: string
  limit?: number
  random?: () => number
}

/**
 * Picks the existing questions a lesson is grounded in. Prefers questions
 * you marked Difficult (more time on weak areas), the right difficulty for
 * the mode, and the focus concept when there is one. Keeps bank order so
 * lessons build from basics.
 */
export function selectSources(pool: InterviewQuestion[], opts: SourceOptions): InterviewQuestion[] {
  const random = opts.random ?? Math.random
  const terms = opts.focus ? focusTerms(opts.focus) : []
  const limit = opts.limit ?? (opts.mode === 'deep' ? 10 : 8)
  const scored = pool.map((q, index) => ({
    q,
    index,
    score:
      focusScore(q, terms) * 6 +
      (opts.difficultIds.has(q.sourceId) ? 3 : 0) +
      (DIFFICULTY_FIT[opts.mode][q.difficulty] ?? 1) +
      random() * 1.2,
  }))
  const filtered = terms.length ? scored.filter((s) => focusScore(s.q, terms) > 0) : scored
  return (filtered.length ? filtered : scored)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.q)
}

/** Sources for a focused lesson on one concept, searched across every topic. */
export function focusSources(focus: string, difficultIds: Set<string>): InterviewQuestion[] {
  return selectSources(ALL_SOURCES, { mode: 'teach', difficultIds, focus, limit: 5 })
}

/** How much each topic needs attention, from Difficult flags and past struggles. */
export function weakTopicScores(difficultIds: Set<string>, history: StudySession[]): Map<string, number> {
  const scores = new Map<string, number>()
  const struggles = history.flatMap((s) => s.weakConcepts.map((c) => c.toLowerCase()))
  for (const topic of STUDY_TOPICS) {
    const pool = topicPool(topic)
    let score = pool.filter((q) => difficultIds.has(q.sourceId)).length
    score += struggles.filter((c) => pool.some((q) => q.text.toLowerCase().includes(c) || q.tags.includes(c))).length * 0.5
    if (score > 0) scores.set(topic.id, score)
  }
  return scores
}

/** Sources for a 15-minute revision: a few from each high-value topic, weak topics first. */
export function revisionSources(difficultIds: Set<string>, history: StudySession[]): InterviewQuestion[] {
  const weak = weakTopicScores(difficultIds, history)
  const core = ['machine-learning', 'llms', 'rag', 'ai-agents', 'fnb-project']
  const ordered = [...core].sort((a, b) => (weak.get(b) ?? 0) - (weak.get(a) ?? 0))
  const extraWeak = [...weak.entries()]
    .filter(([id]) => !core.includes(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 1)
    .map(([id]) => id)
  const out: InterviewQuestion[] = []
  for (const id of [...ordered, ...extraWeak]) {
    const topic = topicById.get(id)
    if (!topic) continue
    const picked = selectSources(topicPool(topic), { mode: 'interview', difficultIds, limit: 2 }).filter((q) => !out.includes(q))
    out.push(...picked)
  }
  return out
}

/** A topic counts as covered once a session got through most of it. */
export function coveredTopicIds(history: StudySession[]): Set<string> {
  return new Set(
    history.filter((s) => s.sectionTitles.length > 0 && s.sectionsCovered.length / s.sectionTitles.length >= 0.7).map((s) => s.topicId),
  )
}

/** Concepts you have asked about or struggled with repeatedly. */
export function repeatedStruggles(history: StudySession[], minCount = 3): { concept: string; count: number }[] {
  const counts = new Map<string, { concept: string; count: number }>()
  for (const s of history) {
    for (const c of [...s.questions.map((q) => q.concept), ...s.weakConcepts]) {
      const key = c.trim().toLowerCase()
      if (!key) continue
      const entry = counts.get(key) ?? { concept: c.trim(), count: 0 }
      entry.count += 1
      counts.set(key, entry)
    }
  }
  return [...counts.values()].filter((e) => e.count >= minCount).sort((a, b) => b.count - a.count)
}

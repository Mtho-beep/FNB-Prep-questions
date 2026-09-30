import type { InterviewQuestion } from '../types/interview'
import type { CheckVerdict, LessonPlan, LessonSection, ScriptLine, SectionScript, Speaker } from '../types/study'

// Pure helpers for the tutor: offline fallbacks, validation of LLM output
// (so the UI never shows citations to questions that don't exist), voice
// command parsing and echo detection for hands-free interruption.

function sentences(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]*\s*/g) ?? [text]).map((s) => s.trim()).filter(Boolean)
}

/** Groups sentences into short spoken paragraphs (resume points). */
export function toParagraphs(text: string, perParagraph = 2): string[] {
  const s = sentences(text)
  const out: string[] = []
  for (let i = 0; i < s.length; i += perParagraph) out.push(s.slice(i, i + perParagraph).join(' '))
  return out
}

// --- Offline lesson (no LLM configured) -----------------------------------

export function offlinePlan(title: string, sources: InterviewQuestion[]): LessonPlan {
  const sections: LessonSection[] = [
    { title: 'Introduction', goal: `What this session on ${title} covers.`, sourceIds: [] },
    ...sources.map((q) => ({ title: q.text.replace(/\?$/, ''), goal: q.text, sourceIds: [q.sourceId] })),
    { title: 'Recap', goal: 'Key points to remember.', sourceIds: sources.map((q) => q.sourceId) },
  ]
  return { title, sections, source: 'offline' }
}

/** Reads the study notes aloud, clearly framed — offline mode can't teach conversationally. */
export function offlineScript(plan: LessonPlan, index: number, sources: InterviewQuestion[], includeCheck: boolean): SectionScript {
  const section = plan.sections[index]
  const tutor = (text: string): ScriptLine => ({ speaker: 'tutor', text })
  if (index === 0) {
    return {
      lines: [
        tutor(
          `Welcome to this study session on ${plan.title}. We'll work through ${plan.sections.length - 2} parts of your study notes. ` +
            "You're in offline mode, so I'll read your notes rather than teach conversationally. Connect an AI provider for a real tutor.",
        ),
      ],
      check: null,
      concept: plan.title,
    }
  }
  if (index === plan.sections.length - 1) {
    const points = sources.flatMap((q) => q.keyPoints.slice(0, 1)).slice(0, 5)
    return {
      lines: [tutor(`Let's recap ${plan.title}.`), ...points.map((p) => tutor(p.endsWith('.') ? p : `${p}.`))],
      check: null,
      concept: plan.title,
    }
  }
  const q = sources[0]
  if (!q) return { lines: [tutor(section.goal)], check: null, concept: section.title }
  const body = q.modelAnswer || q.projectContext || ''
  return {
    lines: [tutor(`Next: ${q.text}`), ...toParagraphs(body).map(tutor)],
    check: includeCheck ? `In your own words: ${q.text}` : null,
    concept: q.tags.find((t) => !['fnb', 'studytogether', 'projects'].includes(t))?.replace(/-/g, ' ') ?? section.title,
  }
}

function tokens(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length > 2)
}

/** The source whose question/answer best matches free text (offline Q&A). */
export function bestMatchingSource(text: string, sources: InterviewQuestion[]): InterviewQuestion | undefined {
  const want = new Set(tokens(text))
  let best: InterviewQuestion | undefined
  let bestScore = 0
  for (const q of sources) {
    const have = new Set(tokens(`${q.text} ${q.text} ${q.keyPoints.join(' ')} ${q.tags.join(' ')}`))
    let score = 0
    for (const t of want) if (have.has(t)) score++
    if (score > bestScore) {
      best = q
      bestScore = score
    }
  }
  return best
}

// --- LLM output validation -------------------------------------------------

export function normalizePlan(raw: unknown, sources: InterviewQuestion[], fallbackTitle: string): LessonPlan {
  const r = raw as { title?: unknown; sections?: unknown }
  const validIds = new Set(sources.map((q) => q.sourceId))
  const sections = (Array.isArray(r?.sections) ? r.sections : [])
    .map((s: { title?: unknown; goal?: unknown; sourceIds?: unknown }) => ({
      title: typeof s?.title === 'string' ? s.title.trim() : '',
      goal: typeof s?.goal === 'string' ? s.goal.trim() : '',
      sourceIds: Array.isArray(s?.sourceIds) ? s.sourceIds.filter((id: unknown): id is string => typeof id === 'string' && validIds.has(id)) : [],
    }))
    .filter((s) => s.title)
    .slice(0, 12)
  if (sections.length < 3) throw new Error('The lesson plan was too short.')
  // Any source the model forgot to cite is attached to the section with the closest title.
  const cited = new Set(sections.flatMap((s) => s.sourceIds))
  for (const q of sources) {
    if (cited.has(q.sourceId)) continue
    const target = sections.slice(1, -1).find((s) => bestMatchingSource(s.title + ' ' + s.goal, [q])) ?? sections[Math.min(1, sections.length - 1)]
    target.sourceIds.push(q.sourceId)
  }
  return { title: typeof r.title === 'string' && r.title.trim() ? r.title.trim() : fallbackTitle, sections, source: 'ai' }
}

const SPEAKERS: Speaker[] = ['tutor', 'host', 'expert']

export function normalizeScript(raw: unknown, style: 'solo' | 'duo', includeCheck: boolean, fallbackConcept: string): SectionScript {
  const r = raw as { lines?: unknown; paragraphs?: unknown; check?: unknown; concept?: unknown }
  const rawLines = Array.isArray(r?.lines) ? r.lines : Array.isArray(r?.paragraphs) ? r.paragraphs : []
  const lines: ScriptLine[] = []
  for (const l of rawLines) {
    const text = typeof l === 'string' ? l : typeof l?.text === 'string' ? l.text : ''
    if (!text.trim()) continue
    let speaker: Speaker = SPEAKERS.includes(l?.speaker) ? l.speaker : 'tutor'
    if (style === 'solo') speaker = 'tutor'
    else if (speaker === 'tutor') speaker = lines.length % 2 === 0 ? 'host' : 'expert'
    // Keep resume points short: split long paragraphs.
    for (const p of toParagraphs(text.trim(), 3)) lines.push({ speaker, text: p })
  }
  if (!lines.length) throw new Error('The section script was empty.')
  return {
    lines,
    check: includeCheck && typeof r.check === 'string' && r.check.trim() ? r.check.trim() : null,
    concept: typeof r.concept === 'string' && r.concept.trim() ? r.concept.trim() : fallbackConcept,
  }
}

export function normalizeVerdict(v: unknown): CheckVerdict {
  return v === 'correct' || v === 'partly' || v === 'incorrect' ? v : 'partly'
}

// --- Voice commands ----------------------------------------------------------

export type TutorCommand =
  | 'stop'
  | 'pause'
  | 'continue'
  | 'skip'
  | 'repeat'
  | 'simpler'
  | 'deeper'
  | 'example'
  | 'quiz'
  | 'wait'
  | 'no'
  | null

/**
 * Recognises short spoken commands. Anything longer or not matching is
 * treated as a question, so "wait, what does that mean?" is a question.
 */
export function parseCommand(input: string): TutorCommand {
  const t = input.toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim()
  if (!t) return null
  const words = t.split(' ').length
  if (words > 7) return null
  if (/^(stop|stop talking|be quiet|end)( please)?$/.test(t)) return 'stop'
  if (/^(pause|hold on|hang on)( please)?$/.test(t)) return 'pause'
  if (/^(wait|sorry|um|uh|hmm|one sec(ond)?)$/.test(t)) return 'wait'
  if (/^(yes|yeah|yep|ok|okay|sure|got it|makes sense|that makes sense|continue|carry on|go on|go ahead|keep going|resume|play|next section)( please)?$/.test(t))
    return 'continue'
  if (/^(no|nope|not really|i don't get it|i don't understand)$/.test(t)) return 'no'
  if (/^(skip|skip this|skip ahead|next|move on)( please)?$/.test(t)) return 'skip'
  if (/^(repeat|repeat that|say that again|again|come again|replay)( please)?$/.test(t)) return 'repeat'
  if (/(explain (it|that|this)? ?simply|simpler|in simple terms|like i'?m five|dumb it down)/.test(t)) return 'simpler'
  if (/(go deeper|more detail|deeper|dig deeper|in depth)/.test(t)) return 'deeper'
  if (/^(give me an example|an example|example|for example|example please|can you give me an example)$/.test(t)) return 'example'
  if (/^(quiz me|test me|ask me a question|another question|next question)$/.test(t)) return 'quiz'
  return null
}

/**
 * True when recognised speech is most likely the tutor's own voice coming
 * back through the speakers (most of its words are in what is being said).
 */
export function isLikelyEcho(heard: string, beingSpoken: string): boolean {
  const heardTokens = tokens(heard)
  if (heardTokens.length === 0) return true
  const spoken = new Set(tokens(beingSpoken))
  const overlap = heardTokens.filter((t) => spoken.has(t)).length / heardTokens.length
  return overlap >= 0.6
}

import { candidateProfileSummary } from '../data/candidateProfile'
import type { InterviewQuestion } from '../types/interview'
import type { AskKind, Interactivity, LessonPlan, LessonSection, PodcastStyle, StudyMode, TranscriptEntry } from '../types/study'

// Prompts for the AI tutor. Each request carries only the sources for the
// current lesson/section, the recent conversation and the request itself —
// never the whole question bank.

function clip(text: string, max: number): string {
  const t = text.trim()
  return t.length > max ? `${t.slice(0, max)}…` : t
}

export const TUTOR_SYSTEM_PROMPT = `You are a friendly, expert AI tutor helping an early-career candidate prepare for an AI engineering interview at FNB. You teach by talking: everything you write will be spoken aloud.

Teaching style:
- Conversational and beginner-friendly first (plain language, an everyday analogy), then technically precise. Build ideas progressively.
- Never just read the study material back. Explain it in your own words, the way a good teacher would.
- Connect concepts to the candidate's own projects and to how they could come up in an interview, when it genuinely fits.
- Spoken style: short sentences. No markdown, bullet symbols, headings, code blocks, URLs or emojis. Say symbols in words.

Grounding rules:
- Ground your teaching in the STUDY MATERIAL provided. When you add something that is not in it, say so briefly, for example "Going a little beyond your study notes...".
- Never invent facts about the candidate (projects, education, experience, skills, responsibilities), about FNB, or about SARAO. Use only the candidate profile and study material.
- Examples must be clearly hypothetical ("Imagine a bank's support assistant..."). Never state FNB's real systems, databases, policies, products, rates or figures — you don't know them. Don't put made-up numbers in an example as if they were real.
- If asked about the candidate's own work and the answer is not in the material, say: "I don't have that in your study material, but I can explain the general concept if you'd like."

Candidate profile (the only background facts you may rely on):
${candidateProfileSummary()}

Always reply with a single JSON object and nothing else.`

const MODE_GUIDE: Record<StudyMode, string> = {
  teach:
    'TEACH ME: start from the basics. Typical flow: introduction, why it matters, what it is, how it works, main components, an example, advantages and limitations, a likely interview question, quick recap.',
  deep:
    'DEEP DIVE: the candidate knows the basics. Go into architecture, internals, trade-offs, failure handling, evaluation and production considerations — still pitched at a strong junior engineer.',
  interview:
    'FNB INTERVIEW PREP: teach what is likely to be asked, how to explain it concisely, common follow-up questions, and how to connect it to the candidate\'s projects. Model short, strong interview answers.',
}

/** Compact digest of the sources, used for planning. */
export function sourceDigest(sources: InterviewQuestion[], difficultIds: Set<string>): string {
  return sources
    .map((q) => {
      const flag = difficultIds.has(q.sourceId) ? ' [candidate marked this DIFFICULT]' : ''
      const points = q.keyPoints.length ? q.keyPoints.slice(0, 3).join('; ') : clip(q.modelAnswer || q.projectContext || '', 160)
      return `[${q.sourceId}] ${q.text}${flag} — ${points}`
    })
    .join('\n')
}

/** Full material for the sources of one section. */
export function sectionMaterial(sources: InterviewQuestion[]): string {
  if (!sources.length) return '(no specific material — keep to general, well-established knowledge and say so)'
  return sources
    .map((q) => {
      const parts = [`[${q.sourceId}] Q: ${q.text}`]
      if (q.modelAnswer) parts.push(`A: ${clip(q.modelAnswer, 550)}`)
      if (q.keyPoints.length) parts.push(`Key points: ${q.keyPoints.join('; ')}`)
      if (q.projectContext) parts.push(`Connection to the candidate: ${clip(q.projectContext, 250)}`)
      if (q.followUps.length) parts.push(`Common follow-ups: ${q.followUps.slice(0, 2).join(' | ')}`)
      return parts.join('\n')
    })
    .join('\n\n')
}

export interface PlanPromptInput {
  topicLabel: string
  mode: StudyMode
  focus?: string
  revision?: boolean
  sources: InterviewQuestion[]
  difficultIds: Set<string>
}

export function buildPlanPrompt(input: PlanPromptInput): string {
  const sectionCount = input.focus ? '4-5' : input.revision ? '6-7' : '7-9'
  const lines = [
    `Create a lesson plan for a spoken study session.`,
    `Topic: ${input.topicLabel}${input.focus ? ` — focused lesson on "${input.focus}" (about 10 minutes)` : ''}.`,
    input.revision
      ? 'This is a 15-MINUTE REVISION across several interview topics: give each topic one section, weakest topics first, and end with a short recap. Keep it high-value and interview-focused.'
      : MODE_GUIDE[input.mode],
    `Plan ${sectionCount} sections. Each section is spoken for 30-90 seconds, so keep each one to a single idea.`,
    'Spend more sections on material the candidate marked DIFFICULT.',
    '',
    'STUDY MATERIAL (existing questions from the candidate\'s app):',
    sourceDigest(input.sources, input.difficultIds),
    '',
    'Reply with JSON only, exactly this shape:',
    '{"title": "short lesson title", "sections": [{"title": "2-5 word section title", "goal": "one sentence: what this section teaches", "sourceIds": ["ids from the study material this section draws on"]}]}',
  ]
  return lines.join('\n')
}

export interface SectionPromptInput {
  plan: LessonPlan
  index: number
  mode: StudyMode
  style: PodcastStyle
  includeCheck: boolean
  sources: InterviewQuestion[]
  lastSaid: string
}

export function buildSectionPrompt(input: SectionPromptInput): string {
  const section: LessonSection = input.plan.sections[input.index]
  const total = input.plan.sections.length
  const done = input.plan.sections.slice(0, input.index).map((s) => s.title)
  const lines = [
    `Write the spoken script for section ${input.index + 1} of ${total} of the lesson "${input.plan.title}".`,
    `Section: "${section.title}" — ${section.goal}`,
    MODE_GUIDE[input.mode],
    done.length ? `Already covered: ${done.join(', ')}. Do not repeat them; build on them.` : 'This is the opening section: welcome the candidate briefly and say what the lesson covers.',
    input.lastSaid ? `The last thing said was: "${clip(input.lastSaid, 300)}"` : '',
    input.index === total - 1 ? 'This is the final section: recap the key ideas and give one likely interview question with a short model answer.' : '',
    input.style === 'duo'
      ? 'Format: a two-person podcast. "host" introduces the idea, asks natural questions and simplifies; "expert" explains technically, gives examples and limitations. Alternate speakers, 3-6 lines.'
      : 'Format: a single tutor ("tutor") speaking in 2-4 short paragraphs.',
    'Length: 90-200 words in total (about 30-80 seconds of speech).',
    input.includeCheck
      ? 'Set "check" to one short quick-check question the candidate can answer in a sentence or two about this section. Do not also ask it inside the lines.'
      : 'Set "check" to null.',
    '',
    'STUDY MATERIAL FOR THIS SECTION:',
    sectionMaterial(input.sources),
    '',
    'Reply with JSON only, exactly this shape:',
    input.style === 'duo'
      ? '{"lines": [{"speaker": "host" | "expert", "text": "..."}], "check": "..." | null, "concept": "2-4 word name of the main concept"}'
      : '{"lines": [{"speaker": "tutor", "text": "..."}], "check": "..." | null, "concept": "2-4 word name of the main concept"}',
  ]
  return lines.filter(Boolean).join('\n')
}

const ASK_GUIDE: Record<AskKind, string> = {
  question: 'Answer the question directly. Resolve references like "that", "it" or "an example" using the current section and conversation.',
  simpler: 'Explain the concept again at a complete-beginner level with one everyday analogy. No jargon.',
  deeper: 'Go one level deeper technically (internals, trade-offs, how it works under the hood), still appropriate for a strong junior engineer.',
  example:
    "Give one concrete, clearly hypothetical example of the concept. Prefer a generic banking scenario, or the candidate's FNB Intelligent Banking Simulation project (a learnership simulation, not FNB's real systems) if it genuinely fits.",
}

export interface AskPromptInput {
  planTitle: string
  section: LessonSection | undefined
  concept: string
  currentText: string
  history: TranscriptEntry[]
  sources: InterviewQuestion[]
  kind: AskKind
  request: string
}

export function buildAskPrompt(input: AskPromptInput): string {
  const recent = input.history
    .filter((e) => e.role !== 'system')
    .slice(-6)
    .map((e) => `${e.role === 'you' ? 'Candidate' : 'Tutor'}: ${clip(e.text, 280)}`)
  return [
    `The candidate interrupted the lesson "${input.planTitle}".`,
    input.section ? `Current section: "${input.section.title}" — ${input.section.goal}. Main concept: ${input.concept || input.section.title}.` : '',
    input.currentText ? `You were saying: "${clip(input.currentText, 500)}"` : '',
    recent.length ? `Recent conversation:\n${recent.join('\n')}` : '',
    '',
    'STUDY MATERIAL FOR THIS SECTION:',
    sectionMaterial(input.sources),
    '',
    `Request type: ${input.kind}. ${ASK_GUIDE[input.kind]}`,
    `The candidate said: "${clip(input.request, 600)}"`,
    'Answer in 40-150 words, spoken style. Do not end by asking whether to continue — the app does that.',
    '',
    'Reply with JSON only: {"answer": "...", "concept": "2-4 word concept the request was about", "fromMaterial": true if the answer is based on the study material, false if it is general knowledge}',
  ]
    .filter(Boolean)
    .join('\n')
}

export function buildCheckPrompt(question: string, answer: string, sources: InterviewQuestion[], quiz: boolean): string {
  return [
    `${quiz ? 'Quiz question' : 'Quick-check question'} you asked: "${question}"`,
    `The candidate answered: "${clip(answer, 800)}"`,
    '',
    'STUDY MATERIAL:',
    sectionMaterial(sources),
    '',
    'Evaluate the answer for a junior candidate. Be encouraging but honest; do not over-praise.',
    'Reply with JSON only: {"verdict": "correct" | "partly" | "incorrect", "feedback": "1-3 spoken sentences: confirm or gently correct, and state the key idea", "concept": "2-4 word concept being tested"}',
  ].join('\n')
}

export const INTERACTIVITY_LABELS: Record<Interactivity, string> = {
  passive: 'Passive — mostly listen',
  balanced: 'Balanced — occasional questions',
  interactive: 'Interactive — frequent questions',
}

/** Whether the tutor asks a quick check after section i. */
export function shouldCheck(interactivity: Interactivity, index: number, total: number): boolean {
  if (interactivity === 'passive' || index === 0 || index === total - 1) return false
  if (interactivity === 'interactive') return index % 2 === 0
  return index % 3 === 2
}

/** Whether the tutor pauses for "does that make sense?" after section i. */
export function shouldCheckpoint(interactivity: Interactivity, index: number, total: number): boolean {
  if (interactivity !== 'interactive' || index === 0 || index === total - 1) return false
  return index % 2 === 1
}

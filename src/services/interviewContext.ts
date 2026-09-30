import { candidateProfileSummary } from '../data/candidateProfile'
import type { InterviewPhase, InterviewQuestion, InterviewTurn } from '../types/interview'

// Builds the prompts sent to the LLM. Each request carries only what the
// current decision needs — the profile, recent turns, the current question
// with its model answer/key points, and the planned next question — never
// the whole question bank.

const MAX_ANSWER_CHARS = 1800
const MAX_HISTORY_ANSWER_CHARS = 450
const MAX_MODEL_ANSWER_CHARS = 1400
const RECENT_TURNS = 4

function clip(text: string, max: number): string {
  const t = text.trim()
  return t.length > max ? `${t.slice(0, max)}…` : t
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.round(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export const INTERVIEWER_SYSTEM_PROMPT = `You are conducting a realistic, timed AI engineering mock interview for a junior/graduate AI engineering role.

The candidate is an early-career AI/software engineering candidate. Your purpose is to assess communication, technical fundamentals, problem solving, project understanding and learning ability.

How to behave:
- Ask one question at a time. Keep what you say short and conversational — no lectures or long explanations between questions.
- Build on what the candidate actually said. Refer back to specifics they mentioned ("You mentioned the Verifier Agent — ..."), and never ask them to repeat something they already covered.
- Strong answer: probe one level deeper. Partial answer: ask a clarifying question. Incorrect or weak answer: ask a simpler follow-up that lets them show what they do understand, or move on. Off-topic: politely bring them back. Unclear: ask them to clarify.
- Keep questions appropriate for a junior role. Do not jump to senior-level architecture questions and do not try to trick the candidate.
- Do not constantly praise. Avoid "Great answer!" / "Excellent!". Neutral acknowledgements like "Thank you." or "Okay, let's go deeper into that." are fine, or simply ask the next question.
- Never reveal model answers, key points or scores during the interview.
- Never invent experience, employers, qualifications or achievements. Only rely on the candidate profile below and what the candidate says. Do not assume they implemented something they did not mention.
- Do not repeat questions that were already asked.
- Respect the time limit: when the state says follow-ups are not allowed, move to the planned next question.

Candidate profile (the only background facts you may rely on):
${candidateProfileSummary()}

You always reply with a single JSON object and nothing else.`

export const TURN_RESPONSE_FORMAT = `Reply with JSON only, exactly this shape:
{
  "quality": "strong" | "partial" | "weak" | "off-topic" | "unclear",
  "scores": { "relevance": 0-5, "accuracy": 0-5, "completeness": 0-5, "communication": 0-5, "specificity": 0-5, "structure": 0-5, "depth": 0-5, "authenticity": 0-5 },
  "strengths": ["up to 3 short points about what the answer did well"],
  "missing": ["up to 3 short points about what was missing or inaccurate"],
  "feedback": "1-2 sentences of coaching, shown only after the interview",
  "action": "follow_up" | "clarify" | "redirect" | "advance",
  "say": "exactly what the interviewer says next, spoken aloud"
}
Scoring guide (junior level): 5 = excellent, 3 = adequate, 1 = poor, 0 = absent. "authenticity" = consistency with the candidate profile.
Rules for "say":
- follow_up / clarify / redirect: one question that builds on the candidate's answer. Only allowed when the state says follow-ups are allowed.
- advance: optionally a very brief neutral acknowledgement, then ask the planned next main question (you may rephrase it naturally to connect to the conversation, but keep its meaning).
- If there is no planned next question and you advance, say a brief thank-you that closes the interview.`

export interface TurnContextInput {
  modeLabel: string
  phase: InterviewPhase
  remainingSec: number
  levelLabel: string
  canFollowUp: boolean
  current: InterviewTurn
  rootQuestion?: InterviewQuestion
  unusedFollowUps: string[]
  history: InterviewTurn[]
  nextMain: InterviewQuestion | null
  answer: string
}

export function buildTurnPrompt(input: TurnContextInput): string {
  const recent = input.history.filter((t) => t.answer !== undefined || t.skipped).slice(-RECENT_TURNS)
  const lines: string[] = [
    'INTERVIEW STATE',
    `Mode: ${input.modeLabel}. Phase: ${input.phase}. Time remaining: ${formatTime(input.remainingSec)}. Target difficulty: ${input.levelLabel}.`,
    `Follow-ups allowed now: ${input.canFollowUp ? 'yes' : 'no — you must advance'}.`,
    input.nextMain
      ? `Planned next main question (use it if you advance): "${input.nextMain.text}"`
      : 'Planned next main question: none — the interview ends after this answer.',
    '',
  ]

  if (recent.length) {
    lines.push('RECENT CONVERSATION (oldest first)')
    for (const t of recent) {
      lines.push(`Interviewer: ${t.text}`)
      lines.push(`Candidate: ${t.skipped ? '[skipped]' : clip(t.answer ?? '', MAX_HISTORY_ANSWER_CHARS)}`)
    }
    lines.push('')
  }

  const earlier = input.history.slice(0, Math.max(0, input.history.length - RECENT_TURNS))
  if (earlier.length) {
    lines.push('EARLIER QUESTIONS ALREADY ASKED (do not repeat)')
    for (const t of earlier) lines.push(`- ${clip(t.text, 140)}`)
    lines.push('')
  }

  lines.push('CURRENT QUESTION')
  lines.push(`Interviewer: ${input.current.text}`)
  const root = input.rootQuestion
  if (root) {
    if (input.current.kind !== 'main') lines.push(`(This is a follow-up in a thread that started with: "${root.text}")`)
    if (root.modelAnswer) lines.push(`Reference answer (hidden from candidate, for scoring only): ${clip(root.modelAnswer, MAX_MODEL_ANSWER_CHARS)}`)
    if (root.keyPoints.length) lines.push(`Key points: ${root.keyPoints.join(' | ')}`)
    if (root.projectContext) lines.push(`Project context: ${clip(root.projectContext, 400)}`)
    if (input.unusedFollowUps.length) lines.push(`Stored follow-up questions you may reuse or adapt: ${input.unusedFollowUps.join(' | ')}`)
  }
  lines.push('')
  lines.push("CANDIDATE'S ANSWER")
  lines.push(`"${clip(input.answer, MAX_ANSWER_CHARS)}"`)
  lines.push('')
  lines.push(TURN_RESPONSE_FORMAT)
  return lines.join('\n')
}

export const REPORT_RESPONSE_FORMAT = `Reply with JSON only, exactly this shape:
{
  "strengths": ["3-5 specific strengths, each tied to something the candidate said"],
  "improvements": ["3-5 specific, actionable areas to improve"],
  "summary": "2-3 sentence overall practice summary. This is practice feedback, not a hiring prediction."
}`

export function buildReportPrompt(modeLabel: string, turns: InterviewTurn[]): string {
  const lines = [`Write the end-of-interview feedback for this ${modeLabel} practice session.`, '', 'TRANSCRIPT WITH PER-ANSWER NOTES']
  for (const t of turns) {
    lines.push(`Q (${t.phase}): ${clip(t.text, 200)}`)
    if (t.skipped) {
      lines.push('A: [skipped]')
      continue
    }
    if (t.answer === undefined) continue
    lines.push(`A: ${clip(t.answer, 500)}`)
    if (t.evaluation) {
      lines.push(`Notes: quality=${t.evaluation.quality}; missing: ${t.evaluation.missing.join('; ') || 'none'}`)
    }
  }
  lines.push('', 'Do not claim the candidate will pass or fail a real interview. Do not invent experience.', REPORT_RESPONSE_FORMAT)
  return lines.join('\n')
}

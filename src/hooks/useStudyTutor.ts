import { useCallback, useEffect, useRef, useState } from 'react'
import type { InterviewQuestion } from '../types/interview'
import type {
  AskKind,
  CheckRecord,
  Interactivity,
  LessonCursor,
  LessonPlan,
  PodcastStyle,
  ScriptLine,
  SectionScript,
  Speaker,
  StudyMode,
  StudyQuestionRecord,
  StudySession,
  StudySessionKind,
  TranscriptEntry,
} from '../types/study'
import type { UseProgressReturn } from './useProgress'
import type { SpeakOverrides } from './useTextToSpeech'
import { PROVIDER_LABELS, complete, parseJsonObject, type ProviderKind } from '../services/aiProvider'
import { getStreamlitLlm } from '../lib/streamlit'
import { getStudySource, type StudyTopic } from '../services/studyTopics'
import { TUTOR_SYSTEM_PROMPT, buildAskPrompt, buildCheckPrompt, buildPlanPrompt, buildSectionPrompt, shouldCheck, shouldCheckpoint } from '../services/tutorContext'
import { bestMatchingSource, normalizePlan, normalizeScript, normalizeVerdict, offlinePlan, offlineScript, parseCommand, toParagraphs } from '../services/tutorHelpers'
import { heuristicEvaluate } from '../services/interviewEvaluator'

// The tutor state machine.
//
//   planning -> generating -> speaking --(end of section)--> awaiting-check / awaiting-continue / next section
//        any time: interrupt -> listening -> thinking -> answering -> awaiting-continue -> resume at cursor
//
// Every action that changes what should be spoken bumps `runRef`; async work
// checks its token afterwards and quietly drops stale results, so rapid
// interruptions ("wait" ... "explain that again" ... "give me an example")
// never leave two voices talking or resume the wrong thing.

export type TutorStatus =
  | 'idle'
  | 'planning'
  | 'generating'
  | 'speaking'
  | 'paused'
  | 'stopped'
  | 'listening'
  | 'thinking'
  | 'answering'
  | 'awaiting-check'
  | 'awaiting-continue'
  | 'quiz'
  | 'finished'

type Pending =
  | { type: 'check'; question: string; section: number }
  | { type: 'quiz'; question: string; source: InterviewQuestion }
  | { type: 'continue'; reason: 'answer' | 'checkpoint' | 'quiz' }
  | null

export interface StartConfig {
  topic: StudyTopic
  mode: StudyMode
  kind: StudySessionKind
  interactivity: Interactivity
  style: PodcastStyle
  focus?: string
  providerKind: ProviderKind
  sources: InterviewQuestion[]
}

export interface TutorSpeech {
  speak: (text: string, overrides?: SpeakOverrides) => Promise<void>
  stop: () => void
  pause: () => void
  resume: () => void
  voiceFor: (speaker: Speaker) => SpeakOverrides
}

interface TutorState {
  config: StartConfig | null
  plan: LessonPlan | null
  scripts: (SectionScript | undefined)[]
  cursor: LessonCursor
  inSection: boolean
  lastLine: LessonCursor | null
  status: TutorStatus
  statusBeforePause: TutorStatus
  pending: Pending
  transcript: TranscriptEntry[]
  nowSpeaking: ScriptLine | null
  notice: string | null
  startedAt: number
  covered: number[]
  questions: StudyQuestionRecord[]
  checks: CheckRecord[]
  interruptions: number
  quizzedIds: string[]
  askedSinceResume: boolean
  finished: StudySession | null
}

function initialState(): TutorState {
  return {
    config: null,
    plan: null,
    scripts: [],
    cursor: { section: 0, line: 0 },
    inSection: false,
    lastLine: null,
    status: 'idle',
    statusBeforePause: 'idle',
    pending: null,
    transcript: [],
    nowSpeaking: null,
    notice: null,
    startedAt: 0,
    covered: [],
    questions: [],
    checks: [],
    interruptions: 0,
    quizzedIds: [],
    askedSinceResume: false,
    finished: null,
  }
}

let entryCounter = 0
const entryId = () => `t-${Date.now().toString(36)}-${++entryCounter}`

function firstSentences(text: string, n: number): string {
  return toParagraphs(text, n)[0] ?? ''
}

export function useStudyTutor(progress: UseProgressReturn, speech: TutorSpeech) {
  const s = useRef<TutorState>(initialState())
  const runRef = useRef(0)
  const scriptPromises = useRef(new Map<number, Promise<SectionScript>>())
  const speechRef = useRef(speech)
  const progressRef = useRef(progress)
  const [, setVersion] = useState(0)

  useEffect(() => {
    speechRef.current = speech
    progressRef.current = progress
  })

  const render = useCallback(() => setVersion((v) => v + 1), [])

  // Stop talking when the page unmounts.
  useEffect(
    () => () => {
      runRef.current++
      speechRef.current.stop()
    },
    [],
  )

  const difficultIds = () =>
    new Set(
      Object.entries(progressRef.current.state.questions)
        .filter(([, p]) => p.difficult)
        .map(([id]) => id),
    )

  const mainSpeaker = (): Speaker => (s.current.config?.style === 'duo' ? 'expert' : 'tutor')

  const sectionSources = (index: number): InterviewQuestion[] =>
    (s.current.plan?.sections[index]?.sourceIds ?? []).map(getStudySource).filter((q): q is InterviewQuestion => q !== undefined)

  const allSources = (): InterviewQuestion[] => s.current.config?.sources ?? []

  /** Current section for context: the one being taught, or the one just finished. */
  const activeSection = () => (s.current.inSection ? s.current.cursor.section : (s.current.lastLine?.section ?? s.current.cursor.section))

  /** Speaks one line (adding it to the transcript). Resolves false if interrupted. */
  const say = useCallback(
    async (line: ScriptLine, opts: { generalKnowledge?: boolean } = {}): Promise<boolean> => {
      const token = runRef.current
      const st = s.current
      st.transcript = [
        ...st.transcript,
        { id: entryId(), role: line.speaker, text: line.text, section: activeSection(), generalKnowledge: opts.generalKnowledge },
      ]
      st.nowSpeaking = line
      render()
      await speechRef.current.speak(line.text, speechRef.current.voiceFor(line.speaker))
      if (token !== runRef.current) return false
      st.nowSpeaking = null
      render()
      return true
    },
    [render],
  )

  const addUserEntry = (text: string) => {
    s.current.transcript = [...s.current.transcript, { id: entryId(), role: 'you', text, section: activeSection() }]
  }

  const loadScript = useCallback((index: number): Promise<SectionScript> => {
    const existing = scriptPromises.current.get(index)
    if (existing) return existing
    const st = s.current
    const cfg = st.config!
    const plan = st.plan!
    const sources = sectionSources(index)
    const includeCheck = shouldCheck(cfg.interactivity, index, plan.sections.length)
    const fallback = () =>
      offlineScript(plan, index, index === plan.sections.length - 1 ? allSources() : sources, includeCheck)
    const promise = (async () => {
      if (cfg.providerKind === 'offline' || plan.source === 'offline') return fallback()
      try {
        const lastSaid = st.scripts[index - 1]?.lines.at(-1)?.text ?? ''
        const raw = await complete(cfg.providerKind, {
          system: TUTOR_SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: buildSectionPrompt({ plan, index, mode: cfg.mode, style: cfg.style, includeCheck, sources, lastSaid }),
            },
          ],
          maxTokens: 800,
        })
        return normalizeScript(parseJsonObject(raw), cfg.style, includeCheck, plan.sections[index].title)
      } catch {
        st.notice = 'The AI tutor was unavailable for a section, so it was read from your notes instead.'
        return fallback()
      }
    })()
    scriptPromises.current.set(index, promise)
    return promise
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const finish = useCallback(
    async (endedEarly: boolean) => {
      const st = s.current
      const cfg = st.config
      if (!cfg || !st.plan || st.finished) return
      runRef.current++
      speechRef.current.stop()
      const askedCounts = new Map<string, number>()
      for (const q of st.questions) askedCounts.set(q.concept.toLowerCase(), (askedCounts.get(q.concept.toLowerCase()) ?? 0) + 1)
      const weak = [
        ...st.checks.filter((c) => c.verdict !== 'correct').map((c) => c.concept),
        ...st.questions.filter((q) => (askedCounts.get(q.concept.toLowerCase()) ?? 0) >= 2).map((q) => q.concept),
      ]
      const weakConcepts = [...new Map(weak.filter(Boolean).map((c) => [c.toLowerCase(), c])).values()]
      const llm = getStreamlitLlm()
      const session: StudySession = {
        id: `study-${Date.now()}`,
        date: new Date(st.startedAt).toISOString(),
        topicId: cfg.topic.id,
        topicLabel: cfg.focus ? `Focus: ${cfg.focus}` : cfg.topic.label,
        mode: cfg.mode,
        kind: cfg.kind,
        interactivity: cfg.interactivity,
        style: cfg.style,
        focus: cfg.focus,
        durationSec: Math.round((Date.now() - st.startedAt) / 1000),
        endedEarly,
        provider:
          st.plan.source === 'offline'
            ? PROVIDER_LABELS.offline
            : cfg.providerKind === 'server' && llm.model
              ? `${llm.model} (via Streamlit server)`
              : PROVIDER_LABELS[cfg.providerKind],
        sectionTitles: st.plan.sections.map((sec) => sec.title),
        sectionsCovered: [...st.covered].sort((a, b) => a - b),
        questions: st.questions,
        checks: st.checks,
        interruptions: st.interruptions,
        weakConcepts,
        sourceIds: [...new Set(st.plan.sections.flatMap((sec) => sec.sourceIds))],
      }
      progressRef.current.addStudySession(session)
      st.finished = session
      st.pending = null
      st.status = 'finished'
      render()
      if (!endedEarly) await say({ speaker: mainSpeaker(), text: "That's the end of this session. Your summary is on screen." })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [render, say],
  )

  const playFrom = useCallback(
    async (start: LessonCursor) => {
      const token = ++runRef.current
      const st = s.current
      const plan = st.plan
      const cfg = st.config
      if (!plan || !cfg) return
      st.pending = null
      let { section, line } = start
      while (section < plan.sections.length) {
        st.cursor = { section, line }
        st.inSection = true
        st.status = 'generating'
        render()
        const script = await loadScript(section)
        if (token !== runRef.current) return
        st.scripts[section] = script
        if (section + 1 < plan.sections.length) void loadScript(section + 1) // prefetch while speaking
        for (; line < script.lines.length; line++) {
          st.cursor = { section, line }
          st.lastLine = { section, line }
          st.status = 'speaking'
          render()
          if (!(await say(script.lines[line]))) return
        }
        if (!st.covered.includes(section)) st.covered.push(section)
        st.inSection = false
        st.cursor = { section: section + 1, line: 0 }
        if (script.check) {
          st.pending = { type: 'check', question: script.check, section }
          st.status = 'awaiting-check'
          await say({ speaker: script.lines[0]?.speaker === 'host' ? 'host' : mainSpeaker(), text: `Quick check: ${script.check}` })
          return
        }
        if (shouldCheckpoint(cfg.interactivity, section, plan.sections.length)) {
          st.pending = { type: 'continue', reason: 'checkpoint' }
          st.status = 'awaiting-continue'
          await say({ speaker: mainSpeaker(), text: 'Before we move on, does that make sense?' })
          return
        }
        section += 1
        line = 0
      }
      if (token === runRef.current) await finish(false)
    },
    [finish, loadScript, render, say],
  )

  const start = useCallback(
    async (config: StartConfig) => {
      const token = ++runRef.current
      speechRef.current.stop()
      scriptPromises.current.clear()
      const st = initialState()
      st.config = config
      st.status = 'planning'
      st.startedAt = Date.now()
      s.current = st
      render()
      const title = config.focus ? config.focus : config.topic.label
      let plan: LessonPlan
      if (config.providerKind === 'offline' || config.sources.length === 0) {
        plan = offlinePlan(title, config.sources)
      } else {
        try {
          const raw = await complete(config.providerKind, {
            system: TUTOR_SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: buildPlanPrompt({
                  topicLabel: config.topic.label,
                  mode: config.mode,
                  focus: config.focus,
                  revision: config.kind === 'revision',
                  sources: config.sources,
                  difficultIds: difficultIds(),
                }),
              },
            ],
            maxTokens: 1000,
          })
          plan = normalizePlan(parseJsonObject(raw), config.sources, title)
        } catch {
          st.notice = 'The AI tutor is unavailable right now, so this session reads your study notes instead.'
          plan = offlinePlan(title, config.sources)
        }
      }
      if (token !== runRef.current) return
      st.plan = plan
      void playFrom({ section: 0, line: 0 })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playFrom, render],
  )

  /** Stops the tutor so the user can speak or type. Keeps any open question. */
  const interrupt = useCallback(() => {
    const st = s.current
    if (!st.config || st.status === 'finished' || st.status === 'idle') return
    runRef.current++
    speechRef.current.stop()
    st.nowSpeaking = null
    if (st.status === 'speaking' || st.status === 'generating' || st.status === 'answering') st.interruptions += 1
    if (!st.pending || st.pending.type === 'continue') st.status = 'listening'
    render()
  }, [render])

  const continueLesson = useCallback(async () => {
    const st = s.current
    if (!st.plan) return
    const token = ++runRef.current
    speechRef.current.stop()
    st.pending = null
    if (st.askedSinceResume) {
      st.askedSinceResume = false
      const current = st.plan.sections[st.cursor.section]
      if (current) {
        st.status = 'speaking'
        // Offline plans use question titles ("What are embeddings"), AI plans use topic titles ("Embeddings").
        const isQuestion = /^(what|how|why|when|which|who|is|are|can|do|does|should|explain|tell|describe)\b/i.test(current.title)
        const topic = isQuestion ? `the question "${current.title}"` : current.title
        const text = st.inSection
          ? `That answers your question. We were ${isQuestion ? 'on' : 'discussing'} ${topic}. Let's continue from there.`
          : `Okay, let's move on to ${topic}.`
        if (!(await say({ speaker: mainSpeaker(), text }))) return
        if (token !== runRef.current) return
      }
    }
    void playFrom(st.cursor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playFrom, say])

  const ask = useCallback(
    async (request: string, kind: AskKind) => {
      const st = s.current
      const cfg = st.config
      if (!cfg || !st.plan) return
      const token = ++runRef.current
      speechRef.current.stop()
      addUserEntry(request)
      st.pending = null
      st.status = 'thinking'
      render()
      const index = activeSection()
      const section = st.plan.sections[index]
      const concept = st.scripts[index]?.concept ?? section?.title ?? cfg.topic.label
      const sources = sectionSources(index).length ? sectionSources(index) : allSources()
      const currentText = st.lastLine ? (st.scripts[st.lastLine.section]?.lines[st.lastLine.line]?.text ?? '') : ''

      let answer = ''
      let answerConcept = concept
      let fromMaterial = true
      const offlineAnswer = () => {
        const best = bestMatchingSource(`${request} ${concept}`, allSources())
        if (kind === 'question' && best) {
          answerConcept = best.text
          return `Offline mode can't answer free-form questions, but this is the closest part of your notes. ${best.text} ${firstSentences(best.modelAnswer || best.projectContext || '', 3)}`
        }
        return "Offline mode can't generate new explanations. Connect an AI provider for simpler explanations, deeper dives and examples."
      }
      if (cfg.providerKind === 'offline' || st.plan.source === 'offline') {
        answer = offlineAnswer()
      } else {
        try {
          const raw = await complete(cfg.providerKind, {
            system: TUTOR_SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: buildAskPrompt({ planTitle: st.plan.title, section, concept, currentText, history: st.transcript, sources, kind, request }),
              },
            ],
            maxTokens: 550,
          })
          const parsed = parseJsonObject<{ answer?: unknown; concept?: unknown; fromMaterial?: unknown }>(raw)
          if (typeof parsed.answer !== 'string' || !parsed.answer.trim()) throw new Error('empty answer')
          answer = parsed.answer.trim()
          if (typeof parsed.concept === 'string' && parsed.concept.trim()) answerConcept = parsed.concept.trim()
          fromMaterial = parsed.fromMaterial !== false
        } catch {
          st.notice = 'The AI tutor could not answer just now, so the answer comes from your notes.'
          answer = offlineAnswer()
        }
      }
      if (token !== runRef.current) return
      st.questions = [...st.questions, { kind, question: request, answer, concept: answerConcept, section: section?.title ?? '', fromMaterial }]
      st.askedSinceResume = true
      st.status = 'answering'
      if (!(await say({ speaker: mainSpeaker(), text: answer }, { generalKnowledge: !fromMaterial }))) return
      st.pending = { type: 'continue', reason: 'answer' }
      st.status = 'awaiting-continue'
      await say({ speaker: mainSpeaker(), text: 'Would you like me to explain that further, or shall we continue?' })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [render, say],
  )

  const evaluate = useCallback(
    async (pending: Exclude<Pending, null | { type: 'continue' }>, answerText: string) => {
      const st = s.current
      const cfg = st.config
      if (!cfg || !st.plan) return
      const token = ++runRef.current
      speechRef.current.stop()
      addUserEntry(answerText)
      st.status = 'thinking'
      render()
      const quiz = pending.type === 'quiz'
      const sources = quiz ? [pending.source] : sectionSources(pending.section)
      let verdict: CheckRecord['verdict'] = 'partly'
      let feedback = ''
      let concept = quiz ? pending.source.text : (st.scripts[pending.section]?.concept ?? '')
      const offline = () => {
        const reference = sources[0]
        const e = heuristicEvaluate(reference, answerText)
        verdict = e.quality === 'strong' ? 'correct' : e.quality === 'partial' ? 'partly' : 'incorrect'
        const key = reference?.keyPoints[0] ?? firstSentences(reference?.modelAnswer ?? '', 1)
        feedback = `${verdict === 'correct' ? 'That covers the main idea.' : verdict === 'partly' ? "That's partly there." : "That's not quite it."} ${key ? `The key idea: ${key}` : ''}`.trim()
      }
      if (cfg.providerKind === 'offline' || st.plan.source === 'offline') offline()
      else {
        try {
          const raw = await complete(cfg.providerKind, {
            system: TUTOR_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: buildCheckPrompt(pending.question, answerText, sources, quiz) }],
            maxTokens: 400,
          })
          const parsed = parseJsonObject<{ verdict?: unknown; feedback?: unknown; concept?: unknown }>(raw)
          verdict = normalizeVerdict(parsed.verdict)
          if (typeof parsed.feedback !== 'string' || !parsed.feedback.trim()) throw new Error('no feedback')
          feedback = parsed.feedback.trim()
          if (typeof parsed.concept === 'string' && parsed.concept.trim()) concept = parsed.concept.trim()
        } catch {
          offline()
        }
      }
      if (token !== runRef.current) return
      st.checks = [...st.checks, { kind: quiz ? 'quiz' : 'check', question: pending.question, answer: answerText, verdict, feedback, concept }]
      st.pending = null
      st.status = 'answering'
      if (!(await say({ speaker: mainSpeaker(), text: feedback }))) return
      if (quiz) {
        st.pending = { type: 'continue', reason: 'quiz' }
        st.status = 'awaiting-continue'
        await say({ speaker: mainSpeaker(), text: 'Want another question, or shall we get back to the lesson?' })
      } else {
        void playFrom(st.cursor)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playFrom, render, say],
  )

  const quiz = useCallback(async () => {
    const st = s.current
    if (!st.config || !st.plan) return
    runRef.current++
    speechRef.current.stop()
    const difficult = difficultIds()
    const candidates = allSources().filter((q) => !st.quizzedIds.includes(q.sourceId) && q.modelAnswer)
    const next = candidates.find((q) => difficult.has(q.sourceId)) ?? candidates[Math.floor(Math.random() * candidates.length)]
    if (!next) {
      st.pending = { type: 'continue', reason: 'quiz' }
      st.status = 'awaiting-continue'
      await say({ speaker: mainSpeaker(), text: "We've used every quiz question for this lesson. Shall we continue?" })
      return
    }
    st.quizzedIds = [...st.quizzedIds, next.sourceId]
    st.pending = { type: 'quiz', question: next.text, source: next }
    st.status = 'quiz'
    await say({ speaker: mainSpeaker(), text: `Quiz time. ${next.text}` })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [say])

  const stop = useCallback(() => {
    const st = s.current
    if (!st.config || st.status === 'finished') return
    runRef.current++
    speechRef.current.stop()
    st.nowSpeaking = null
    st.status = 'stopped'
    render()
  }, [render])

  const pause = useCallback(() => {
    const st = s.current
    if (st.status === 'paused' || st.status === 'finished' || !st.config) return
    if (st.nowSpeaking) {
      speechRef.current.pause()
      st.statusBeforePause = st.status
      st.status = 'paused'
      render()
    } else {
      stop()
    }
  }, [render, stop])

  /** Play: resumes paused speech, or continues from the lesson cursor. */
  const play = useCallback(() => {
    const st = s.current
    if (!st.config || st.status === 'finished') return
    if (st.status === 'paused') {
      speechRef.current.resume()
      st.status = st.statusBeforePause
      render()
      return
    }
    if (st.pending?.type === 'check' || st.pending?.type === 'quiz' || st.pending?.type === 'continue') {
      void continueLesson()
      return
    }
    void playFrom(st.cursor)
  }, [continueLesson, playFrom, render])

  const replay = useCallback(() => {
    const st = s.current
    if (!st.config || !st.plan) return
    void playFrom(st.lastLine ?? st.cursor)
  }, [playFrom])

  const skip = useCallback(() => {
    const st = s.current
    if (!st.config || !st.plan) return
    const next = st.inSection ? st.cursor.section + 1 : st.cursor.section
    if (next >= st.plan.sections.length) void finish(false)
    else void playFrom({ section: next, line: 0 })
  }, [finish, playFrom])

  const end = useCallback(() => void finish(true), [finish])

  /** Handles anything the user said or typed: commands, answers or questions. */
  const submit = useCallback(
    (raw: string) => {
      const text = raw.trim()
      const st = s.current
      if (!text || !st.config || st.status === 'finished') return
      const cmd = parseCommand(text)
      if (cmd === 'stop') return stop()
      if (cmd === 'pause') return pause()
      if (cmd === 'wait') return interrupt()
      if (cmd === 'repeat') return replay()
      if (cmd === 'skip') return skip()
      if (cmd === 'quiz') return void quiz()
      if (cmd === 'simpler' || cmd === 'deeper' || cmd === 'example') {
        const concept = st.scripts[activeSection()]?.concept ?? st.config.topic.label
        const request = { simpler: `Explain ${concept} simply.`, deeper: `Go deeper into ${concept}.`, example: `Give me an example of ${concept}.` }[cmd]
        return void ask(text.split(' ').length <= 3 ? request : text, cmd)
      }
      const pending = st.pending
      if (pending?.type === 'check' || pending?.type === 'quiz') {
        if (cmd === 'continue') return void continueLesson()
        return void evaluate(pending, text)
      }
      if (cmd === 'continue') return void continueLesson()
      if (cmd === 'no') return void ask("I don't understand. Please explain that again more simply.", 'simpler')
      void ask(text, 'question')
    },
    [ask, continueLesson, evaluate, interrupt, pause, quiz, replay, skip, stop],
  )

  const quickAsk = useCallback(
    (kind: Exclude<AskKind, 'question'>) => {
      const st = s.current
      if (!st.config) return
      const concept = st.scripts[activeSection()]?.concept ?? st.config.topic.label
      const request = { simpler: `Explain ${concept} simply.`, deeper: `Go deeper into ${concept}.`, example: `Give me an example of ${concept}.` }[kind]
      void ask(request, kind)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ask],
  )

  const reset = useCallback(() => {
    runRef.current++
    speechRef.current.stop()
    scriptPromises.current.clear()
    s.current = initialState()
    render()
  }, [render])

  const st = s.current
  const total = st.plan?.sections.length ?? 0
  return {
    status: st.status,
    config: st.config,
    plan: st.plan,
    cursor: st.cursor,
    activeSection: st.plan ? Math.min(activeSection(), total - 1) : 0,
    covered: st.covered,
    progressPercent: total ? Math.round((st.covered.length / total) * 100) : 0,
    concept: st.plan ? (st.scripts[Math.min(activeSection(), total - 1)]?.concept ?? st.plan.sections[Math.min(activeSection(), total - 1)]?.title) : '',
    pending: st.pending,
    transcript: st.transcript,
    nowSpeaking: st.nowSpeaking,
    notice: st.notice,
    questions: st.questions,
    checks: st.checks,
    finished: st.finished,
    start,
    play,
    pause,
    stop,
    replay,
    skip,
    interrupt,
    submit,
    quickAsk,
    quiz,
    continueLesson,
    end,
    reset,
  }
}

export type UseStudyTutorReturn = ReturnType<typeof useStudyTutor>

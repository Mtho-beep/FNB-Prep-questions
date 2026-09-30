import { useCallback, useMemo, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Headphones } from 'lucide-react'
import type { UseProgressReturn } from '../hooks/useProgress'
import type { Speaker } from '../types/study'
import { useVoiceSettings } from '../hooks/useVoiceSettings'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useTextToSpeech, type SpeakOverrides } from '../hooks/useTextToSpeech'
import { useStudyTutor, type StartConfig, type TutorSpeech } from '../hooks/useStudyTutor'
import { REVISION_TOPIC, focusSources, revisionSources, selectSources, topicPool, type StudyTopic } from '../services/studyTopics'
import { StudySetup, type SetupChoice } from '../components/study/StudySetup'
import { StudyPlayer } from '../components/study/StudyPlayer'
import { StudySummary } from '../components/study/StudySummary'

interface StudyPodcastPageProps {
  progress: UseProgressReturn
}

/**
 * Without text-to-speech (unsupported, or voice mode off) the lesson is shown
 * as text and advances at reading pace instead of instantly.
 */
function useSilentReader(rate: number) {
  const timer = useRef<number | undefined>(undefined)
  const release = useRef<(() => void) | null>(null)
  const stop = useCallback(() => {
    window.clearTimeout(timer.current)
    release.current?.()
    release.current = null
  }, [])
  const speak = useCallback(
    (text: string) => {
      stop()
      return new Promise<void>((resolve) => {
        release.current = resolve
        const words = text.split(/\s+/).length
        timer.current = window.setTimeout(() => {
          release.current = null
          resolve()
        }, Math.max(1500, (words * 260) / rate))
      })
    },
    [rate, stop],
  )
  return { speak, stop }
}

export function StudyPodcastPage({ progress }: StudyPodcastPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const requestedFocus = (location.state as { focus?: string } | null)?.focus
  const { settings, update } = useVoiceSettings()
  const recognition = useSpeechRecognition(settings.lang)
  const tts = useTextToSpeech({ voiceURI: settings.voiceURI, rate: settings.rate, pitch: settings.pitch, volume: settings.volume })
  const reader = useSilentReader(settings.rate)
  const useVoice = tts.supported && settings.voiceMode

  const voiceFor = useCallback(
    (speaker: Speaker): SpeakOverrides => {
      if (speaker !== 'expert') return {}
      const other = tts.voices.find((v) => v.voiceURI !== tts.selectedVoice?.voiceURI && v.lang.toLowerCase().startsWith('en'))
      return other ? { voice: other } : { pitch: 0.8 }
    },
    [tts.voices, tts.selectedVoice],
  )

  const speech: TutorSpeech = useMemo(
    () =>
      useVoice
        ? { speak: tts.speak, stop: tts.stop, pause: tts.pause, resume: tts.resume, voiceFor }
        : { speak: reader.speak, stop: reader.stop, pause: reader.stop, resume: () => {}, voiceFor },
    [useVoice, tts.speak, tts.stop, tts.pause, tts.resume, reader.speak, reader.stop, voiceFor],
  )

  const tutor = useStudyTutor(progress, speech)

  const difficultIds = useMemo(
    () =>
      new Set(
        Object.entries(progress.state.questions)
          .filter(([, p]) => p.difficult)
          .map(([id]) => id),
      ),
    [progress.state.questions],
  )

  function handleStart(choice: SetupChoice) {
    const history = progress.studySessionHistory
    let topic: StudyTopic
    let sources
    if (choice.kind === 'revision') {
      topic = REVISION_TOPIC
      sources = revisionSources(difficultIds, history)
    } else if (choice.kind === 'focus' && choice.focus) {
      topic = { ...REVISION_TOPIC, id: `focus:${choice.focus.toLowerCase()}`, label: choice.focus, interviewMode: 'technical' }
      sources = focusSources(choice.focus, difficultIds)
    } else {
      topic = choice.topic!
      sources = selectSources(topicPool(topic), { mode: choice.mode, difficultIds })
    }
    const config: StartConfig = {
      topic,
      mode: choice.mode,
      kind: choice.kind,
      interactivity: choice.interactivity,
      style: choice.style,
      focus: choice.kind === 'focus' ? choice.focus : undefined,
      providerKind: choice.provider,
      sources,
    }
    tts.stop()
    void tutor.start(config)
  }

  function startFocus(concept: string) {
    tutor.reset()
    handleStart({ kind: 'focus', focus: concept, mode: 'teach', interactivity: 'balanced', style: 'solo', provider: tutor.config?.providerKind ?? 'offline' })
  }

  function interviewMe() {
    const mode = tutor.config?.topic.interviewMode ?? 'technical'
    tutor.end()
    navigate('/voice-interview', { state: { mode } })
  }

  const active = tutor.status !== 'idle'

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-navy-900">
            <Headphones size={20} className="text-brand-500" /> AI Study Podcast
          </h1>
          <p className="text-sm text-slate-500">An AI tutor teaches your study material out loud. Interrupt any time to ask a question — it picks up where it left off.</p>
        </div>
        <div className="flex gap-2">
          {active && tutor.status !== 'finished' && (
            <button
              type="button"
              onClick={() => tutor.end()}
              className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft size={15} /> Finish & summary
            </button>
          )}
          <Link
            to="/study-sessions"
            className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <BookOpen size={15} /> My Study Sessions
          </Link>
        </div>
      </div>

      {tutor.status === 'finished' && tutor.finished ? (
        <div className="space-y-4">
          <StudySummary session={tutor.finished} onStartFocus={startFocus} />
          <button
            type="button"
            onClick={tutor.reset}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-3 text-sm font-semibold text-white hover:bg-navy-800"
          >
            <Headphones size={16} /> Start another session
          </button>
        </div>
      ) : active ? (
        <StudyPlayer tutor={tutor} recognition={recognition} tts={tts} settings={settings} updateSettings={update} onInterviewMe={interviewMe} />
      ) : (
        <StudySetup
          settings={settings}
          updateSettings={update}
          history={progress.studySessionHistory}
          difficultIds={difficultIds}
          requestedFocus={requestedFocus}
          onStart={handleStart}
        />
      )}
    </div>
  )
}

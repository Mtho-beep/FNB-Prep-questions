import { Link } from 'react-router-dom'
import { History, Loader2, Mic, RotateCcw } from 'lucide-react'
import type { UseProgressReturn } from '../hooks/useProgress'
import type { InterviewDifficulty, InterviewMode } from '../types/interview'
import type { ProviderKind } from '../services/aiProvider'
import { useVoiceInterview } from '../hooks/useVoiceInterview'
import { useVoiceSettings } from '../hooks/useVoiceSettings'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useTextToSpeech } from '../hooks/useTextToSpeech'
import { VoiceInterviewSetup } from '../components/voice/VoiceInterviewSetup'
import { VoiceInterviewRoom } from '../components/voice/VoiceInterviewRoom'
import { InterviewReportView } from '../components/voice/InterviewReportView'

interface VoiceInterviewPageProps {
  progress: UseProgressReturn
}

export function VoiceInterviewPage({ progress }: VoiceInterviewPageProps) {
  const { settings, update } = useVoiceSettings()
  const engine = useVoiceInterview(progress)
  const recognition = useSpeechRecognition(settings.lang)
  const tts = useTextToSpeech({ voiceURI: settings.voiceURI, rate: settings.rate, pitch: settings.pitch })

  function handleStart(mode: InterviewMode, difficulty: InterviewDifficulty, provider: ProviderKind) {
    tts.stop()
    engine.start({ mode, difficulty, providerKind: provider, voiceUsed: settings.voiceMode && recognition.supported })
  }

  const inInterview = engine.session && (engine.status === 'asking' || engine.status === 'processing')

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-navy-900">
            <Mic size={20} className="text-brand-500" /> AI Voice Mock Interview
          </h1>
          <p className="text-sm text-slate-500">Talk to an AI interviewer that asks follow-ups based on what you say. Feedback comes at the end.</p>
        </div>
        <Link
          to="/interview-history"
          className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <History size={16} /> Interview History
        </Link>
      </div>

      {inInterview ? (
        <VoiceInterviewRoom engine={engine} settings={settings} recognition={recognition} tts={tts} />
      ) : engine.status === 'evaluating' ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Loader2 size={28} className="mx-auto mb-3 animate-spin text-brand-500" />
          <p className="font-semibold text-navy-900">Preparing your interview report…</p>
        </div>
      ) : engine.status === 'finished' && engine.completed ? (
        <div className="space-y-5">
          {engine.notice && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{engine.notice}</p>}
          <InterviewReportView session={engine.completed} />
          <button
            type="button"
            onClick={engine.reset}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-3 text-sm font-semibold text-white hover:bg-navy-800"
          >
            <RotateCcw size={16} /> Start Another Interview
          </button>
        </div>
      ) : (
        <>
          {engine.status === 'error' && engine.notice && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{engine.notice}</p>
          )}
          <VoiceInterviewSetup
            settings={settings}
            updateSettings={update}
            tts={tts}
            recognitionSupported={recognition.supported}
            engine={engine}
            onStart={handleStart}
          />
        </>
      )}
    </div>
  )
}

import type { UseProgressReturn } from '../hooks/useProgress'
import { MockInterview } from '../components/MockInterview'

interface MockInterviewPageProps {
  progress: UseProgressReturn
}

export function MockInterviewPage({ progress }: MockInterviewPageProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Mock Interview</h1>
        <p className="text-sm text-slate-500">The app plays interviewer — one question at a time, model answer hidden until you're ready.</p>
      </div>
      <MockInterview progress={progress} />
    </div>
  )
}

import { useState } from 'react'
import { BrowserRouter, MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Menu, RotateCcw } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { Practice } from './pages/Practice'
import { MockInterviewPage } from './pages/MockInterviewPage'
import { Coderbyte } from './pages/Coderbyte'
import { RapidFire } from './pages/RapidFire'
import { useProgress } from './hooks/useProgress'

function pageTitleFor(pathname: string): string {
  if (pathname === '/') return 'Dashboard'
  if (pathname.startsWith('/coderbyte')) return 'Coderbyte Technical Assessment'
  if (pathname.startsWith('/rapid-fire')) return 'Rapid Fire'
  if (pathname.startsWith('/mock-interview')) return 'Mock Interview'
  if (pathname.startsWith('/practice')) return 'Practice'
  return 'AI Interview Prep'
}

function ResetProgressButton({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5">
        <span className="text-xs font-medium text-rose-700">Reset all progress?</span>
        <button
          type="button"
          onClick={() => {
            onReset()
            setConfirming(false)
          }}
          className="focus-ring rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700"
        >
          Yes, reset
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-white"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
      title="Reset all progress"
    >
      <RotateCcw size={14} />
      Reset Progress
    </button>
  )
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const progress = useProgress()
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="focus-ring rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-navy-900 sm:text-base">{pageTitleFor(location.pathname)}</h1>
          </div>
          <ResetProgressButton onReset={progress.resetProgress} />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Routes>
              <Route path="/" element={<Dashboard progress={progress} />} />
              <Route path="/practice/:mode" element={<Practice progress={progress} />} />
              <Route path="/mock-interview" element={<MockInterviewPage progress={progress} />} />
              <Route path="/coderbyte" element={<Coderbyte />} />
              <Route path="/rapid-fire" element={<RapidFire />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

// Inside Streamlit the app runs in an `about:srcdoc` iframe, which has no real URL
// for BrowserRouter/HashRouter to work with, so routes are kept in memory there.
const Router = window.location.protocol === 'about:' ? MemoryRouter : BrowserRouter

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}

export default App

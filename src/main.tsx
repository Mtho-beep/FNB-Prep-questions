import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { connectToStreamlit, isStreamlit } from './lib/streamlit'
import { setInitialRemoteProgress } from './hooks/useProgress'

const root = createRoot(document.getElementById('root')!)

function render() {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

if (isStreamlit) {
  // Wait for Streamlit to hand over the progress loaded from the database.
  connectToStreamlit().then((args) => {
    setInitialRemoteProgress(args.progress)
    render()
  })
} else {
  render()
}

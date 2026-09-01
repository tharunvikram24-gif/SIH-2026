import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { start } from './lib/mockEngine'

start() // begin telemetry + network sparkline loops

// keyboard shortcuts: Space = run/pause, R = reset, F = fullscreen
import { useSystem } from './store/useSystem'
import { runMission, togglePause, reset } from './lib/mockEngine'
window.addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement)?.tagName === 'INPUT') return
  if (e.code === 'Space') { e.preventDefault(); const s = useSystem.getState(); if (!s.running) runMission(); else togglePause() }
  if (e.key === 'r' || e.key === 'R') reset()
  if (e.key === 'f' || e.key === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.() }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

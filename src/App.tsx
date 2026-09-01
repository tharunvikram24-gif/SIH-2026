import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Toasts } from './components/Toasts'
import MissionControl from './pages/MissionControl'
import AgentRuns from './pages/AgentRuns'
import ModelRouter from './pages/ModelRouter'
import Sovereignty from './pages/Sovereignty'
import Sandbox from './pages/Sandbox'
import Knowledge from './pages/Knowledge'
import AuditLog from './pages/AuditLog'
import Artefacts from './pages/Artefacts'
import Settings from './pages/Settings'

export default function App() {
  return (
    <div className="grid-bg flex min-h-screen relative z-[1]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-5">
          <Routes>
            <Route path="/" element={<MissionControl />} />
            <Route path="/runs" element={<AgentRuns />} />
            <Route path="/router" element={<ModelRouter />} />
            <Route path="/sovereignty" element={<Sovereignty />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/artefacts" element={<Artefacts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <Toasts />
    </div>
  )
}

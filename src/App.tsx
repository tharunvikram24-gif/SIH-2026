import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store'
import { Sidebar } from './components/Sidebar'
import { TopHeader } from './components/TopHeader'
import { UploadModal } from './components/UploadModal'
import ChatPage from './pages/ChatPage'
import DocumentsPage from './pages/DocumentsPage'
import WorkflowsPage from './pages/WorkflowsPage'
import AgentActivityPage from './pages/AgentActivityPage'
import AuditLogPage from './pages/AuditLogPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const { pathname } = useLocation()
  const setRoute = useStore((s) => s.setRoute)
  useEffect(() => { setRoute(pathname) }, [pathname, setRoute])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopHeader route={pathname} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/activity" element={<AgentActivityPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      <UploadModal />
    </div>
  )
}

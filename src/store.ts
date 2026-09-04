import { create } from 'zustand'
import type { Msg, Step, Doc, AuditRow, TaskType } from './types'

let id = 1
export const nid = () => id++

// --- theme (persisted, applied to <html data-theme> so CSS vars re-theme everything) ---
type Theme = 'light' | 'dark'
const THEME_KEY = 'mrpl-theme'
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
const applyTheme = (t: Theme) => {
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', t)
}
const initialTheme = getInitialTheme()
applyTheme(initialTheme)

const baseSteps = (): Step[] => [
  { key: 'router', label: 'Task Router', sub: 'Classify incoming task', status: 'pending' },
  { key: 'agent', label: 'Selected Agent', sub: 'Assign specialist agent', status: 'pending' },
  { key: 'rag', label: 'Local RAG', sub: 'Retrieve from knowledge base', status: 'pending' },
  { key: 'ocr', label: 'OCR / Vision', sub: 'Read scans & diagrams', status: 'pending' },
  { key: 'tool', label: 'Tool Execution', sub: 'Run sandboxed tools', status: 'pending' },
  { key: 'final', label: 'Final Response', sub: 'Compose grounded answer', status: 'pending' },
]

const seedDocs: Doc[] = [
  { name: 'inspection_report.pdf', type: 'PDF', meta: '24 pages', indexed: true, updated: '2m ago' },
  { name: 'maintenance_log.csv', type: 'CSV', meta: '1.8 MB', indexed: true, updated: '5m ago' },
  { name: 'PID_CDU2.png', type: 'PNG', meta: '3.2 MB', indexed: true, updated: '12m ago' },
  { name: 'MRPL_STD_14.docx', type: 'DOCX', meta: '18 pages', indexed: true, updated: '1h ago' },
]
const seedAudit: AuditRow[] = [
  { id: nid(), time: '22:04:11', action: 'Document uploaded', component: 'RAG Engine', status: 'SUCCESS' },
  { id: nid(), time: '22:04:12', action: 'Index rebuilt (4 docs)', component: 'RAG Engine', status: 'SUCCESS' },
  { id: nid(), time: '22:04:40', action: 'Sandbox warm-start', component: 'Sandbox', status: 'READY' },
]

export interface Conversation { id: number; title: string; ts: number; messages: Msg[] }
const convTitle = (msgs: Msg[]) => {
  const u = msgs.find((m) => m.role === 'user')
  if (!u) return 'New conversation'
  const t = u.text.trim()
  return t.length > 34 ? t.slice(0, 34) + '…' : t
}

const seedUser = {
  name: 'R. Nayak', initials: 'RN', role: 'Reliability Engineer · NDT Level II',
  email: 'r.nayak@mrpl.co.in', org: 'Mangalore Refinery & Petrochemicals Ltd',
  workspace: 'Smart Automation', plan: 'On-Prem Enterprise', memberSince: 'Jan 2024',
}

export interface Store {
  route: string
  messages: Msg[]
  running: boolean
  steps: Step[]
  router: { task: string; model: string; status: string; active: boolean }
  net: { external: number; internal: number; dataKB: number }
  docs: Doc[]
  audit: AuditRow[]
  agentMode: boolean
  attachments: string[]
  uploadOpen: boolean
  sidebarOpen: boolean
  conversations: Conversation[]
  activeConvId: number
  user: typeof seedUser

  // task selector / processing state / theme — additive, do not affect existing flows
  theme: Theme
  selectedTask: TaskType | null
  processingStage: string | null
  processingError: string | null

  setRoute: (r: string) => void
  newConversation: () => void
  loadConversation: (id: number) => void
  saveCurrent: () => void
  addMessage: (m: Omit<Msg, 'id'>) => number
  patchMessage: (mid: number, p: Partial<Msg>) => void
  setRunning: (v: boolean) => void
  setSteps: (s: Step[]) => void
  patchStep: (key: string, status: Step['status']) => void
  setRouter: (r: Partial<Store['router']>) => void
  incNet: (internal?: number) => void
  resetNet: () => void
  addAudit: (action: string, component: string, status?: string) => void
  addDocs: (d: Doc[]) => void
  toggleAgentMode: () => void
  addAttachment: (n: string) => void
  removeAttachment: (n: string) => void
  setUploadOpen: (v: boolean) => void
  setSidebar: (v: boolean) => void

  setTheme: (t: Theme) => void
  toggleTheme: () => void
  setSelectedTask: (t: TaskType | null) => void
  setProcessingStage: (s: string | null) => void
  setProcessingError: (e: string | null) => void
}

const idleRouter = () => ({ task: '—', model: 'Local LLM 8B', status: 'idle', active: false })

export const useStore = create<Store>((set, get) => ({
  route: '/',
  messages: [],
  running: false,
  steps: baseSteps(),
  router: idleRouter(),
  net: { external: 0, internal: 24, dataKB: 0 },
  docs: seedDocs,
  audit: seedAudit,
  agentMode: true,
  attachments: [],
  uploadOpen: false,
  sidebarOpen: false,
  conversations: [],
  activeConvId: nid(),
  user: seedUser,

  theme: initialTheme,
  selectedTask: null,
  processingStage: null,
  processingError: null,

  setRoute: (r) => set({ route: r }),

  // snapshot the current chat into the (real, session) history list
  saveCurrent: () => set((s) => {
    if (!s.messages.length) return {} as any
    const snap: Conversation = { id: s.activeConvId, title: convTitle(s.messages), ts: Date.now(), messages: s.messages }
    const rest = s.conversations.filter((c) => c.id !== s.activeConvId)
    return { conversations: [snap, ...rest] }
  }),
  newConversation: () => { get().saveCurrent(); set({ messages: [], steps: baseSteps(), running: false, router: idleRouter(), attachments: [], activeConvId: nid() }) },
  loadConversation: (cid) => {
    get().saveCurrent()
    const c = get().conversations.find((x) => x.id === cid)
    if (c) set({ messages: [...c.messages], activeConvId: cid, running: false, steps: baseSteps(), router: idleRouter() })
  },

  addMessage: (m) => { const i = nid(); set((s) => ({ messages: [...s.messages, { ...m, id: i }] })); return i },
  patchMessage: (mid, p) => set((s) => ({ messages: s.messages.map((m) => (m.id === mid ? { ...m, ...p } : m)) })),
  setRunning: (v) => set({ running: v }),
  setSteps: (s) => set({ steps: s }),
  patchStep: (key, status) => set((s) => ({ steps: s.steps.map((st) => (st.key === key ? { ...st, status } : st)) })),
  setRouter: (r) => set((s) => ({ router: { ...s.router, ...r } })),
  incNet: (internal = 1) => set((s) => ({ net: { ...s.net, internal: s.net.internal + internal } })),
  resetNet: () => set((s) => ({ net: { ...s.net, external: 0, dataKB: 0 } })),
  addAudit: (action, component, status = 'SUCCESS') => set((s) => ({ audit: [{ id: nid(), time: new Date().toTimeString().slice(0, 8), action, component, status }, ...s.audit].slice(0, 60) })),
  addDocs: (d) => set((s) => ({ docs: [...d, ...s.docs] })),
  toggleAgentMode: () => set((s) => ({ agentMode: !s.agentMode })),
  addAttachment: (n) => set((s) => (s.attachments.includes(n) ? s : { attachments: [...s.attachments, n] })),
  removeAttachment: (n) => set((s) => ({ attachments: s.attachments.filter((x) => x !== n) })),
  setUploadOpen: (v) => set({ uploadOpen: v }),
  setSidebar: (v) => set({ sidebarOpen: v }),

  setTheme: (t) => { applyTheme(t); if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, t); set({ theme: t }) },
  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
  setSelectedTask: (t) => set({ selectedTask: t }),
  setProcessingStage: (s) => set({ processingStage: s }),
  setProcessingError: (e) => set({ processingError: e }),
}))

export { baseSteps }

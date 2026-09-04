import { create } from 'zustand'
import type {
  Step, EgressEvent, AuditRow, NetPoint, Cite, Toast, SandboxLine, RouteState,
} from '../types'
import { modelById } from '../data/models'

let idc = 1
const nid = () => idc++

export interface SystemStore {
  // run status
  running: boolean; paused: boolean; token: number; speed: number
  t0: number | null; tlState: string
  // counters / metrics
  ext: number; blocked: number; intl: number; auditCount: number; stepCount: number
  activeModel: string | null; vram: number; tps: number; gpu: number
  // collections
  steps: Step[]; egress: EgressEvent[]; audit: AuditRow[]; net: NetPoint[]
  rag: Cite[]; sandbox: SandboxLine[]; toasts: Toast[]
  route: RouteState
  fieldsHit: string[]; scanRead: boolean; artefactReady: boolean; showBanner: boolean

  // actions
  reset: () => void
  setRun: (p: Partial<Pick<SystemStore, 'running' | 'paused' | 'token' | 'speed' | 't0' | 'tlState'>>) => void
  setMetrics: (p: Partial<Pick<SystemStore, 'gpu' | 'tps' | 'vram' | 'activeModel'>>) => void
  pushStep: (title: string, tool?: string, detail?: string) => number
  updateStep: (id: number, p: Partial<Step>) => void
  pushEgress: (host: string, path: string, verdict: 'ALLOW' | 'DENY') => void
  pushAudit: (tool: string, modelId?: string) => void
  pushNet: (i: number, e: number) => void
  setRoute: (r: Partial<RouteState>) => void
  setActiveModel: (id: string | null, vram?: number) => void
  setRag: (c: Cite[]) => void
  setSandbox: (l: SandboxLine[]) => void
  hitField: (f: string) => void
  setScanRead: (v: boolean) => void
  setArtefact: (v: boolean) => void
  setBanner: (v: boolean) => void
  addToast: (t: Omit<Toast, 'id'>) => void
  removeToast: (id: number) => void
}

const initial = () => ({
  running: false, paused: false, speed: 1, t0: null as number | null, tlState: 'idle',
  ext: 0, blocked: 0, intl: 0, auditCount: 0, stepCount: 0,
  activeModel: null as string | null, vram: 0, tps: 0, gpu: 0,
  steps: [] as Step[], egress: [] as EgressEvent[], audit: [] as AuditRow[], net: [] as NetPoint[],
  rag: [] as Cite[], sandbox: [{ t: '# sandbox idle - awaiting agent tool call', k: 'cm' as const }] as SandboxLine[],
  toasts: [] as Toast[],
  route: { task: '-', type: '-', model: null, reason: '', state: 'standby' } as RouteState,
  fieldsHit: [] as string[], scanRead: false, artefactReady: false, showBanner: false,
})

export const useSystem = create<SystemStore>((set, get) => ({
  token: 0,
  ...initial(),

  reset: () => set((s) => ({ token: s.token + 1, ...initial() })),
  setRun: (p) => set(p),
  setMetrics: (p) => set(p),

  pushStep: (title, tool, detail) => {
    const id = nid()
    set((s) => ({ steps: [...s.steps, { id, title, tool, detail: detail || '', status: 'run', dur: '', fresh: true }], stepCount: s.stepCount + 1 }))
    return id
  },
  updateStep: (id, p) => set((s) => ({ steps: s.steps.map((st) => (st.id === id ? { ...st, ...p, fresh: false } : st)) })),

  pushEgress: (host, path, verdict) => set((s) => {
    const row = { id: nid(), host, path, verdict }
    return {
      egress: [row, ...s.egress].slice(0, 60),
      intl: verdict === 'ALLOW' ? s.intl + 1 : s.intl,
      blocked: verdict === 'DENY' ? s.blocked + 1 : s.blocked,
    }
  }),

  pushAudit: (tool, modelId) => set((s) => {
    const h = '0123456789abcdef'; let hash = ''
    for (let i = 0; i < 6; i++) hash += h[Math.floor(Math.random() * 16)]
    const t = new Date().toTimeString().slice(0, 5)
    const model = modelId ? (modelById(modelId)?.name.split(' ')[0] || '-') : '-'
    return { audit: [{ id: nid(), t, tool, model, hash }, ...s.audit].slice(0, 80), auditCount: s.auditCount + 1 }
  }),

  pushNet: (i, e) => set((s) => ({ net: [...s.net, { i, e }].slice(-60) })),
  setRoute: (r) => set((s) => ({ route: { ...s.route, ...r } })),
  setActiveModel: (id, vram) => set(() => ({ activeModel: id, ...(vram != null ? { vram } : {}) })),
  setRag: (c) => set({ rag: c }),
  setSandbox: (l) => set({ sandbox: l }),
  hitField: (f) => set((s) => ({ fieldsHit: s.fieldsHit.includes(f) ? s.fieldsHit : [...s.fieldsHit, f] })),
  setScanRead: (v) => set({ scanRead: v }),
  setArtefact: (v) => set({ artefactReady: v }),
  setBanner: (v) => set({ showBanner: v }),
  addToast: (t) => { const id = nid(); set((s) => ({ toasts: [...s.toasts, { ...t, id }] })); setTimeout(() => get().removeToast(id), 4200) },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))

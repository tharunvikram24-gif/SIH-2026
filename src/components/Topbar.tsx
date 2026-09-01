import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSystem } from '../store/useSystem'
import { RunControls } from './RunControls'
import { now, hhmm } from '../lib/format'
import { ShieldCheck } from 'lucide-react'

const titles: Record<string, { t: string; s: string }> = {
  '/': { t: 'Mission Control', s: 'Live overview of the on-premise agent' },
  '/runs': { t: 'Agent Runs', s: 'Full step-by-step execution trace' },
  '/router': { t: 'Model Router', s: 'Task classification & model dispatch' },
  '/sandbox': { t: 'Sandbox', s: 'Isolated, no-network code execution' },
  '/knowledge': { t: 'Knowledge (RAG)', s: 'Local retrieval over your document index' },
  '/sovereignty': { t: 'Sovereignty', s: 'Egress policy & provable data control' },
  '/audit': { t: 'Audit Log', s: 'Signed, append-only record of every action' },
  '/artefacts': { t: 'Artefacts', s: 'Inputs and agent-produced deliverables' },
  '/settings': { t: 'Settings', s: 'Models, policy & backend wiring' },
}

export function Topbar() {
  const { pathname } = useLocation()
  const meta = titles[pathname] || titles['/']
  const [clock, setClock] = useState(now())
  const t0 = useSystem((s) => s.t0)
  const [up, setUp] = useState('00:00')
  useEffect(() => {
    const id = setInterval(() => {
      setClock(now())
      setUp(t0 ? hhmm(Math.floor((Date.now() - t0) / 1000)) : '00:00')
    }, 1000)
    return () => clearInterval(id)
  }, [t0])

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-5 h-[64px] border-b border-edge bg-bg/80 backdrop-blur">
      <div className="min-w-0">
        <h1 className="text-[17px] font-bold leading-tight tracking-tight">{meta.t}</h1>
        <div className="text-[11.5px] text-mut leading-tight">{meta.s}</div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:block font-mono text-[11px] text-mut text-right leading-tight">
          <div className="text-ink font-semibold text-[13px]">{clock}</div>
          <div>run {up}</div>
        </div>
        <RunControls />
        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-grn/40 bg-grn/10 px-3 py-2 shadow-[0_0_18px_-6px_rgba(79,208,138,.5)]">
          <ShieldCheck size={15} className="text-grn" />
          <span className="font-mono text-[11px] font-bold text-grn tracking-wide">0 EXTERNAL</span>
        </div>
      </div>
    </header>
  )
}

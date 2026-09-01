import { SandboxView } from '../components/SandboxView'
import { Panel } from '../components/Panel'
import { Chip } from '../components/Chip'
import { ShieldX } from 'lucide-react'
export default function Sandbox() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 items-start">
      <SandboxView />
      <Panel icon={<ShieldX size={15} className="text-amber" />} title="Why a sandbox">
        <p className="text-[13px] text-mut leading-relaxed">Agent-written code runs in a rootless <b className="text-ink">gVisor</b> container with a writable tmpfs, hard CPU/memory caps and a wall-clock timeout. Crucially it has <b className="text-ink">no network</b> — a check either passes on local data or it fails, so a verdict can never depend on an outside service.</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[['Isolation', 'gVisor · rootless'], ['CPU', '2 cores'], ['Memory', '2 GiB'], ['Timeout', '10 s'], ['Filesystem', '/work tmpfs'], ['Network', 'denied']].map(([k, v]) => (
            <div key={k} className="rounded-[9px] border border-edge bg-bg2 px-3 py-2"><div className="klbl">{k}</div><div className="font-mono text-[12px] mt-0.5">{v}</div></div>
          ))}
        </div>
        <div className="mt-3"><Chip tone="ok">deterministic</Chip> <span className="text-[12px] text-mut">results come from executed code, not model output.</span></div>
      </Panel>
    </div>
  )
}

import { useState } from 'react'
import { useStore } from '../store'
import { Card } from './ui'
import { Lock, Wifi, Cpu, HardDrive } from 'lucide-react'

// Header badge + click-to-expand status card. "External Calls" reads the real
// store counter (net.external, already tracked by the app for the Network
// Monitor panel) — Network/Processing/Storage describe the fixed on-prem
// deployment model, the same static fact already shown by the "ON-PREMISE" chip.
export function SovereigntyBadge() {
  const [open, setOpen] = useState(false)
  const net = useStore((s) => s.net)

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 chip text-tealb border-teal/40 bg-teal/10">
        <Lock size={12} /> LOCAL / AIR-GAPPED
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 card w-64 p-3.5 fadeup">
            <div className="klbl mb-2.5">Sovereignty Status</div>
            <div className="flex flex-col gap-2 text-[12.5px]">
              <Row icon={Wifi} k="Network" v="Blocked" tone="text-red" />
              <Row icon={Wifi} k="External Calls" v={String(net.external)} mono />
              <Row icon={Cpu} k="Processing" v="Local" tone="text-grn" />
              <Row icon={HardDrive} k="Storage" v="Local" tone="text-grn" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Row({ icon: Icon, k, v, tone, mono }: { icon: any; k: string; v: string; tone?: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-mut"><Icon size={13} className="text-faint" /> {k}</span>
      <span className={(mono ? 'font-mono ' : '') + 'font-medium ' + (tone || 'text-ink')}>{v}</span>
    </div>
  )
}

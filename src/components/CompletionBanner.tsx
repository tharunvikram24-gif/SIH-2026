import { useSystem } from '../store/useSystem'
import { CheckCircle2 } from 'lucide-react'
import { hhmm } from '../lib/format'

export function CompletionBanner() {
  const show = useSystem((s) => s.showBanner)
  const steps = useSystem((s) => s.stepCount)
  const t0 = useSystem((s) => s.t0)
  if (!show) return null
  const secs = t0 ? Math.max(1, Math.round((Date.now() - t0) / 1000)) : 0
  return (
    <div className="streamin rounded-xl border border-grn/40 bg-gradient-to-b from-grn/[.12] to-grn/[.03] overflow-hidden">
      <div className="flex items-center gap-3.5 px-4.5 py-4 px-5">
        <span className="grid place-items-center w-10 h-10 rounded-[11px] bg-grn/[.14] border border-grn/35 text-grn shrink-0"><CheckCircle2 size={22} /></span>
        <div>
          <h3 className="text-[16px] font-bold">Deliverable produced — end to end, unattended.</h3>
          <p className="font-mono text-[11.5px] text-mut mt-0.5">A scanned inspection report became a signed approval note without a human in the loop, and without a single packet leaving the box.</p>
        </div>
        <div className="ml-auto hidden sm:flex gap-6 text-right">
          <Stat n="0" l="external calls" c="text-grn" />
          <Stat n={String(steps)} l="agent steps" c="text-cyan" />
          <Stat n={secs + 's'} l="wall time" c="text-amber" />
        </div>
      </div>
    </div>
  )
}
function Stat({ n, l, c }: { n: string; l: string; c: string }) {
  return <div><div className={'font-mono font-extrabold text-[20px] ' + c}>{n}</div><div className="font-mono text-[9.5px] text-faint uppercase tracking-wide">{l}</div></div>
}

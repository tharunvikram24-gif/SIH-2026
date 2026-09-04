import { useSystem } from '../store/useSystem'
import { KpiCard } from './KpiCard'
import { modelById } from '../data/models'

export function KpiStrip() {
  const s = useSystem()
  const m = modelById(s.activeModel)
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <KpiCard label="External calls" tone={s.ext > 0 ? 'text-red' : 'text-grn'} value={s.ext} sub={`${s.blocked} blocked by policy`} />
      <KpiCard label="Internal calls" value={s.intl} sub="loopback only" />
      <KpiCard label="Active model" tone="text-cyan" value={<span className="text-[15px]">{m ? m.name : '—'}</span>} sub={m ? m.kind : 'idle'} />
      <KpiCard label="GPU · VRAM" tone="text-amber" value={<span className="text-[20px]">{s.vram.toFixed(1)}<span className="text-[12px] text-faint"> / 80 GB</span></span>} bar={(s.vram / 80) * 100} />
      <KpiCard label="Throughput" value={<span className="text-[20px]">{Math.round(s.tps)}<span className="text-[12px] text-faint"> tok/s</span></span>} sub={`GPU ${Math.round(s.gpu)}%`} />
      <KpiCard label="Audit events" tone="text-violet" value={<span className="text-[20px]">{s.auditCount}</span>} sub="signed · append-only" />
    </div>
  )
}

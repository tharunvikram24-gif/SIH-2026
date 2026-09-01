import { ReactNode } from 'react'
export function KpiCard({ label, value, sub, tone, bar }: {
  label: string; value: ReactNode; sub?: ReactNode; tone?: string; bar?: number
}) {
  return (
    <div className="panel px-3.5 py-3 relative overflow-hidden">
      <div className="klbl">{label}</div>
      <div className={'font-mono font-bold text-[26px] leading-none mt-1.5 tracking-tight ' + (tone || '')}>{value}</div>
      {sub && <div className="font-mono text-[10.5px] text-mut mt-1.5">{sub}</div>}
      {bar != null && (
        <div className="h-1 rounded bg-edge2 mt-2 overflow-hidden">
          <div className="h-full rounded bg-gradient-to-r from-cyan to-[#8fe0ff] transition-all" style={{ width: Math.min(100, bar) + '%' }} />
        </div>
      )}
    </div>
  )
}

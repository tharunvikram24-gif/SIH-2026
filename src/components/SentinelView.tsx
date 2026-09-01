import { useSystem } from '../store/useSystem'
import { Panel } from './Panel'
import { Chip } from './Chip'
import { NetChart } from './charts/NetChart'
import { ShieldCheck } from 'lucide-react'

export function SentinelView({ compact }: { compact?: boolean }) {
  const ext = useSystem((s) => s.ext)
  const blocked = useSystem((s) => s.blocked)
  const egress = useSystem((s) => s.egress)
  return (
    <Panel icon={<ShieldCheck size={15} className="text-grn" />} title="Sovereignty Sentinel" action={<Chip tone="ok">DEFAULT-DENY</Chip>}>
      <div className="flex items-end gap-3.5">
        <div className={'font-mono font-extrabold text-[52px] leading-[.9] tracking-tighter ' + (ext > 0 ? 'text-red' : 'text-grn')}>{ext}</div>
        <div className="font-mono text-[11px] text-mut pb-1.5 leading-relaxed">external calls<br /><b className="text-ink">{blocked}</b> attempts blocked<br />this session</div>
      </div>
      <div className="mt-3 border border-edge rounded-[9px] bg-bg2 px-1.5 pt-2 pb-1">
        <div className="flex gap-3.5 font-mono text-[10px] text-mut px-1 pb-1">
          <span><i className="inline-block w-2.5 h-[3px] rounded bg-grn mr-1.5 align-middle" />internal (loopback)</span>
          <span><i className="inline-block w-2.5 h-[3px] rounded bg-red mr-1.5 align-middle" />external (egress)</span>
        </div>
        <NetChart />
      </div>
      {!compact && (
        <div className="mt-3 border border-edge rounded-[9px] overflow-hidden">
          <div className="flex justify-between font-mono text-[10px] text-faint px-2.5 py-1.5 border-b border-edge uppercase tracking-wide">
            <span>egress monitor</span><span>verdict</span>
          </div>
          <div className="max-h-[190px] overflow-y-auto font-mono text-[11px]">
            {egress.length === 0 && <div className="text-faint text-center py-6">no egress yet</div>}
            {egress.map((e) => (
              <div key={e.id} className={'grid grid-cols-[96px_1fr_auto] gap-2 px-2.5 py-1.5 border-t border-[#131c24] items-center ' + (e.verdict === 'DENY' ? 'bg-red/[.06]' : '')}>
                <span className="text-mut truncate">{e.host}</span>
                <span className="text-ink truncate">{e.path}</span>
                <span className={'font-bold text-[10px] ' + (e.verdict === 'ALLOW' ? 'text-grn' : 'text-red')}>{e.verdict}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  )
}

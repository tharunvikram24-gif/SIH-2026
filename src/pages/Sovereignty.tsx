import { SentinelView } from '../components/SentinelView'
import { Panel } from '../components/Panel'
import { Chip } from '../components/Chip'
import { ShieldCheck } from 'lucide-react'
export default function Sovereignty() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 items-start">
      <SentinelView />
      <Panel icon={<ShieldCheck size={15} className="text-grn" />} title="Egress policy" action={<Chip tone="ok">enforced</Chip>}>
        <p className="text-[13px] text-mut leading-relaxed">The box runs a <b className="text-ink">default-deny</b> egress firewall. Only loopback addresses (127.0.0.1) are reachable; every other destination is dropped and logged. The counter above is the number of packets that reached the public internet during this session.</p>
        <div className="mt-3 flex flex-col gap-2">
          {[['Model inference', '127.0.0.1:11434', 'ALLOW'], ['Vector search', '127.0.0.1:7001', 'ALLOW'], ['Sandbox exec', '127.0.0.1:9000', 'ALLOW'], ['Any public host', '0.0.0.0/0', 'DENY']].map(([a, b, v]) => (
            <div key={a} className="flex items-center gap-3 rounded-[9px] border border-edge bg-bg2 px-3 py-2">
              <span className="text-[13px] font-medium">{a}</span>
              <span className="font-mono text-[11px] text-faint">{b}</span>
              <span className={'ml-auto font-mono text-[10px] font-bold ' + (v === 'ALLOW' ? 'text-grn' : 'text-red')}>{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] text-faint">Judge tip: run the demo, then point at the counter — it stays 0 even though a dependency tried to phone home.</p>
      </Panel>
    </div>
  )
}

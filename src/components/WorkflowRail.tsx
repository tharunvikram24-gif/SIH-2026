import { useStore } from '../store'
import { Card, Chip, StatusDot } from './ui'
import { Check, Cpu, ShieldCheck, Network as Net, ArrowDown } from 'lucide-react'

export function WorkflowRail() {
  const steps = useStore((s) => s.steps)
  const router = useStore((s) => s.router)
  const net = useStore((s) => s.net)

  return (
    <div className="flex flex-col gap-4">
      {/* AGENT EXECUTION */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="klbl">Agent Execution</div>
          <Chip tone={router.active ? 'cyan' : 'mut'}>{router.active ? 'running' : 'idle'}</Chip>
        </div>
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div key={s.key}>
              <div className="flex items-start gap-3">
                <div className={'mt-0.5 grid place-items-center w-6 h-6 rounded-full border shrink-0 ' +
                  (s.status === 'done' ? 'border-grn bg-grn/10' : s.status === 'active' ? 'border-teal' : 'border-edge2')}>
                  {s.status === 'done' ? <Check size={13} className="text-grn" /> : s.status === 'active' ? <span className="spin" /> : <span className="w-1.5 h-1.5 rounded-full bg-faint" />}
                </div>
                <div className="min-w-0 pb-1">
                  <div className={'text-[13px] font-semibold ' + (s.status === 'pending' ? 'text-mut' : 'text-ink')}>{s.label}</div>
                  <div className="font-mono text-[10.5px] text-faint">{s.sub}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="ml-3 h-3 flex items-center">
                  <ArrowDown size={12} className={s.status === 'done' ? 'text-grn/60' : 'text-edge2'} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* MODEL ROUTER */}
      <Card className="p-4">
        <div className="klbl mb-3 flex items-center gap-2"><Cpu size={13} className="text-cyan" /> Model Router</div>
        <div className="flex flex-col gap-2 text-[12.5px]">
          <Row k="Task" v={router.task} />
          <Row k="Model" v={router.model} mono />
          <div className="flex items-center justify-between">
            <span className="text-mut">Status</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
              <StatusDot tone={router.active ? 'amber' : 'grn'} pulse={router.active} />
              {router.active ? 'Running locally' : 'Ready'}
            </span>
          </div>
        </div>
      </Card>

      {/* SECURITY */}
      <Card className="p-4">
        <div className="klbl mb-3 flex items-center gap-2"><ShieldCheck size={13} className="text-teal" /> Sovereign Environment</div>
        <div className="flex flex-col gap-2 text-[12.5px]">
          <Check2 k="Local inference" />
          <Check2 k="Local RAG" />
          <Check2 k="Sandboxed tools" />
          <div className="flex items-center justify-between">
            <span className="text-mut">External API calls</span>
            <span className="font-mono font-bold text-grn">{net.external}</span>
          </div>
        </div>
      </Card>

      {/* NETWORK MONITOR */}
      <Card className="p-4">
        <div className="klbl mb-3 flex items-center gap-2"><Net size={13} className="text-amber" /> Network Monitor</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Metric v={net.external} l="external" tone="text-grn" />
          <Metric v={net.internal} l="internal" tone="text-cyan" />
          <Metric v={net.dataKB + ' KB'} l="data out" tone="text-grn" />
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-md border border-teal/40 bg-teal/10 py-2">
          <ShieldCheck size={14} className="text-tealb" />
          <span className="font-mono text-[11px] font-bold tracking-wide text-tealb">SECURE / ISOLATED</span>
        </div>
      </Card>
    </div>
  )
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return <div className="flex items-center justify-between"><span className="text-mut">{k}</span><span className={(mono ? 'font-mono text-[11.5px] ' : '') + 'text-ink'}>{v}</span></div>
}
function Check2({ k }: { k: string }) {
  return <div className="flex items-center justify-between"><span className="text-mut">{k}</span><Check size={15} className="text-grn" /></div>
}
function Metric({ v, l, tone }: { v: any; l: string; tone: string }) {
  return <div className="rounded-md border border-edge bg-beige py-2"><div className={'font-mono font-bold text-[16px] ' + tone}>{v}</div><div className="klbl mt-0.5">{l}</div></div>
}

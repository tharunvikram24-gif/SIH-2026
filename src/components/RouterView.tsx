import { useSystem } from '../store/useSystem'
import { MODELS, modelById } from '../data/models'
import { Panel } from './Panel'
import { Waypoints, ArrowRight } from 'lucide-react'

export function RouterView({ compact }: { compact?: boolean }) {
  const route = useSystem((s) => s.route)
  const active = useSystem((s) => s.activeModel)
  const node = (lbl: string, val: string, tone: string) => (
    <div className={'flex-1 min-w-0 rounded-[10px] border bg-bg2 px-2.5 py-2 ' + tone}>
      <div className="klbl text-[9.5px]">{lbl}</div>
      <div className="font-bold text-[13px] mt-1 truncate">{val}</div>
    </div>
  )
  return (
    <Panel icon={<Waypoints size={15} className="text-violet" />} title="Model Router" meta={route.state}>
      <div className="flex items-stretch gap-2">
        {node('Incoming task', route.task, 'border-violet')}
        <ArrowRight size={16} className="self-center text-faint shrink-0" />
        {node('Classified', route.type, 'border-edge2')}
        <ArrowRight size={16} className="self-center text-faint shrink-0" />
        {node('Routed to', route.model ? modelById(route.model)!.name : '—', 'border-cyan')}
      </div>
      <div className="font-mono text-[11px] text-mut mt-3 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: route.reason || 'Classifier idle. A local 8B model tags each task as <b>code</b>, <b>document/vision</b> or <b>general</b> and dispatches it to the best open-weight model on the box.' }} />
      {!compact && (
        <div className="mt-3 flex flex-col gap-1.5">
          {MODELS.map((m) => {
            const on = active === m.id
            return (
              <div key={m.id} className={'flex items-center gap-2.5 rounded-[9px] border px-2.5 py-2 ' + (on ? 'border-cyan bg-cyan/[.06]' : 'border-edge bg-bg2')}>
                <span className={'w-2 h-2 rounded-full shrink-0 ' + (on ? 'bg-cyan shadow-[0_0_8px_#5CB8E8]' : 'bg-faint')} />
                <div className="min-w-0"><div className="font-semibold text-[12.5px]">{m.name}</div><div className="font-mono text-[10px] text-faint">{m.kind}</div></div>
                <div className="ml-auto font-mono text-[10.5px] text-mut text-right">{m.quant} · {m.ctx}<br />{on ? <span className="text-grn">● resident {m.vram}GB</span> : <span className="text-faint">{m.vram}GB</span>}</div>
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}

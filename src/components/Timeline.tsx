import { useEffect, useRef } from 'react'
import { useSystem } from '../store/useSystem'
import { Panel } from './Panel'
import { Chip } from './Chip'
import { Activity, Check } from 'lucide-react'

export function Timeline({ limit }: { limit?: number }) {
  const steps = useSystem((s) => s.steps)
  const tlState = useSystem((s) => s.tlState)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight }, [steps])
  const shown = limit ? steps.slice(-limit) : steps
  const tone = tlState === 'complete' ? 'ok' : tlState === 'running' ? 'warn' : 'mut'

  return (
    <Panel icon={<Activity size={15} className="text-grn" />} title="Agent Run — Live Trace"
      action={<Chip tone={tone as any}>{tlState}</Chip>}>
      <div ref={ref} className="max-h-[560px] overflow-y-auto pr-1">
        {shown.length === 0 ? (
          <div className="font-mono text-[12px] text-faint text-center py-10 px-3">
            Press <b className="text-amber">Run demo</b> to watch the agent take a scanned inspection report to a
            signed approval note — unattended, on this box, with zero external calls.
          </div>
        ) : shown.map((s, i) => (
          <div key={s.id} className={'flex gap-3 py-2.5 ' + (i ? 'border-t border-edge' : '') + (s.fresh ? ' streamin' : '')}>
            <div className={'grid place-items-center w-6 h-6 rounded-full border shrink-0 ' +
              (s.status === 'done' ? 'border-grn bg-grn/10' : s.status === 'err' ? 'border-red' : 'border-amber')}>
              {s.status === 'done' ? <Check size={13} className="text-grn" /> : s.status === 'err' ? <span className="text-red font-bold">!</span> : <span className="spin" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[13px]">{s.title}</span>
                {s.tool && <span className="font-mono text-[10px] text-violet bg-violet/[.08] border border-violet/25 px-1.5 rounded">{s.tool}</span>}
                <span className="ml-auto font-mono text-[10.5px] text-faint">{s.dur}</span>
              </div>
              {s.detail && <div className="font-mono text-[11px] text-mut mt-1 whitespace-pre-wrap break-words">{s.detail}</div>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

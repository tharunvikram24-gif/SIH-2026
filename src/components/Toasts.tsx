import { useSystem } from '../store/useSystem'
import { Waypoints, CheckCircle2, TriangleAlert, ShieldX } from 'lucide-react'
const icons: any = { route: Waypoints, ok: CheckCircle2, warn: TriangleAlert, deny: ShieldX }
const tint: any = { route: 'text-violet bg-violet/10', ok: 'text-grn bg-grn/10', warn: 'text-amber bg-amber/10', deny: 'text-red bg-red/10' }
export function Toasts() {
  const toasts = useSystem((s) => s.toasts)
  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-2.5 max-w-[340px]">
      {toasts.map((t) => {
        const I = icons[t.kind]
        return (
          <div key={t.id} className="streamin flex gap-2.5 items-start rounded-xl border border-edge2 bg-gradient-to-b from-raise to-panel p-3 shadow-[0_20px_40px_-20px_#000]">
            <span className={'grid place-items-center w-[26px] h-[26px] rounded-lg shrink-0 ' + tint[t.kind]}><I size={15} /></span>
            <div>
              <div className="font-bold text-[12.5px]">{t.title}</div>
              <div className="font-mono text-[11px] text-mut mt-0.5">{t.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

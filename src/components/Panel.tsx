import { ReactNode } from 'react'

export function Panel({ icon, title, meta, action, children, className }: {
  icon?: ReactNode; title: string; meta?: ReactNode; action?: ReactNode; children: ReactNode; className?: string
}) {
  return (
    <section className={'panel ' + (className || '')}>
      <div className="phead">
        {icon && <span className="grid place-items-center w-[26px] h-[26px] rounded-lg bg-raise border border-edge2 shrink-0">{icon}</span>}
        <h2 className="text-[13.5px] font-bold tracking-tight">{title}</h2>
        {meta && <span className="ml-auto font-mono text-[10.5px] text-faint">{meta}</span>}
        {action && <span className={meta ? '' : 'ml-auto'}>{action}</span>}
      </div>
      <div className="pbody">{children}</div>
    </section>
  )
}

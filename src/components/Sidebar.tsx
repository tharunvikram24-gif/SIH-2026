import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useSystem } from '../store/useSystem'
import { modelById } from '../data/models'
import {
  LayoutDashboard, Waypoints, Activity, ShieldCheck, TerminalSquare,
  Database, ScrollText, FileText, Settings as Cog, ChevronsLeft, Cpu,
} from 'lucide-react'

type Item = { to: string; end?: boolean; icon: any; label: string; badge?: 'audit' | 'ext' | 'runs' }

const groups: { label: string; items: Item[] }[] = [
  {
    label: 'Operations',
    items: [
      { to: '/', end: true, icon: LayoutDashboard, label: 'Mission Control' },
      { to: '/runs', icon: Activity, label: 'Agent Runs', badge: 'runs' },
      { to: '/router', icon: Waypoints, label: 'Model Router' },
      { to: '/sandbox', icon: TerminalSquare, label: 'Sandbox' },
      { to: '/knowledge', icon: Database, label: 'Knowledge' },
    ],
  },
  {
    label: 'Assurance',
    items: [
      { to: '/sovereignty', icon: ShieldCheck, label: 'Sovereignty', badge: 'ext' },
      { to: '/audit', icon: ScrollText, label: 'Audit Log', badge: 'audit' },
      { to: '/artefacts', icon: FileText, label: 'Artefacts' },
    ],
  },
  { label: 'System', items: [{ to: '/settings', icon: Cog, label: 'Settings' }] },
]

function Badge({ kind }: { kind: NonNullable<Item['badge']> }) {
  const audit = useSystem((s) => s.auditCount)
  const ext = useSystem((s) => s.ext)
  const running = useSystem((s) => s.running)
  const steps = useSystem((s) => s.stepCount)
  if (kind === 'audit') return audit ? <span className="ml-auto font-mono text-[10px] px-1.5 py-[1px] rounded-full bg-violet/15 text-violet border border-violet/25">{audit}</span> : null
  if (kind === 'ext') return <span className={'ml-auto font-mono text-[10px] px-1.5 py-[1px] rounded-full border ' + (ext > 0 ? 'bg-red/15 text-red border-red/30' : 'bg-grn/12 text-grn border-grn/25')}>{ext}</span>
  if (kind === 'runs') return running ? <span className="ml-auto font-mono text-[10px] px-1.5 py-[1px] rounded-full bg-amber/15 text-amber border border-amber/25 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber pulse" />{steps}</span> : null
  return null
}

export function Sidebar() {
  const [open, setOpen] = useState(true)
  const model = modelById(useSystem((s) => s.activeModel))
  const gpu = useSystem((s) => s.gpu)

  return (
    <aside className={(open ? 'w-[260px]' : 'w-[76px]') + ' shrink-0 h-screen sticky top-0 z-40 flex flex-col border-r border-edge bg-gradient-to-b from-[#0F171F] to-[#0A0F15] transition-[width] duration-200 ease-out'}>
      {/* brand */}
      <div className="flex items-center gap-3 px-4 h-[64px] border-b border-edge">
        <span className="relative grid place-items-center w-9 h-9 rounded-[10px] shrink-0 border border-edge2 bg-[radial-gradient(120%_120%_at_30%_15%,#22333f,#0b141b)] shadow-[0_0_0_1px_#0006_inset]">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5 4.5 5.2v5.6c0 4.7 3.2 8 7.5 10.2 4.3-2.2 7.5-5.5 7.5-10.2V5.2L12 2.5Z" stroke="#F2A93B" strokeWidth="1.5" fill="rgba(242,169,59,.08)" />
            <path d="M8.7 12.1l2.2 2.2 4.2-4.4" stroke="#4FD08A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-grn border-2 border-[#0A0F15]" />
        </span>
        {open && (
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[14.5px] leading-tight tracking-tight">Sovereign</div>
            <div className="font-mono text-[9.5px] text-faint leading-tight">Workbench v1.0 · on-prem</div>
          </div>
        )}
        <button onClick={() => setOpen(!open)} aria-label="Toggle sidebar"
          className={'grid place-items-center w-7 h-7 rounded-md text-faint hover:text-ink hover:bg-raise transition ' + (open ? '' : 'absolute left-1/2 -translate-x-1/2 mt-16 rotate-180')}>
          <ChevronsLeft size={16} />
        </button>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        {groups.map((g) => (
          <div key={g.label}>
            {open
              ? <div className="text-[10px] font-semibold text-faint/80 tracking-wide px-2.5 mb-2">{g.label}</div>
              : <div className="mx-3 mb-2 h-px bg-edge" />}
            <div className="flex flex-col gap-1">
              {g.items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.end} title={open ? undefined : it.label}
                  className={({ isActive }) =>
                    'group relative flex items-center h-[38px] rounded-[10px] px-2.5 transition-colors ' +
                    (isActive
                      ? 'bg-gradient-to-r from-raise to-raise/30 text-ink ring-1 ring-inset ring-white/5'
                      : 'text-mut hover:text-ink hover:bg-raise/50') +
                    (open ? ' gap-3' : ' justify-center')
                  }>
                  {({ isActive }) => (
                    <>
                      <span className={'absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all ' + (isActive ? 'bg-amber shadow-[0_0_10px_rgba(242,169,59,.6)]' : 'bg-transparent')} />
                      <it.icon size={18} className={'shrink-0 ' + (isActive ? 'text-amber' : 'text-faint group-hover:text-mut')} />
                      {open && <span className="text-[13px] font-medium truncate">{it.label}</span>}
                      {open && it.badge && <Badge kind={it.badge} />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* footer: live system status */}
      <div className="p-3 border-t border-edge flex flex-col gap-2">
        {open && (
          <div className="rounded-[10px] border border-edge bg-bg2 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Cpu size={13} className="text-cyan" />
              <span className="font-mono text-[10px] text-mut truncate">{model ? model.name : 'no model loaded'}</span>
              <span className="ml-auto font-mono text-[10px] text-faint">{Math.round(gpu)}%</span>
            </div>
            <div className="mt-1.5 h-1 rounded bg-edge2 overflow-hidden">
              <div className="h-full rounded bg-gradient-to-r from-cyan to-[#8fe0ff] transition-all duration-300" style={{ width: Math.max(2, gpu) + '%' }} />
            </div>
          </div>
        )}
        <div className={'flex items-center gap-2.5 rounded-[10px] border border-grn/35 bg-grn/[.08] ' + (open ? 'px-3 py-2' : 'justify-center py-2.5')}>
          <span className="w-2.5 h-2.5 rounded-full bg-grn pulse shrink-0 shadow-[0_0_0_3px_rgba(79,208,138,.16)]" />
          {open && <div className="font-mono text-[10px] font-bold text-grn tracking-wide leading-tight">AIR-GAPPED<br /><span className="text-grn/70 font-medium">0 external calls</span></div>}
        </div>
      </div>
    </aside>
  )
}

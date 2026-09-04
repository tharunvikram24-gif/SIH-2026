import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { Chip, StatusDot } from './ui'
import { ThemeToggle } from './ThemeToggle'
import { SovereigntyBadge } from './SovereigntyBadge'
import { Menu, ShieldCheck, Settings, User, Bell, HelpCircle, LogOut } from 'lucide-react'

const titles: Record<string, { t: string; crumb: string }> = {
  '/': { t: 'AI Workbench', crumb: 'MRPL / Sovereign AI / Workspace' },
  '/documents': { t: 'Knowledge Base', crumb: 'MRPL / Sovereign AI / Documents' },
  '/workflows': { t: 'Agent Workflow', crumb: 'MRPL / Sovereign AI / Workflows' },
  '/activity': { t: 'Agent Activity', crumb: 'MRPL / Sovereign AI / Activity' },
  '/audit': { t: 'Audit Log', crumb: 'MRPL / Sovereign AI / Audit' },
  '/settings': { t: 'Profile', crumb: 'MRPL / Sovereign AI / Profile' },
}

export function TopHeader({ route }: { route: string }) {
  const setSidebar = useStore((s) => s.setSidebar)
  const user = useStore((s) => s.user)
  const nav = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const meta = titles[route] || titles['/']

  const go = (path: string) => { setMenuOpen(false); nav(path) }

  return (
    <header className="sticky top-0 z-30 h-[68px] flex items-center gap-3 px-4 md:px-6 border-b border-edge bg-navy">
      <button className="lg:hidden btn btn-ghost px-2" onClick={() => setSidebar(true)}><Menu size={18} /></button>
      <div className="min-w-0">
        <h1 className="font-serif font-medium text-[19px] leading-tight text-ink">{meta.t}</h1>
        <div className="text-[11px] text-faint leading-tight">{meta.crumb}</div>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        <span className="hidden sm:inline-flex chip text-mut border-edge bg-transparent items-center gap-1.5"><ShieldCheck size={12} /> ON-PREMISE</span>
        <span className="inline-flex chip text-grn border-grn/40 bg-grn/10 items-center gap-1.5"><StatusDot tone="grn" pulse /> SECURE</span>
        <span className="hidden md:inline-flex"><SovereigntyBadge /></span>

        <ThemeToggle />
        {/* gear — same destination as the Settings nav item */}
        <button onClick={() => go('/settings')} title="Settings" className="btn btn-ghost px-2"><Settings size={17} /></button>

        {/* avatar / profile menu */}
        <div className="relative">
          <button onClick={() => setMenuOpen((o) => !o)} title={user.name}
            className="grid place-items-center w-8 h-8 rounded-full bg-teal text-white font-serif text-[13px] font-medium">
            {user.initials}
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 card w-64 p-1.5 fadeup">
                <div className="flex items-center gap-3 px-2.5 py-2.5 border-b border-edge mb-1.5">
                  <div className="grid place-items-center w-9 h-9 rounded-full bg-teal text-white font-serif text-[13px] font-medium shrink-0">{user.initials}</div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-ink truncate">{user.name}</div>
                    <div className="text-[11.5px] text-faint truncate">{user.email}</div>
                  </div>
                </div>
                <MenuItem icon={User} label="Personal Information" onClick={() => go('/settings')} />
                <MenuItem icon={Settings} label="Account Settings" onClick={() => go('/settings')} />
                <MenuItem icon={Bell} label="Notifications" onClick={() => setMenuOpen(false)} />
                <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => setMenuOpen(false)} />
                <div className="my-1 border-t border-edge" />
                <MenuItem icon={LogOut} label="Log Out" tone="text-red" onClick={() => setMenuOpen(false)} />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function MenuItem({ icon: Icon, label, onClick, tone = 'text-mut' }: { icon: any; label: string; onClick?: () => void; tone?: string }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] hover:bg-raise text-left text-ink">
      <Icon size={15} className={tone} /> {label}
    </button>
  )
}

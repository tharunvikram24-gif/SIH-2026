import { useStore } from '../store'
import { Card, Chip } from './_p'
import { Mail, Building2, LayoutGrid, ShieldCheck, UserCog } from 'lucide-react'

// Settings now opens Profile / Account (model selection lives in the Model Router panel, unchanged).
export default function SettingsPage() {
  const u = useStore((s) => s.user)
  return (
    <div className="p-4 md:p-6 max-w-4xl grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 items-start">
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-teal text-white font-serif text-[22px] shrink-0">{u.initials}</div>
          <div className="min-w-0">
            <div className="font-serif text-[22px] leading-tight">{u.name}</div>
            <div className="text-[13px] text-mut">{u.role}</div>
          </div>
        </div>
        <div className="mt-5 flex flex-col divide-y divide-edge">
          <Row icon={Mail} label="Email" value={u.email} />
          <Row icon={Building2} label="Organization" value={u.org} />
          <Row icon={LayoutGrid} label="Workspace" value={u.workspace} />
          <Row icon={UserCog} label="Role" value={u.role} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="klbl mb-3">Account information</div>
        <div className="flex flex-col gap-3 text-[13px]">
          <Line k="Plan" v={u.plan} />
          <Line k="Member since" v={u.memberSince} />
          <div className="flex items-center justify-between">
            <span className="text-mut">Access</span>
            <span className="flex gap-1.5"><Chip tone="grn">ON-PREM</Chip><Chip tone="amber">ISOLATED</Chip></span>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-md border border-edge bg-raise px-3 py-2.5">
          <ShieldCheck size={15} className="text-grn shrink-0 mt-0.5" />
          <span className="text-[12.5px] text-mut">All data stays on-premise. Model routing is managed by your workspace admins.</span>
        </div>
        <button className="btn w-full mt-4 justify-center">Manage account</button>
      </Card>
    </div>
  )
}

function Row({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon size={16} className="text-faint shrink-0" />
      <div className="min-w-0"><div className="klbl">{label}</div><div className="text-[13.5px] truncate">{value}</div></div>
    </div>
  )
}
function Line({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between"><span className="text-mut">{k}</span><span className="text-ink">{v}</span></div>
}

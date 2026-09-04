import { useStore } from '../store'
import { Card, Chip } from './_p'
import { Download } from 'lucide-react'

export default function AuditLogPage() {
  const audit = useStore((s) => s.audit)
  const exportCsv = () => {
    const csv = 'time,action,component,status\n' + audit.map((a) => [a.time, a.action, a.component, a.status].join(',')).join('\n')
    const b = new Blob([csv], { type: 'text/csv' }); const u = URL.createObjectURL(b)
    const a = document.createElement('a'); a.href = u; a.download = 'mrpl_audit_log.csv'; a.click(); URL.revokeObjectURL(u)
  }
  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-4">
        <div><h2 className="font-serif font-medium text-[19px]">Audit Log</h2><p className="text-[12.5px] text-mut">Append-only record of every action — signed and exportable for compliance.</p></div>
        <button className="ml-auto btn" onClick={exportCsv}><Download size={15} /> Export CSV</button>
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[100px_1fr_150px_110px] gap-3 px-4 py-2.5 border-b border-edge klbl">
          <span>Time</span><span>Action</span><span>Component</span><span>Status</span>
        </div>
        {audit.map((a) => (
          <div key={a.id} className="grid grid-cols-[100px_1fr_150px_110px] gap-3 px-4 py-2.5 border-t border-edge items-center text-[12.5px]">
            <span className="font-mono text-[11.5px] text-faint">{a.time}</span>
            <span className="text-ink">{a.action}</span>
            <span className="text-cyan font-mono text-[11.5px]">{a.component}</span>
            <span><Chip tone={a.status === 'SUCCESS' ? 'grn' : a.status === 'READY' ? 'cyan' : 'amber'}>{a.status}</Chip></span>
          </div>
        ))}
      </Card>
    </div>
  )
}

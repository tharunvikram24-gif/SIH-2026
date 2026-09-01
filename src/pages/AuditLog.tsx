import { useSystem } from '../store/useSystem'
import { Panel } from '../components/Panel'
import { ScrollText, Download } from 'lucide-react'

export default function AuditLog() {
  const rows = useSystem((s) => s.audit)
  const exportCsv = () => {
    if (!rows.length) return
    const csv = 'time,tool,model,hash\n' + rows.map((r) => [r.t, r.tool, r.model, r.hash].join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'sovereign_audit_log.csv'; a.click(); URL.revokeObjectURL(url)
  }
  return (
    <Panel icon={<ScrollText size={15} className="text-violet" />} title="Audit Log"
      action={<button className="btn btn-ghost" onClick={exportCsv}><Download size={14} />Export CSV</button>}>
      <div className="font-mono text-[11.5px]">
        <div className="grid grid-cols-[64px_1fr_120px_80px] gap-3 text-faint border-b border-edge pb-2 uppercase text-[9.5px] tracking-wide">
          <span>time</span><span>tool / action</span><span>model</span><span>hash</span>
        </div>
        {rows.length === 0 ? <div className="text-faint text-center py-10">No events recorded.</div> :
          rows.map((r) => (
            <div key={r.id} className="grid grid-cols-[64px_1fr_120px_80px] gap-3 border-t border-[#131c24] py-2 items-center">
              <span className="text-faint">{r.t}</span><span className="text-ink truncate">{r.tool}</span>
              <span className="text-cyan">{r.model}</span><span className="text-grn">{r.hash}</span>
            </div>
          ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-faint">Every tool call is appended with a content hash. Export produces a signable CSV for compliance review.</p>
    </Panel>
  )
}

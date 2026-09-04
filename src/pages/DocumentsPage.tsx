import { useStore } from '../store'
import { Card, Chip } from './_p'
import { FileText, UploadCloud, Check } from 'lucide-react'

export default function DocumentsPage() {
  const docs = useStore((s) => s.docs)
  const setUploadOpen = useStore((s) => s.setUploadOpen)
  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-4">
        <div><h2 className="font-serif font-medium text-[19px]">Knowledge Base</h2><p className="text-[12.5px] text-mut">Documents indexed locally for retrieval. Nothing is uploaded to the cloud.</p></div>
        <button className="ml-auto btn btn-primary" onClick={() => setUploadOpen(true)}><UploadCloud size={16} /> Upload Documents</button>
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_100px_120px_110px] gap-3 px-4 py-2.5 border-b border-edge klbl">
          <span>Document</span><span>Type</span><span>Size / Pages</span><span>Indexed</span><span>Updated</span>
        </div>
        {docs.map((d) => (
          <div key={d.name} className="grid grid-cols-[1fr_90px_100px_120px_110px] gap-3 px-4 py-3 border-t border-edge items-center text-[13px]">
            <span className="flex items-center gap-2.5 min-w-0"><FileText size={15} className="text-cyan shrink-0" /><span className="truncate">{d.name}</span></span>
            <span><Chip tone="mut">{d.type}</Chip></span>
            <span className="font-mono text-[12px] text-mut">{d.meta}</span>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-grn"><Check size={13} /> {d.indexed ? 'Indexed' : '—'}</span>
            <span className="font-mono text-[11.5px] text-faint">{d.updated}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}

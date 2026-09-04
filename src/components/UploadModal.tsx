import { useState } from 'react'
import { useStore } from '../store'
import { Card, Chip } from './ui'
import { UploadCloud, X, FileText, Check } from 'lucide-react'

export function UploadModal() {
  const open = useStore((s) => s.uploadOpen)
  const setOpen = useStore((s) => s.setUploadOpen)
  const addDocs = useStore((s) => s.addDocs)
  const addAudit = useStore((s) => s.addAudit)
  const [staged, setStaged] = useState<{ name: string; meta: string; indexed: boolean }[]>([])

  if (!open) return null
  const fakeUpload = () => {
    const samples = [
      { name: 'inspection_report.pdf', meta: '24 pages' },
      { name: 'maintenance_log.csv', meta: '1.8 MB' },
    ]
    setStaged(samples.map((s) => ({ ...s, indexed: false })))
    samples.forEach((s, i) => setTimeout(() => setStaged((prev) => prev.map((p, j) => (j === i ? { ...p, indexed: true } : p))), 900 + i * 700))
  }
  const commit = () => {
    if (staged.length) {
      addDocs(staged.map((s) => ({ name: s.name, type: s.name.split('.').pop()!.toUpperCase(), meta: s.meta, indexed: true, updated: 'just now' })))
      addAudit('Document uploaded (' + staged.length + ')', 'RAG Engine')
    }
    setStaged([]); setOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setOpen(false)}>
      <Card className="w-full max-w-lg p-5 fadeup" >
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 mb-4">
            <div className="font-semibold text-[15px]">Add knowledge to this conversation</div>
            <button className="ml-auto text-faint hover:text-ink" onClick={() => setOpen(false)}><X size={18} /></button>
          </div>

          <button onClick={fakeUpload} className="w-full rounded-md border-2 border-dashed border-edge2 hover:border-cyan/60 bg-beige py-10 grid place-items-center gap-2 transition">
            <UploadCloud size={26} className="text-cyan" />
            <div className="text-[13.5px] font-medium">Drag files here or <span className="text-cyan">Browse Files</span></div>
            <div className="flex gap-1.5 mt-1">{['PDF', 'DOCX', 'TXT', 'CSV', 'PNG', 'JPG'].map((t) => <Chip key={t}>{t}</Chip>)}</div>
          </button>

          {staged.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {staged.map((s) => (
                <div key={s.name} className="relative overflow-hidden flex items-center gap-3 rounded-md border border-edge bg-beige px-3 py-2.5">
                  {!s.indexed && <span className="absolute inset-0 shimmer" />}
                  <FileText size={16} className="text-faint" />
                  <div className="min-w-0"><div className="text-[13px]">{s.name}</div><div className="font-mono text-[10.5px] text-faint">{s.meta}</div></div>
                  <span className="ml-auto">
                    {s.indexed
                      ? <span className="inline-flex items-center gap-1.5 text-[11.5px] text-grn"><Check size={13} /> Indexed</span>
                      : <span className="inline-flex items-center gap-1.5 text-[11.5px] text-cyan"><span className="spin" /> Indexing…</span>}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={commit} disabled={!staged.every((s) => s.indexed) || staged.length === 0}>Add to knowledge base</button>
          </div>
        </div>
      </Card>
    </div>
  )
}

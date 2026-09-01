import { useSystem } from '../store/useSystem'
import { Panel } from './Panel'
import { Database } from 'lucide-react'

export function KnowledgeView() {
  const rag = useSystem((s) => s.rag)
  return (
    <Panel icon={<Database size={15} className="text-cyan" />} title="Local Knowledge (RAG)" meta="FAISS · on-disk">
      {rag.length === 0 ? (
        <div className="font-mono text-[12px] text-faint text-center py-6">No retrieval yet. Index: 1,284 public inspection docs.</div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {rag.map((c, i) => (
            <div key={i} className="flex gap-2.5 items-center rounded-[9px] border border-edge bg-bg2 px-2.5 py-2">
              <span className="grid place-items-center w-[22px] h-[22px] rounded-md bg-cyan/10 border border-cyan/30 text-cyan font-mono text-[10px] shrink-0">{i + 1}</span>
              <div className="min-w-0"><div className="text-[12px] font-semibold truncate">{c.t}</div><div className="font-mono text-[10px] text-faint">{c.s}</div></div>
              <span className="ml-auto font-mono text-[10.5px] text-grn">{c.sc}</span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

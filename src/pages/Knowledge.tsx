import { KnowledgeView } from '../components/KnowledgeView'
import { Panel } from '../components/Panel'
import { Database } from 'lucide-react'
export default function Knowledge() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 items-start">
      <KnowledgeView />
      <Panel icon={<Database size={15} className="text-cyan" />} title="Local retrieval">
        <p className="text-[13px] text-mut leading-relaxed">Documents are embedded on-device with <b className="text-ink">nomic-embed-text</b> and stored in a local <b className="text-ink">FAISS</b> index — no cloud embedding API, so the knowledge base never leaves the box. At query time the agent retrieves the top-k passages and cites them, so every claim in a deliverable is traceable to a source page.</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[['Documents', '1,284'], ['Vectors', '38,902'], ['Dim', '768']].map(([k, v]) => (
            <div key={k} className="rounded-[9px] border border-edge bg-bg2 px-3 py-2 text-center"><div className="font-mono font-bold text-[18px] text-cyan">{v}</div><div className="klbl">{k}</div></div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-faint">Index built from public inspection standards + this refinery's own historical reports.</p>
      </Panel>
    </div>
  )
}

import { MODELS } from '../data/models'
import { Panel } from '../components/Panel'
import { Chip } from '../components/Chip'
import { Cpu, PlugZap } from 'lucide-react'

export default function Settings() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <Panel icon={<Cpu size={15} className="text-cyan" />} title="Model registry" meta="all local">
        <div className="flex flex-col gap-1.5">
          {MODELS.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-[9px] border border-edge bg-bg2 px-3 py-2">
              <div className="min-w-0"><div className="font-semibold text-[13px]">{m.name}</div><div className="font-mono text-[10px] text-faint">{m.kind}</div></div>
              <span className="ml-auto font-mono text-[11px] text-mut">{m.quant} · {m.ctx} · {m.vram}GB</span>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-faint">Weights are mounted from <span className="text-cyan">/models</span> and sha256-verified at load. Nothing is downloaded at run time.</p>
      </Panel>

      <Panel icon={<PlugZap size={15} className="text-amber" />} title="Wire to your backend" action={<Chip tone="warn">mock mode</Chip>}>
        <p className="text-[13px] text-mut leading-relaxed">This UI currently runs on a scripted mock engine. To make it live, replace <span className="font-mono text-cyan">src/lib/mockEngine.ts</span> with a client that opens an SSE/WebSocket to your FastAPI agent and calls the same store actions:</p>
        <div className="mt-3 rounded-[9px] border border-edge bg-[#060A0E] p-3 font-mono text-[11px] leading-relaxed overflow-x-auto">
          <div className="text-faint"># server event → store action</div>
          <div><span className="text-violet">step</span>      → pushStep / updateStep</div>
          <div><span className="text-violet">route</span>     → setRoute / setActiveModel</div>
          <div><span className="text-violet">egress</span>    → pushEgress  <span className="text-faint">(ALLOW / DENY)</span></div>
          <div><span className="text-violet">audit</span>     → pushAudit</div>
          <div><span className="text-violet">sandbox</span>   → setSandbox</div>
          <div><span className="text-violet">rag</span>       → setRag</div>
          <div><span className="text-violet">artefact</span>  → setArtefact(true)</div>
        </div>
        <p className="mt-3 font-mono text-[11px] text-faint">No component changes needed — every page reads from the store.</p>
      </Panel>
    </div>
  )
}

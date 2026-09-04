import { RouterView } from '../components/RouterView'
import { Panel } from '../components/Panel'
import { Info } from 'lucide-react'
export default function ModelRouter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 items-start">
      <RouterView />
      <Panel icon={<Info size={15} className="text-cyan" />} title="How routing works">
        <ol className="text-[13px] text-mut leading-relaxed list-decimal pl-5 flex flex-col gap-2">
          <li>A small always-on classifier (<b className="text-ink">Llama-3.1 8B</b>) reads each incoming task and tags it as <b className="text-ink">code</b>, <b className="text-ink">document/vision</b> or <b className="text-ink">general</b>.</li>
          <li>The router maps the tag to the best resident open-weight model and loads it into GPU memory if it is not already resident.</li>
          <li>Within one run the router can <b className="text-ink">hot-swap</b> models — e.g. handing a numeric check to the coder model so the verdict comes from executed code rather than a guess.</li>
          <li>Every routing decision is written to the audit log with the confidence score, so the choice is reviewable after the fact.</li>
        </ol>
        <div className="mt-4 font-mono text-[11px] text-faint">Swap this panel's mock decisions for your FastAPI <span className="text-cyan">/route</span> endpoint — the UI reads it all from one store.</div>
      </Panel>
    </div>
  )
}

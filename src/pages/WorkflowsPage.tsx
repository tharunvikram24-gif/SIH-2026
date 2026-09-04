import { Card } from './_p'
import { Inbox, Waypoints, FileText, Code2, ScanText, Database, ShieldCheck, CornerDownRight } from 'lucide-react'

function Node({ icon: Icon, title, sub, tone = 'text-cyan' }: any) {
  return (
    <Card className="p-3.5 w-full">
      <div className="flex items-center gap-2.5">
        <span className="grid place-items-center w-9 h-9 rounded-md border border-edge2 bg-beige"><Icon size={17} className={tone} /></span>
        <div><div className="font-semibold text-[13.5px]">{title}</div>{sub && <div className="font-mono text-[10.5px] text-faint">{sub}</div>}</div>
      </div>
    </Card>
  )
}
const Down = () => <div className="grid place-items-center py-1.5"><div className="h-6 w-px bg-edge2" /></div>

export default function WorkflowsPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <h2 className="font-serif font-medium text-[19px] mb-1">Agent Workflow</h2>
      <p className="text-[12.5px] text-mut mb-5">How every task flows through the on-premise agent — from intake to a grounded, audited response.</p>

      <div className="flex flex-col items-stretch">
        <Node icon={Inbox} title="Incoming Task" sub="prompt · file · scan" tone="text-mut" />
        <Down />
        <Node icon={Waypoints} title="Task Router" sub="local 8B classifier → task class" tone="text-cyan" />
        <Down />
        <div className="grid grid-cols-3 gap-3">
          <Node icon={FileText} title="Document Agent" tone="text-tealb" />
          <Node icon={Code2} title="Coding Agent" tone="text-amber" />
          <Node icon={ScanText} title="Vision Agent" tone="text-cyan" />
        </div>
        <Down />
        <div className="grid grid-cols-2 gap-3">
          <Node icon={Database} title="Local RAG" sub="FAISS · on-disk" tone="text-cyan" />
          <Node icon={CornerDownRight} title="Tool Calls" sub="typed tools" tone="text-tealb" />
        </div>
        <Down />
        <Node icon={ShieldCheck} title="Sandbox" sub="gVisor · no-network · CPU/MEM/timeout capped" tone="text-teal" />
        <Down />
        <Node icon={CornerDownRight} title="Final Response" sub="grounded · cited · audited" tone="text-grn" />
      </div>
    </div>
  )
}

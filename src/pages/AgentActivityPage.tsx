import { useStore } from '../store'
import { Card, Chip } from './_p'
import { WorkflowRail } from '../components/WorkflowRail'
import { Check } from 'lucide-react'

export default function AgentActivityPage() {
  const audit = useStore((s) => s.audit)
  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
      <div>
        <h2 className="font-serif font-medium text-[19px] mb-1">Agent Activity</h2>
        <p className="text-[12.5px] text-mut mb-4">Live and recent agent steps across all conversations.</p>
        <Card className="overflow-hidden">
          {audit.map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-2.5 border-t border-edge first:border-t-0 text-[12.5px]">
              <Check size={14} className="text-grn shrink-0" />
              <span className="font-mono text-[11px] text-faint w-[70px]">{a.time}</span>
              <span className="text-ink">{a.action}</span>
              <span className="ml-auto"><Chip tone="cyan">{a.component}</Chip></span>
            </div>
          ))}
        </Card>
      </div>
      <div className="lg:sticky lg:top-[92px]"><WorkflowRail /></div>
    </div>
  )
}

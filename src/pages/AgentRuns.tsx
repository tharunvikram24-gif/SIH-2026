import { Timeline } from '../components/Timeline'
import { SandboxView } from '../components/SandboxView'
import { KnowledgeView } from '../components/KnowledgeView'
export default function AgentRuns() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 items-start">
      <Timeline />
      <div className="flex flex-col gap-4"><SandboxView /><KnowledgeView /></div>
    </div>
  )
}

import { KpiStrip } from '../components/KpiStrip'
import { RouterView } from '../components/RouterView'
import { SandboxView } from '../components/SandboxView'
import { Timeline } from '../components/Timeline'
import { SentinelView } from '../components/SentinelView'
import { KnowledgeView } from '../components/KnowledgeView'
import { CompletionBanner } from '../components/CompletionBanner'
import { ArtefactView } from '../components/ArtefactView'
import { runSingle } from '../lib/mockEngine'

export default function MissionControl() {
  return (
    <div className="flex flex-col gap-4">
      <KpiStrip />

      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[11px] text-mut">Launch a single task:</span>
        <button className="btn" onClick={() => runSingle('document')}>Scanned document</button>
        <button className="btn" onClick={() => runSingle('code')}>Code check</button>
        <button className="btn" onClick={() => runSingle('vision')}>P&amp;ID vision</button>
      </div>

      <CompletionBanner />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4"><RouterView compact /><SandboxView /></div>
        <Timeline />
        <div className="flex flex-col gap-4"><SentinelView compact /><KnowledgeView /></div>
      </div>

      <ArtefactView />
    </div>
  )
}

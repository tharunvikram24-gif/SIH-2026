import { useSystem } from '../store/useSystem'
import { Panel } from './Panel'
import { Chip } from './Chip'
import { TerminalSquare } from 'lucide-react'

const color: Record<string, string> = { pr: 'text-grn', cm: 'text-faint', ok: 'text-grn', kw: 'text-violet', st: 'text-amber' }

export function SandboxView() {
  const lines = useSystem((s) => s.sandbox)
  return (
    <Panel icon={<TerminalSquare size={15} className="text-amber" />} title="Sandboxed Execution" action={<Chip tone="ok">NO-NETWORK</Chip>}>
      <div className="rounded-[9px] border border-edge bg-[#060A0E] overflow-hidden font-mono text-[11.5px]">
        <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-edge text-faint text-[10px]">
          <span className="flex gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-red inline-block" /><i className="w-2.5 h-2.5 rounded-full bg-amber inline-block" /><i className="w-2.5 h-2.5 rounded-full bg-grn inline-block" /></span>
          gvisor · rootless · /work (tmpfs)
        </div>
        <div className="px-3 py-2.5 max-h-[200px] overflow-y-auto leading-relaxed">
          {lines.map((l, i) => <div key={i} className={'whitespace-pre-wrap break-words ' + (l.k ? color[l.k] : '')}>{l.t || '\u00a0'}</div>)}
          <span className="cursor" />
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap mt-2.5">
        <Chip>CPU 2 cores</Chip><Chip>MEM 2 GiB</Chip><Chip>TIMEOUT 10 s</Chip><Chip>EGRESS deny</Chip>
      </div>
    </Panel>
  )
}

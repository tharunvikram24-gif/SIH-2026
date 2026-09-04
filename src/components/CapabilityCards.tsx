import { Card } from './ui'
import { MessageCircle, FileText, Bot, ScanText } from 'lucide-react'

const caps = [
  { icon: MessageCircle, title: 'Ask Anything', desc: 'Natural-language Q&A answered by a local open-weight LLM.', tone: 'text-cyan' },
  { icon: FileText, title: 'Analyze Documents', desc: 'RAG over your indexed reports, logs and standards.', tone: 'text-tealb' },
  { icon: Bot, title: 'Agent Tasks', desc: 'Delegate multi-step work: route, retrieve, execute, compose.', tone: 'text-amber' },
  { icon: ScanText, title: 'Vision / OCR', desc: 'Read scanned notes and P&IDs entirely on-device.', tone: 'text-cyan' },
]

export function CapabilityCards({ onPick }: { onPick: (p: string) => void }) {
  const pick = ['Ask Sovereign AI a question about the refinery.', 'Analyze the uploaded refinery inspection report.', 'Identify equipment requiring immediate attention.', 'Analyze this scanned handwritten note.']
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {caps.map((c, i) => (
        <button key={c.title} onClick={() => onPick(pick[i])} className="text-left">
          <Card className="p-4 h-full transition hover:border-cyan/50">
            <c.icon size={20} className={c.tone} />
            <div className="font-semibold text-[14px] mt-2.5">{c.title}</div>
            <div className="text-[12.5px] text-mut mt-1 leading-relaxed">{c.desc}</div>
          </Card>
        </button>
      ))}
    </div>
  )
}

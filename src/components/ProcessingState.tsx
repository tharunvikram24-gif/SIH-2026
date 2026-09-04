import { useStore } from '../store'
import { PROCESSING_STAGES } from '../mock'
import { Card } from './ui'
import { Check, AlertTriangle } from 'lucide-react'

// Task-mode progress indicator: Upload → Analyzing → Validating → Generating Result.
// Purely a view over store.processingStage / processingError — set by runAgent()
// in mock.ts. Renders nothing for plain chat (processingStage stays null), so the
// default chatbox flow is visually unchanged.
export function ProcessingState() {
  const stage = useStore((s) => s.processingStage)
  const error = useStore((s) => s.processingError)

  if (error) {
    return (
      <Card className="p-3.5 border-red/40 bg-red/5 flex items-center gap-2.5 fadeup">
        <AlertTriangle size={16} className="text-red shrink-0" />
        <div className="text-[12.5px] text-ink">{error} <span className="text-mut">You can retry the request.</span></div>
      </Card>
    )
  }
  if (!stage) return null

  const idx = PROCESSING_STAGES.indexOf(stage as (typeof PROCESSING_STAGES)[number])

  return (
    <Card className="p-3.5 fadeup">
      <div className="flex items-center gap-1">
        {PROCESSING_STAGES.map((s, i) => {
          const done = i < idx
          const active = i === idx
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={'grid place-items-center w-5 h-5 rounded-full border shrink-0 ' +
                  (done ? 'border-grn bg-grn/10' : active ? 'border-teal' : 'border-edge2')}>
                  {done ? <Check size={11} className="text-grn" /> : active ? <span className="spin" /> : <span className="w-1.5 h-1.5 rounded-full bg-faint" />}
                </span>
                <span className={'text-[12px] font-medium whitespace-nowrap ' + (done || active ? 'text-ink' : 'text-faint')}>{s}</span>
              </div>
              {i < PROCESSING_STAGES.length - 1 && <span className={'mx-2 h-px flex-1 ' + (done ? 'bg-grn/50' : 'bg-edge2')} />}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

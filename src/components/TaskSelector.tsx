import { useStore } from '../store'
import { TASKS } from '../mock'
import { MessagesSquare, ScanLine, ShieldAlert, Calculator, Presentation, FileQuestion } from 'lucide-react'

const ICONS: Record<string, any> = {
  pid: ScanLine, corrosion: ShieldAlert, calc: Calculator, report: Presentation, docqa: FileQuestion,
}

// Compact task/feature selector. Does not replace the chatbox — it only tags the
// next submitted prompt with a TaskType so runAgent() can attach a structured
// result. Selecting "General Chat" (null) reproduces the original, unmodified flow.
export function TaskSelector() {
  const selectedTask = useStore((s) => s.selectedTask)
  const setSelectedTask = useStore((s) => s.setSelectedTask)

  const pill = (active: boolean) =>
    'shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors whitespace-nowrap ' +
    (active ? 'bg-teal text-white border-transparent' : 'border-edge bg-panel text-mut hover:text-ink hover:border-edge2')

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-0.5 px-0.5" role="tablist" aria-label="Task type">
      <button type="button" role="tab" aria-selected={selectedTask === null} onClick={() => setSelectedTask(null)} className={pill(selectedTask === null)}>
        <MessagesSquare size={13} /> General Chat
      </button>
      {TASKS.map((t) => {
        const Icon = ICONS[t.key]
        const active = selectedTask === t.key
        return (
          <button key={t.key} type="button" role="tab" aria-selected={active}
            onClick={() => setSelectedTask(active ? null : t.key)} className={pill(active)}>
            <Icon size={13} /> {t.label}
          </button>
        )
      })}
    </div>
  )
}

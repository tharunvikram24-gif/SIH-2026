import { SAMPLE_PROMPTS } from '../mock'
import { Sparkles } from 'lucide-react'

export function SamplePrompts({ onPick }: { onPick: (p: string) => void }) {
  return (
    <div>
      <div className="klbl mb-2 flex items-center gap-1.5"><Sparkles size={12} className="text-amber" /> Try a task</div>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_PROMPTS.map((p) => (
          <button key={p} onClick={() => onPick(p)}
            className="rounded-md border border-edge bg-beige hover:border-cyan/50 hover:bg-raise px-3 py-2 text-[12.5px] text-mut hover:text-ink transition text-left">
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

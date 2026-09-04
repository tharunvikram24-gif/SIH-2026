import { useState } from 'react'
import type { Msg } from '../types'
import { Chip, StatusDot } from './ui'
import { ResultCard } from './ResultCard'
import { Copy, RefreshCw, FileSearch, Download, ChevronDown, Hexagon } from 'lucide-react'

export function Message({ m, onRegenerate }: { m: Msg; onRegenerate?: () => void }) {
  const [showSrc, setShowSrc] = useState(false)
  if (m.role === 'user') {
    return (
      <div className="fadeup flex justify-end">
        <div className="max-w-[78%] rounded-md rounded-tr-sm border border-edge bg-raise px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap">{m.text}</div>
      </div>
    )
  }
  return (
    <div className="fadeup flex gap-3">
      <span className="grid place-items-center w-8 h-8 rounded-md border border-edge2 bg-beige shrink-0"><Hexagon size={16} className="text-teal" /></span>
      <div className="min-w-0 max-w-[82%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12.5px] font-semibold">Sovereign AI</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-grn"><StatusDot tone="grn" /> Local Model</span>
        </div>
        <div className="rounded-md rounded-tl-sm border border-edge bg-panel px-4 py-3 font-serif text-[15px] leading-[1.7] whitespace-pre-wrap">
          {m.text}{m.streaming && <span className="caret" />}
        </div>

        {m.sources && m.sources.length > 0 && (
          <div className="mt-2">
            <button onClick={() => setShowSrc(!showSrc)} className="inline-flex items-center gap-1.5 text-[12px] text-teal hover:text-tealb">
              <FileSearch size={13} /> Sources ({m.sources.length}) <ChevronDown size={13} className={'transition ' + (showSrc ? 'rotate-180' : '')} />
            </button>
            {showSrc && (
              <div className="mt-2 flex flex-col gap-1.5">
                {m.sources.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-md border border-edge bg-beige px-3 py-2 text-[12px]">
                    <FileSearch size={13} className="text-faint" />
                    <span className="text-ink">{s.doc}</span>
                    <span className="text-faint">— Page {s.page}</span>
                    <span className="ml-auto font-mono text-[11px] text-grn">{s.rel}% relevance</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!m.streaming && (
          <div className="mt-2 flex items-center gap-1 text-faint">
            <Act icon={Copy} label="Copy" onClick={() => navigator.clipboard?.writeText(m.text)} />
            <Act icon={RefreshCw} label="Regenerate" onClick={onRegenerate} />
            <Act icon={FileSearch} label="Sources" onClick={() => setShowSrc(true)} />
            <Act icon={Download} label="Download" onClick={() => {
              const b = new Blob([m.text], { type: 'text/plain' }); const u = URL.createObjectURL(b)
              const a = document.createElement('a'); a.href = u; a.download = 'sovereign_ai_response.txt'; a.click(); URL.revokeObjectURL(u)
            }} />
          </div>
        )}

        {!m.streaming && m.result && <ResultCard result={m.result} taskType={m.taskType} />}
      </div>
    </div>
  )
}

function Act({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11.5px] hover:text-ink hover:bg-raise transition">
      <Icon size={13} /> {label}
    </button>
  )
}

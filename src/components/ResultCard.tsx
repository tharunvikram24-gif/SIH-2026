import type { ReactNode } from 'react'
import type { StructuredResult, TaskType } from '../types'
import { Card, ConfidenceBadge, Chip } from './ui'
import { TASKS } from '../mock'
import { FileSearch, CheckCircle2, AlertTriangle, Download, Sigma } from 'lucide-react'

// Renders under the chat answer when a message carries a StructuredResult
// (task-mode runs only — see mock.ts buildStructuredResult). Plain chat messages
// have no `result`, so Message.tsx never mounts this and existing bubbles are
// pixel-unchanged.
export function ResultCard({ result, taskType }: { result: StructuredResult; taskType?: TaskType }) {
  const taskLabel = taskType ? TASKS.find((t) => t.key === taskType)?.label : undefined

  const download = () => {
    if (!result.downloadable) return
    const b = new Blob([result.downloadable.content], { type: result.downloadable.mime })
    const u = URL.createObjectURL(b)
    const a = document.createElement('a'); a.href = u; a.download = result.downloadable.filename; a.click(); URL.revokeObjectURL(u)
  }

  return (
    <Card className="mt-2.5 p-4 fadeup">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {taskLabel && <Chip tone="mut">{taskLabel}</Chip>}
        <ConfidenceBadge level={result.confidence} />
      </div>

      <Section label="Summary"><p className="text-[13.5px] leading-relaxed text-ink">{result.summary}</p></Section>

      {result.calculation && <CalculationSection calc={result.calculation} />}

      {!result.calculation && result.extractedData && result.extractedData.length > 0 && (
        <Section label="Extracted Data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.extractedData.map((kv) => (
              <div key={kv.label} className="flex items-center justify-between gap-2 rounded-md border border-edge bg-beige px-3 py-2 text-[12.5px]">
                <span className="text-mut">{kv.label}</span><span className="font-mono text-ink text-right">{kv.value}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {result.insights && result.insights.length > 0 && (
        <Section label="Insights">
          <ul className="flex flex-col gap-1.5">
            {result.insights.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-ink"><CheckCircle2 size={14} className="text-grn shrink-0 mt-0.5" /> {s}</li>
            ))}
          </ul>
        </Section>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <Section label="Warnings">
          <ul className="flex flex-col gap-1.5">
            {result.warnings.map((s, i) => (
              <li key={i} className="flex items-start gap-2 rounded-md border border-amber/30 bg-amber/10 px-3 py-2 text-[12.5px] text-ink">
                <AlertTriangle size={14} className="text-amber shrink-0 mt-0.5" /> {s}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {result.citations && result.citations.length > 0 && (
        <Section label="Source / Document">
          <div className="flex flex-col gap-1.5">
            {result.citations.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-md border border-edge2 bg-raise px-3 py-2 text-[12px]">
                <FileSearch size={13} className="text-cyan shrink-0" />
                <span className="text-ink truncate">{c.doc}</span>
                {c.page != null && <span className="text-faint shrink-0">— Page {c.page}</span>}
                {c.chunk && <span className="text-faint shrink-0">— {c.chunk}</span>}
                <span className="ml-auto font-mono text-[11px] text-grn shrink-0">{c.confidence}% confidence</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {result.downloadable && (
        <div className="mt-1 pt-3 border-t border-edge flex justify-end">
          <button onClick={download} className="btn btn-primary">
            <Download size={15} /> Download Result
          </button>
        </div>
      )}
    </Card>
  )
}

function CalculationSection({ calc }: { calc: NonNullable<StructuredResult['calculation']> }) {
  return (
    <>
      <Section label="Inputs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {calc.inputs.map((kv) => (
            <div key={kv.label} className="flex items-center justify-between gap-2 rounded-md border border-edge bg-beige px-3 py-2 text-[12.5px]">
              <span className="text-mut">{kv.label}</span><span className="font-mono text-ink text-right">{kv.value}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section label="Formula">
        <div className="flex items-center gap-2 rounded-md border border-edge2 bg-raise px-3 py-2.5 font-mono text-[13px] text-ink">
          <Sigma size={14} className="text-cyan shrink-0" /> {calc.formula}
        </div>
      </Section>
      <Section label="Calculation">
        <div className="flex flex-col gap-1">
          {calc.steps.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-2 px-3 py-1.5 text-[12.5px] border-b border-edge last:border-b-0">
              <span className="text-mut">{s.label}</span><span className="font-mono text-ink">{s.value}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section label="Final Result">
        <div className="flex items-center justify-between rounded-md border border-teal/40 bg-teal/10 px-3.5 py-2.5">
          <span className="text-[13px] font-medium text-ink">{calc.result.label}</span>
          <span className="font-mono font-bold text-[16px] text-tealb">{calc.result.value}</span>
        </div>
      </Section>
    </>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="klbl mb-1.5">{label}</div>
      {children}
    </div>
  )
}

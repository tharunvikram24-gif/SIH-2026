// Mock "agent engine": drives the store to simulate an on-prem agentic run.
// Swap runAgent() for a real SSE/WebSocket client later; keep the same store calls.
import { useStore, baseSteps } from './store'
import type { Source, TaskType, StructuredResult, ConfidenceLevel, Citation } from './types'

const S = () => useStore.getState()
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(80, ms) : ms))

interface Reply { text: string; sources?: Source[]; ocr?: boolean; tool?: boolean; task?: string; agent?: string }

// --- Task/feature selector metadata (labels only — backend contract unchanged) ---
export const TASKS: { key: TaskType; label: string; short: string }[] = [
  { key: 'pid', label: 'P&ID Analysis', short: 'P&ID' },
  { key: 'corrosion', label: 'Corrosion Assessment', short: 'Corrosion' },
  { key: 'calc', label: 'Engineering Calculations', short: 'Calc' },
  { key: 'report', label: 'Report / MOM / PPT', short: 'Report' },
  { key: 'docqa', label: 'Document Q&A', short: 'Doc Q&A' },
]

export const PROCESSING_STAGES = ['Upload', 'Analyzing', 'Validating', 'Generating Result'] as const

const toCitations = (sources?: Source[]): Citation[] | undefined =>
  sources?.map((s) => ({ doc: s.doc, page: s.page, confidence: s.rel }))

const confidenceFromRel = (sources?: Source[]): ConfidenceLevel => {
  const max = Math.max(0, ...(sources?.map((s) => s.rel) ?? []))
  return max >= 90 ? 'high' : max >= 75 ? 'review' : 'low'
}

const asFile = (filename: string, lines: string[]): { filename: string; content: string; mime: string } => ({
  filename, content: lines.join('\n'), mime: 'text/plain',
})

// Builds the "Structured Result" shown under the chat answer for a selected task.
// Illustrative mock data — replace with real backend fields when wired up; the
// StructuredResult shape is the contract the UI already renders against.
function buildStructuredResult(taskType: TaskType, base: Reply): StructuredResult {
  switch (taskType) {
    case 'pid':
      return {
        summary: 'Parsed the uploaded P&ID locally (OCR + symbol detection). 42 tagged instruments identified across 1 sheet.',
        extractedData: [
          { label: 'Sheet', value: 'PID_CDU2.png' },
          { label: 'Instruments detected', value: '42' },
          { label: 'Valves', value: '18' },
          { label: 'Line classes', value: '6"-P-114, 4"-P-108' },
        ],
        insights: [
          'Relief valve RV-07 tag present but no linked set-pressure annotation — verify against the instrument index.',
          'Line 6"-P-114 crosses an insulation boundary flagged in a prior corrosion report — cross-reference recommended.',
        ],
        warnings: ['2 instrument tags could not be resolved against the equipment index (low OCR confidence on faded labels).'],
        confidence: 'review',
        citations: toCitations(base.sources),
        downloadable: asFile('pid_cdu2_analysis.txt', [
          'P&ID ANALYSIS — PID_CDU2.png', '', 'Instruments detected: 42', 'Valves: 18',
          'Line classes: 6"-P-114, 4"-P-108', '', 'Findings:', '- RV-07 missing set-pressure annotation',
          '- 2 tags unresolved (low OCR confidence)',
        ]),
      }
    case 'corrosion':
      return {
        summary: 'Corrosion assessment for Heat Exchanger E-210 completed against latest UT readings and MRPL-STD-14 thresholds.',
        extractedData: [
          { label: 'Component', value: 'E-210 shell' },
          { label: 'Measured thickness', value: '6.1 mm' },
          { label: 'Minimum required', value: '7.0 mm' },
          { label: 'Corrosion rate', value: '0.18 mm/yr' },
        ],
        insights: [
          'Wall thickness is below the retirement limit — remaining life is effectively 0 years at the current corrosion rate.',
          'Comparable thinning trend observed on line 6"-P-114 (CUI flagged in a prior report).',
        ],
        warnings: ['Component is below minimum retirement thickness. Isolate and schedule UT re-inspection before further service.'],
        confidence: 'review',
        citations: toCitations(base.sources),
        downloadable: asFile('e210_corrosion_assessment.txt', [
          'CORROSION ASSESSMENT — Heat Exchanger E-210', '', 'Measured thickness: 6.1 mm',
          'Minimum required: 7.0 mm', 'Corrosion rate: 0.18 mm/yr', '',
          'Recommendation: isolate and schedule UT re-inspection.',
        ]),
      }
    case 'calc':
      return {
        summary: 'Minimum required wall thickness calculated per ASME B31.3 for a design pressure of 10.5 bar.',
        confidence: 'high',
        calculation: {
          inputs: [
            { label: 'Design pressure (P)', value: '10.5 bar' },
            { label: 'Outside diameter (D)', value: '168.3 mm' },
            { label: 'Allowable stress (S)', value: '137.9 MPa' },
            { label: 'Weld joint efficiency (E)', value: '1.0' },
            { label: 'Corrosion allowance (CA)', value: '1.5 mm' },
          ],
          formula: 't = (P × D) / (2 × (S × E + P × Y)) + CA',
          steps: [
            { label: 'P × D', value: '10.5 × 168.3 = 1767.15' },
            { label: 'S × E + P × Y', value: '137.9 × 1.0 + 10.5 × 0.4 = 142.1' },
            { label: '2 × (S×E + P×Y)', value: '284.2' },
            { label: 't (before CA)', value: '1767.15 / 284.2 = 6.22 mm' },
          ],
          result: { label: 'Minimum required thickness', value: '7.72 mm (incl. CA)' },
        },
        warnings: ['Verify the allowable stress value against the current material certificate before final sign-off.'],
        downloadable: asFile('wall_thickness_calc.txt', [
          'ENGINEERING CALCULATION — Minimum Wall Thickness (ASME B31.3)', '',
          'Formula: t = (P x D) / (2 x (S x E + P x Y)) + CA', '',
          'P=10.5 bar, D=168.3 mm, S=137.9 MPa, E=1.0, CA=1.5 mm', '', 'Result: 7.72 mm',
        ]),
      }
    case 'report':
      return {
        summary: 'Draft Minutes of Meeting generated from the uploaded discussion notes and inspection findings.',
        extractedData: [
          { label: 'Meeting', value: 'CDU-2 Turnaround Review' },
          { label: 'Attendees', value: '6 (extracted from notes)' },
          { label: 'Action items', value: '4' },
        ],
        insights: ['3 of 4 action items map to open work orders already present in the maintenance log.'],
        warnings: ['1 attendee name could not be confidently matched to the employee directory.'],
        confidence: 'review',
        citations: toCitations(base.sources),
        downloadable: asFile('mom_cdu2_turnaround.txt', [
          'MINUTES OF MEETING — CDU-2 Turnaround Review', '', 'Attendees: 6', 'Action items: 4', '',
          base.text,
        ]),
      }
    case 'docqa':
    default:
      return {
        summary: base.text,
        confidence: confidenceFromRel(base.sources),
        citations: toCitations(base.sources),
        downloadable: asFile('document_qa_answer.txt', [base.text]),
      }
  }
}

function replyFor(prompt: string): Reply {
  const p = prompt.toLowerCase()
  if (p.includes('immediate') || p.includes('attention'))
    return {
      task: 'Document Analysis', agent: 'Document Agent', tool: true,
      text: 'Equipment requiring immediate attention (ranked by risk):\n\n• Heat Exchanger E-210 — measured wall thickness 6.1 mm vs 7.0 mm minimum. Below retirement limit → isolate and schedule UT re-inspection this week.\n• Relief Valve RV-07 — last pop-test overdue by 40 days. Recertify before next turnaround.\n• Pump P-3B — bearing vibration trending upward (4.1 → 6.8 mm/s over 3 weeks). Plan bearing replacement.\n\nAll other 21 items are within acceptance limits. A work-order summary can be exported on request.',
      sources: [{ doc: 'inspection_report.pdf', page: 12, rel: 94 }, { doc: 'maintenance_log.csv', page: 1, rel: 88 }, { doc: 'MRPL_STD_14.docx', page: 8, rel: 83 }],
    }
  if (p.includes('summari') && p.includes('maintenance'))
    return {
      task: 'Summarization', agent: 'Document Agent',
      text: 'Maintenance summary (last cycle):\n\n• 18 work orders raised, 15 closed, 3 open.\n• Dominant failure mode: seal/gasket leakage (7 of 18).\n• Mean time-to-close: 2.3 days.\n• Overdue: RV-07 recertification, E-210 UT re-inspection.\n\nRecommendation: prioritise the two overdue safety-critical items before the next planned shutdown.',
      sources: [{ doc: 'maintenance_log.csv', page: 1, rel: 91 }, { doc: 'inspection_report.pdf', page: 8, rel: 79 }],
    }
  if (p.includes('csv') || p.includes('generate a maintenance'))
    return {
      task: 'Data Analysis', agent: 'Coding Agent', tool: true,
      text: 'Parsed maintenance_log.csv (1,204 rows) in the sandbox and generated a summary:\n\n• Total downtime hours: 214.5\n• Top asset by downtime: Compressor K-101 (38.2 h)\n• Cost driver: unplanned electrical trips (31% of events)\n\nThe grouped table and a monthly trend were computed locally with pandas in the no-network sandbox. Exit 0.',
      sources: [{ doc: 'maintenance_log.csv', page: 1, rel: 96 }],
    }
  if (p.includes('scanned') || p.includes('handwritten') || p.includes('vision') || p.includes('p&id') || p.includes('pid'))
    return {
      task: 'Vision / OCR', agent: 'Vision Agent', ocr: true,
      text: 'OCR of the scanned note completed on-device (no cloud vision API used):\n\nExtracted: "Unit CDU-2, PV-114 — hydrotest 9.8 bar, held 30 min, no leaks. Insp: R. Nayak, 14-02." \n\nCross-checked against MRPL-STD-14: the 9.8 bar test pressure is within the 8.0–10.5 bar acceptance band → PASS. Fields written to the inspection record.',
      sources: [{ doc: 'PID_CDU2.png', page: 1, rel: 90 }, { doc: 'MRPL_STD_14.docx', page: 8, rel: 86 }],
    }
  if (p.includes('compare'))
    return {
      task: 'Document Analysis', agent: 'Document Agent',
      text: 'Comparison of the two technical documents:\n\n• Scope: Report A covers CDU-2; Report B covers CDU-1 — same equipment class, different train.\n• Divergence: B flags corrosion under insulation on line 6"-P-114; A does not.\n• Common action: both recommend RV recertification.\n\nNet: treat the CUI finding in B as train-specific; carry the shared RV action into both plans.',
      sources: [{ doc: 'inspection_report.pdf', page: 12, rel: 89 }, { doc: 'MRPL_STD_14.docx', page: 3, rel: 77 }],
    }
  // default: analyze the inspection report
  return {
    task: 'Document Analysis', agent: 'Document Agent', ocr: true, tool: true,
    text: 'I analysed the uploaded refinery inspection report (24 pages) locally.\n\nSummary of findings:\n• Overall condition: acceptable, with 3 items outside limits.\n• Pressure vessel PV-114 — hydrotest 9.8 bar, within MRPL-STD-14 (PASS).\n• Heat exchanger E-210 — wall thinning below minimum; needs UT re-inspection.\n• Relief valve RV-07 — recertification overdue.\n\nAsk me to "identify equipment requiring immediate attention" for a prioritised action list.',
    sources: [{ doc: 'inspection_report.pdf', page: 12, rel: 94 }, { doc: 'maintenance_log.csv', page: 1, rel: 87 }, { doc: 'MRPL_STD_14.docx', page: 8, rel: 82 }],
  }
}

// taskType is optional and additive: calling runAgent(prompt) behaves exactly as
// before (plain chat, no structured result). Passing a TaskType layers on the
// Upload → Analyzing → Validating → Generating Result stage tracker + a
// StructuredResult attached to the final message, without altering the
// existing router/agent/rag/ocr/tool/final step pipeline or its store contract.
export async function runAgent(prompt: string, taskType: TaskType | null = null) {
  const st = S()
  if (st.running) return
  st.addMessage({ role: 'user', text: prompt, taskType: taskType ?? undefined })
  st.setRunning(true)
  st.setSteps(baseSteps())
  st.resetNet()
  st.setProcessingError(null)
  const r = replyFor(prompt)
  st.setRouter({ task: r.task || 'Document Analysis', model: r.agent === 'Coding Agent' ? 'Qwen2.5-Coder 14B' : r.agent === 'Vision Agent' ? 'LLaVA-1.6 13B' : 'Local LLM 8B', status: 'running', active: true })

  try {
    if (taskType) { st.setProcessingStage(PROCESSING_STAGES[0]); await wait(300); st.incNet(1) }

    const go = async (key: string, ms: number, audit?: [string, string], skip?: boolean) => {
      if (skip) return
      st.patchStep(key, 'active'); await wait(ms)
      st.patchStep(key, 'done'); st.incNet(1)
      if (audit) st.addAudit(audit[0], audit[1])
    }

    if (taskType) st.setProcessingStage(PROCESSING_STAGES[1])
    await go('router', 650, ['Query classified', 'Router'])
    await go('agent', 500, ['Agent selected: ' + (r.agent || 'Document Agent'), 'Router'])
    await go('rag', 850, ['Retrieval started', 'RAG'])
    await go('ocr', r.ocr ? 800 : 250, r.ocr ? ['OCR completed', 'Vision'] : undefined, !r.ocr)
    await go('tool', r.tool ? 750 : 250, r.tool ? ['Tool executed', 'Sandbox'] : undefined, !r.tool)

    if (taskType) { st.setProcessingStage(PROCESSING_STAGES[2]); await wait(350) }

    // final: stream the response
    st.patchStep('final', 'active')
    if (taskType) st.setProcessingStage(PROCESSING_STAGES[3])
    const aiId = st.addMessage({ role: 'ai', text: '', streaming: true, taskType: taskType ?? undefined })
    const words = r.text.split(' ')
    let acc = ''
    for (let i = 0; i < words.length; i++) {
      acc += (i ? ' ' : '') + words[i]
      st.patchMessage(aiId, { text: acc })
      await wait(reduced ? 0 : 24)
    }
    const result = taskType ? buildStructuredResult(taskType, r) : undefined
    st.patchMessage(aiId, { streaming: false, sources: r.sources, result })
    st.patchStep('final', 'done')
    st.addAudit('Response generated', 'Local LLM')
    st.setRouter({ status: 'done', active: false })
  } catch (err) {
    st.setProcessingError(err instanceof Error ? err.message : 'Generation failed — please retry.')
  } finally {
    if (taskType) st.setProcessingStage(null)
    st.setRunning(false)
  }
}

export const SAMPLE_PROMPTS = [
  'Analyze the uploaded refinery inspection report.',
  'Identify equipment requiring immediate attention.',
  'Summarize maintenance issues.',
  'Compare these two technical documents.',
  'Analyze this scanned handwritten note.',
  'Generate a maintenance summary from this CSV.',
]

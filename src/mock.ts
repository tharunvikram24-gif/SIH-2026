// Mock "agent engine": drives the store to simulate an on-prem agentic run.
// Swap runAgent() for a real SSE/WebSocket client later; keep the same store calls.
import { useStore, baseSteps } from './store'
import type { Source } from './types'

const S = () => useStore.getState()
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(80, ms) : ms))

interface Reply { text: string; sources?: Source[]; ocr?: boolean; tool?: boolean; task?: string; agent?: string }

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

export async function runAgent(prompt: string) {
  const st = S()
  if (st.running) return
  st.addMessage({ role: 'user', text: prompt })
  st.setRunning(true)
  st.setSteps(baseSteps())
  st.resetNet()
  const r = replyFor(prompt)
  st.setRouter({ task: r.task || 'Document Analysis', model: r.agent === 'Coding Agent' ? 'Qwen2.5-Coder 14B' : r.agent === 'Vision Agent' ? 'LLaVA-1.6 13B' : 'Local LLM 8B', status: 'running', active: true })

  const go = async (key: string, ms: number, audit?: [string, string], skip?: boolean) => {
    if (skip) return
    st.patchStep(key, 'active'); await wait(ms)
    st.patchStep(key, 'done'); st.incNet(1)
    if (audit) st.addAudit(audit[0], audit[1])
  }

  await go('router', 650, ['Query classified', 'Router'])
  await go('agent', 500, ['Agent selected: ' + (r.agent || 'Document Agent'), 'Router'])
  await go('rag', 850, ['Retrieval started', 'RAG'])
  await go('ocr', r.ocr ? 800 : 250, r.ocr ? ['OCR completed', 'Vision'] : undefined, !r.ocr)
  await go('tool', r.tool ? 750 : 250, r.tool ? ['Tool executed', 'Sandbox'] : undefined, !r.tool)

  // final: stream the response
  st.patchStep('final', 'active')
  const aiId = st.addMessage({ role: 'ai', text: '', streaming: true })
  const words = r.text.split(' ')
  let acc = ''
  for (let i = 0; i < words.length; i++) {
    acc += (i ? ' ' : '') + words[i]
    st.patchMessage(aiId, { text: acc })
    await wait(reduced ? 0 : 24)
  }
  st.patchMessage(aiId, { streaming: false, sources: r.sources })
  st.patchStep('final', 'done')
  st.addAudit('Response generated', 'Local LLM')
  st.setRouter({ status: 'done', active: false })
  st.setRunning(false)
}

export const SAMPLE_PROMPTS = [
  'Analyze the uploaded refinery inspection report.',
  'Identify equipment requiring immediate attention.',
  'Summarize maintenance issues.',
  'Compare these two technical documents.',
  'Analyze this scanned handwritten note.',
  'Generate a maintenance summary from this CSV.',
]

/**
 * mockEngine — the demo "brain".
 * It scripts a realistic agent run and drives the Zustand store over time.
 * TO GO LIVE: delete the scripted flows below and, in start(), open a
 * WebSocket/SSE to your FastAPI agent. Map each server event to the same
 * store actions used here (pushStep/updateStep/pushEgress/pushAudit/setRoute/
 * setActiveModel/setSandbox/setRag/setArtefact). The UI needs no other change.
 */
import { useSystem } from '../store/useSystem'
import { modelById } from '../data/models'
import { rnd } from './format'

const S = () => useSystem.getState()
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches

// cancellable + pausable + speed-scaled sleep
function wait(ms: number): Promise<void> {
  return new Promise((res, rej) => {
    const my = S().token
    let left = ms
    const tick = () => {
      if (my !== S().token) return rej(new Error('cancel'))
      if (S().paused) return setTimeout(tick, 80)
      left -= 70 * S().speed
      if (left <= 0) return res()
      setTimeout(tick, 70)
    }
    setTimeout(tick, 70)
  })
}

let started = false
export function start() {
  if (started) return
  started = true
  // telemetry loop — GPU / throughput ease toward target while a model is active
  setInterval(() => {
    const st = S(); const active = st.running && !st.paused && !!st.activeModel
    const tGpu = active ? rnd(58, 92) : 0
    const tTps = active ? (st.activeModel === 'code' ? rnd(40, 64) : rnd(26, 48)) : 0
    let gpu = st.gpu + (tGpu - st.gpu) * 0.3
    let tps = st.tps + (tTps - st.tps) * 0.3
    if (!active && gpu < 0.5) gpu = 0
    if (!active && tps < 0.5) tps = 0
    S().setMetrics({ gpu, tps })
  }, 220)
  // network sparkline — internal loopback traffic while active, external stays flat at 0
  setInterval(() => {
    const st = S(); const active = st.running && !st.paused && !!st.activeModel
    S().pushNet(active ? rnd(3, 9) : rnd(0, 1.2), 0)
  }, 600)
}

export const setSpeed = (n: number) => S().setRun({ speed: n })
export const reset = () => S().reset()
export function togglePause() {
  const st = S()
  if (!st.running) return
  S().setRun({ paused: !st.paused })
}

async function typeTerminal(lines: { t: string; k?: any }[]) {
  const acc: any[] = []
  S().setSandbox([])
  for (const l of lines) {
    acc.push(l); S().setSandbox([...acc]); await wait(reduced ? 60 : 240)
  }
}

/* ---------------- cinematic mission ---------------- */
export async function runMission() {
  reset()
  const st = S()
  S().setRun({ running: true, paused: false, t0: Date.now(), tlState: 'running', speed: st.speed })
  try {
    S().pushEgress('127.0.0.1', 'fastapi :8000 /agent/session start', 'ALLOW')
    let id = S().pushStep('Task received — inspection_report_A-12.pdf', 'ingest', 'Scanned PDF · 4 pages · 2.1 MB · dropped into local watch folder /intake')
    S().pushAudit('session.start')
    await wait(700); S().updateStep(id, { status: 'done', dur: '0.3s' })

    S().setRoute({ state: 'classifying…' })
    id = S().pushStep('Classify & route task', 'router', 'Local classifier (Llama-3.1 8B) inspecting payload…')
    await wait(900)
    routeTo('inspection_report_A-12.pdf', 'document · vision', 'doc',
      'Detected a <b>scanned, image-only PDF</b> with tabular fields → class <b>document/vision</b>. Dispatched to <b>LLaVA-1.6 13B</b> (best doc-VQA score of the resident models). Router confidence 0.94.')
    S().addToast({ kind: 'route', title: 'Routed → LLaVA-1.6 13B', desc: 'document/vision · confidence 0.94' })
    S().pushAudit('route → doc', 'doc'); S().pushEgress('127.0.0.1', 'ollama :11434 /api/generate', 'ALLOW')
    S().updateStep(id, { status: 'done', dur: '0.9s', detail: 'class = document/vision · model = LLaVA-1.6 13B · conf 0.94' })

    id = S().pushStep('Load model into GPU', 'runtime', 'Mapping LLaVA-1.6 13B (Q5_K_M) from /models → VRAM')
    for (let v = 0; v <= 14; v += 3.5) { S().setActiveModel('doc', v); await wait(180) }
    S().updateStep(id, { status: 'done', dur: '1.4s', detail: 'resident 14.0 GB · 2×A100 40GB · offline weights, sha256 verified' })
    S().pushAudit('model.load', 'doc')

    id = S().pushStep('OCR & field extraction', 'vision.ocr', '')
    for (let p = 1; p <= 4; p++) { S().pushEgress('127.0.0.1', 'ollama :11434 /api/generate (vision)', 'ALLOW'); S().updateStep(id, { detail: `reading page ${p} / 4 …` }); await wait(520) }
    const fields = ['unit', 'date', 'insp', 'press', 'thk', 'res']
    for (const f of fields) { S().hitField(f); await wait(230) }
    S().setScanRead(true)
    S().updateStep(id, { status: 'done', dur: '3.6s', detail: 'extracted 6 fields → Unit=CDU-2·PV-114 · Pressure=9.8 bar · Thk=11.4mm · Result=No defects' })
    S().pushAudit('ocr.extract', 'doc')

    id = S().pushStep('Retrieve acceptance standard', 'rag.query', 'embedding query via nomic-embed-text → FAISS (local)')
    S().pushEgress('127.0.0.1', 'faiss :7001 /search topk=3', 'ALLOW'); await wait(900)
    S().setRag([
      { t: 'MRPL-STD-14 — Pressure test acceptance', s: 'standards/mrpl_std_14.pdf · p.7', sc: '0.91' },
      { t: 'ASME VIII Div.1 — UG-99 hydrostatic test', s: 'public/asme_viii.pdf · p.212', sc: '0.86' },
      { t: 'PV-114 previous inspection (2024)', s: 'history/pv114_2024.pdf · p.1', sc: '0.79' },
    ])
    S().updateStep(id, { status: 'done', dur: '0.9s', detail: 'top match MRPL-STD-14 → acceptable test range 8.0–10.5 bar' })
    S().pushAudit('rag.query', 'embed')

    id = S().pushStep('Validate reading against standard', 'reason', '9.8 bar vs [8.0, 10.5] — delegating numeric check to code model for a provable result')
    await wait(1000); S().updateStep(id, { status: 'done', dur: '1.0s', detail: 'numeric check delegated → routing sub-task to code model' })

    S().setRoute({ state: 're-routing…' })
    routeTo('check_pressure.py', 'code', 'code',
      'Sub-task is a deterministic numeric assertion → re-classified as <b>code</b>. Hot-swapped to <b>Qwen2.5-Coder 14B</b> so the verdict comes from executed code, not a guess.')
    S().addToast({ kind: 'route', title: 'Hot-swap → Qwen2.5-Coder 14B', desc: 'document → code · mid-run model switch' })
    S().pushAudit('route → code', 'code'); S().setActiveModel('code', 18); await wait(500)

    id = S().pushStep('Execute check in sandbox', 'sandbox.python', 'gvisor · no-network · CPU 2 · MEM 2G · timeout 10s')
    await typeTerminal([
      { t: '# generated by Qwen2.5-Coder — runs in isolated sandbox', k: 'cm' },
      { t: 'def check(p, lo=8.0, hi=10.5):', k: 'kw' },
      { t: '    return lo <= p <= hi', k: 'kw' },
      { t: '' },
      { t: '$ python check_pressure.py --p 9.8', k: 'pr' },
      { t: '[sandbox] network: DENIED by policy   cpu=2 mem=2G', k: 'st' },
      { t: 'PASS · 9.8 bar within [8.0, 10.5]  (exit 0)', k: 'ok' },
    ])
    S().pushEgress('127.0.0.1', 'sandbox :9000 /exec run', 'ALLOW')
    S().updateStep(id, { status: 'done', dur: '0.8s', detail: 'sandbox exit 0 → PASS · no network access used' })
    S().pushAudit('sandbox.exec', 'code')

    id = S().pushStep('Egress guard check', 'net.guard', 'a bundled dependency attempted an outbound call — watch the counter')
    await wait(700)
    S().pushEgress('telemetry.io', '443 · dependency phone-home', 'DENY')
    S().addToast({ kind: 'warn', title: 'External call blocked', desc: 'telemetry.io:443 denied · external count stays 0' })
    S().updateStep(id, { status: 'done', dur: '0.5s', detail: '1 outbound attempt DENIED · external-call counter unchanged (0)' })
    S().pushAudit('egress.deny')

    routeTo('draft approval_note.docx', 'document', 'doc', 'Numeric verdict returned. Routed back to <b>LLaVA-1.6 13B</b> to compose the note from the fields, the standard, and the PASS result.')
    S().setActiveModel('doc', 14)
    id = S().pushStep('Draft approval note (.docx)', 'doc.compose', 'composing from fields + MRPL-STD-14 + sandbox PASS …')
    await wait(1400); S().setArtefact(true)
    S().updateStep(id, { status: 'done', dur: '1.4s', detail: 'approval_note.docx written to /outputs · ready for human sign-off' })
    S().pushAudit('docx.compose', 'doc')

    S().setRun({ running: false, tlState: 'complete' }); S().setRoute({ state: 'done' }); S().setBanner(true)
    S().addToast({ kind: 'ok', title: 'Deliverable ready', desc: 'approval_note.docx · 0 external calls · fully sovereign' })
  } catch (e) { /* cancelled via reset */ }
}

function routeTo(task: string, type: string, modelId: string, reason: string) {
  S().setRoute({ task, type, model: modelId, reason, state: 'dispatched' })
  S().setActiveModel(modelId, modelById(modelId)?.vram)
}

/* ---------------- single-task launcher ---------------- */
export async function runSingle(kind: 'document' | 'code' | 'vision') {
  reset(); S().setRun({ running: true, t0: Date.now(), tlState: 'running' })
  const map: Record<string, { lbl: string; type: string; mdl: string; reason: string }> = {
    document: { lbl: 'inspection_report.pdf', type: 'document · vision', mdl: 'doc', reason: 'Image-only scanned PDF → <b>document/vision</b> → LLaVA-1.6 13B.' },
    code: { lbl: 'analyze_trend.py', type: 'code', mdl: 'code', reason: 'Executable numeric task → <b>code</b> → Qwen2.5-Coder 14B (verdict from executed code).' },
    vision: { lbl: 'unit_P&ID.png', type: 'vision', mdl: 'doc', reason: 'Engineering diagram → <b>vision</b> → LLaVA-1.6 13B for symbol/tag reading.' },
  }
  const m = map[kind]
  try {
    S().pushEgress('127.0.0.1', 'fastapi :8000 /agent/session', 'ALLOW')
    let id = S().pushStep('Task received — ' + m.lbl, 'ingest', ''); S().pushAudit('session.start'); await wait(600); S().updateStep(id, { status: 'done', dur: '0.3s' })
    id = S().pushStep('Classify & route', 'router', 'local classifier…'); await wait(800)
    routeTo(m.lbl, m.type, m.mdl, m.reason); S().addToast({ kind: 'route', title: 'Routed → ' + (modelById(m.mdl)?.name || ''), desc: m.type }); S().pushAudit('route', 'router'); S().updateStep(id, { status: 'done', dur: '0.8s' })
    const mv = modelById(m.mdl)!.vram
    id = S().pushStep('Load model', 'runtime', ''); for (let v = 0; v <= mv; v += mv / 4) { S().setActiveModel(m.mdl, v); await wait(160) } S().updateStep(id, { status: 'done', dur: '1.2s' }); S().pushAudit('model.load', m.mdl)
    if (kind === 'code') {
      id = S().pushStep('Execute in sandbox', 'sandbox.python', 'no-network · CPU 2 · MEM 2G')
      await typeTerminal([{ t: '$ python analyze_trend.py', k: 'pr' }, { t: '[sandbox] network: DENIED', k: 'st' }, { t: 'OK · slope=-0.4 mm/yr · within tolerance', k: 'ok' }])
      S().pushEgress('127.0.0.1', 'sandbox :9000 /exec', 'ALLOW'); S().updateStep(id, { status: 'done', dur: '0.9s', detail: 'exit 0 · PASS' }); S().pushAudit('sandbox.exec', 'code')
    } else {
      id = S().pushStep('OCR / vision read', 'vision.ocr', '')
      for (let p = 1; p <= 3; p++) { S().pushEgress('127.0.0.1', 'ollama :11434 /generate', 'ALLOW'); S().updateStep(id, { detail: `reading region ${p}/3…` }); await wait(500) }
      S().updateStep(id, { status: 'done', dur: '2.1s', detail: 'extracted fields / tags' }); S().pushAudit('vision.read', m.mdl)
    }
    S().setRun({ running: false, tlState: 'complete' }); S().addToast({ kind: 'ok', title: 'Task complete', desc: '0 external calls' })
  } catch (e) { /* cancelled */ }
}

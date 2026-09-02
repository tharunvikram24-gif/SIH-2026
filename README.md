<<<<<<< HEAD
# Sovereign Workbench — Frontend

An operations console for an **on-premise, air-gapped agentic AI** (SIH26117 · Mangalore Refinery & Petrochemicals). It's designed to make one thing obvious to a judge or an auditor: the agent does real, multi-step work **and nothing leaves the box**.

Built as a proper multi-page app: **Vite + React + TypeScript + Tailwind**, state in **Zustand**, routing with **react-router**. No CDNs, no web fonts, no analytics — the production build is a single self-contained `index.html` that runs offline by double-click and makes **zero external network requests** (so the UI itself passes the "no external calls" test it's demonstrating).

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173  (hot reload while you develop)

npm run build      # → dist/index.html  (ONE self-contained file, works offline)
npm run preview    # serve the production build locally
```

For a live demo just open `dist/index.html` in any browser — no server needed.

**Keyboard:** `Space` run/pause · `R` reset · `F` fullscreen.

---

## Project layout

```
src/
  main.tsx                 App entry: mounts React, starts the engine, binds hotkeys
  App.tsx                  Layout shell: Sidebar + Topbar + <Routes>
  index.css                Tailwind + design tokens (the DCS/HMI theme) + animations
  types.ts                 Shared TypeScript types (Step, EgressEvent, AuditRow, …)

  data/models.ts           The open-weight model catalog (8B–20B, fits one GPU box)
  lib/format.ts            Small helpers (clock, hash, random walk)
  lib/mockEngine.ts        ★ The demo "brain": scripts a run and drives the store
  store/useSystem.ts       ★ Single Zustand store — the app's whole state + actions

  components/              Reusable building blocks (see below)
  components/charts/       NetChart (the loopback-vs-external sparkline)
  pages/                   One file per screen in the sidebar
```

`★` The two files that matter most. **Every page reads from the store**, and the **engine is the only thing that writes to it**. That separation is what makes going live a one-file change.

---

## The pages (what the sidebar routes to)

| Page | What it is | What it proves to a judge |
|---|---|---|
| **Mission Control** (`/`) | The overview: KPI strip, one-click task launchers, router, sandbox, live trace, sentinel, RAG and the artefact bay on one screen. | The whole story at a glance. |
| **Agent Runs** (`/runs`) | The full step-by-step execution trace, plus sandbox + RAG. | The agent runs a genuine multi-step workflow, not a chatbot turn. |
| **Model Router** (`/router`) | Task → classified type → chosen model, with the reason, the model registry, and an explainer. | It routes across several open-weight models and hot-swaps mid-run. |
| **Sandbox** (`/sandbox`) | The isolated code terminal and its resource/network limits. | Verdicts come from executed code with **no network**. |
| **Knowledge (RAG)** (`/knowledge`) | Retrieved citations + index stats. | Answers are grounded in **local** documents, embedded on-device. |
| **Sovereignty** (`/sovereignty`) | The Sentinel: a big provable **0 external calls**, the loopback/external chart, the egress monitor, and the default-deny policy. | The signature claim, made visual and provable. |
| **Audit Log** (`/audit`) | Append-only, hashed record of every tool call, with **CSV export**. | Enterprise-credible provenance. |
| **Artefacts** (`/artefacts`) | Source scanned report (with the OCR'd fields highlighting in) → the generated approval note, with **download**. | A completed deliverable an agent produced unattended. |
| **Settings** (`/settings`) | Model registry + exactly how to wire this UI to your real backend. | — |

---

## The reusable components

- **Sidebar** — collapsible grouped navigation (Operations / Assurance / System) with an active-item accent and the air-gapped status pinned at the bottom.
- **Topbar** — page title/subtitle, live clock + run timer, the **RunControls** (Run / Pause / Reset / speed), and the "0 external" badge, on every page.
- **KpiStrip / KpiCard** — the six instruments (external calls, internal calls, active model, GPU·VRAM, throughput, audit events).
- **RouterView** — the classify→route flow + model list (compact variant for the overview).
- **Timeline** — the streaming agent trace (spinner → check, tool tag, duration, detail); `limit` prop for a condensed view.
- **SentinelView** — the sovereignty counter, network chart and egress monitor.
- **SandboxView** — the gVisor terminal with the typed program output and limit chips.
- **KnowledgeView** — RAG citations.
- **ArtefactView** — the source-vs-deliverable bay with the highlight-in animation and download.
- **CompletionBanner**, **Toasts**, **Chip**, **Panel**, **NetChart** — supporting UI.

---

## State & the mock engine

All live values live in one Zustand store (`store/useSystem.ts`): counters, the active model, the step list, egress events, audit rows, RAG citations, sandbox lines, the artefact state and toasts — plus the actions that mutate them.

`lib/mockEngine.ts` is a scripted director. `runMission()` walks the flagship workflow — **scanned inspection report → OCR → local RAG lookup → validate → hot-swap to the coder model → sandboxed PASS → (a dependency's outbound call gets DENIED) → draft the approval note** — calling store actions with realistic delays. Two loops animate the GPU/throughput gauges and the network sparkline. `runSingle()` powers the individual task buttons.

`wait()` inside the engine is cancellable, pausable and speed-scaled, which is what makes Reset/Pause and the 0.7×/1×/1.8× control work.

---

## Wiring it to your real backend

The mock engine is the **only** file that writes to the store, so making the console live is a single-file swap. Replace the scripted flows with a client that opens an **SSE or WebSocket** to your FastAPI agent and maps each event to the same actions:

```ts
// src/lib/mockEngine.ts  →  replace runMission() with:
const es = new EventSource('/agent/stream')          // or a WebSocket
es.addEventListener('step',     e => { const d = JSON.parse(e.data)
  d.done ? S().updateStep(d.id, d) : S().pushStep(d.title, d.tool, d.detail) })
es.addEventListener('route',    e => { const d = JSON.parse(e.data)
  S().setRoute(d); S().setActiveModel(d.model, d.vram) })
es.addEventListener('egress',   e => { const d = JSON.parse(e.data)
  S().pushEgress(d.host, d.path, d.verdict) })        // 'ALLOW' | 'DENY'
es.addEventListener('audit',    e => { const d = JSON.parse(e.data)
  S().pushAudit(d.tool, d.model) })
es.addEventListener('sandbox',  e => S().setSandbox(JSON.parse(e.data).lines))
es.addEventListener('rag',      e => S().setRag(JSON.parse(e.data).cites))
es.addEventListener('artefact', () => S().setArtefact(true))
```

No component or page needs to change — they already render whatever is in the store.

Best case, send me your FastAPI `openapi.json` (or the event shapes) and this becomes a real client.

---

## Design notes

The look is grounded in **refinery DCS/HMI instrumentation**, not the generic dark-hacker theme: a deep petrol-graphite panel, an instrument-amber brand, and a **signal palette that carries meaning** — green ALLOW, red DENY, cyan telemetry, violet routing. Colour is information here. Motion is spent in one place (the orchestrated run), monospace is used only for real machine data, and everything the agent claims is shown as a count, a hash or an egress verdict rather than asserted.

Accessibility: keyboard focus is visible, `prefers-reduced-motion` disables animation, and the layout is responsive down to a single column.
=======
# SIH-2026
>>>>>>> abf692689b11786ef5f0611c34dd87d80915a5d0

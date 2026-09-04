# MRPL Sovereign AI — On-Premise Agentic AI Workbench (frontend)

An enterprise **AI Command Center** for the MRPL Smart Automation problem statement — a secure, on-premise agentic AI workbench that visibly supports local/open-weight LLMs, RAG, multimodal/OCR document analysis, tool calling, model routing and sandboxed execution. Deliberately **not** a ChatGPT clone: industrial + futuristic refinery styling, a 3-column command layout, and a right-hand agent/security panel that proves *nothing leaves the box*.

Stack: **Vite + React + TypeScript + Tailwind + lucide-react**, state in **Zustand**. No CDNs, no web fonts, no telemetry — the production build is a single self-contained `index.html` that runs offline and makes **zero external network requests**.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173

npm run build      # → dist/index.html  (one self-contained offline file)
npm run preview
```

## Layout (desktop 3-column, responsive)

- **Left sidebar (250px)** — logo, **+ New Conversation**, nav (Chat · Documents · Workflows · Agent Activity · Audit Log · Settings), and a live **System Status** block (Local AI Engine, RAG Engine, Tool Sandbox, Network — ISOLATED). Collapses to a drawer under `lg`.
- **Main workspace** — header with breadcrumb + **ON-PREMISE / SECURE** badges; the chat experience (empty state → capability cards + sample prompts → streamed messages).
- **Right Agent/Security panel** — the most important panel: **Agent Execution** flow, **Model Router**, **Sovereign Environment** checks, and **Network Monitor** (external 0 / internal / 0 KB out) with a **SECURE / ISOLATED** seal. Shown on Chat and Agent Activity.

## What's interactive (all mock data)

- Click a **capability card** or **sample prompt**, or type in the input, to run a full agent pass. The right panel steps light up in sequence (router → agent → RAG → OCR → tool → response), the model router updates, the network monitor counts internal-only calls, the audit log appends, and the AI reply **streams** in and then reveals **expandable sources**.
- **Chat input**: multiline, Enter to send / Shift+Enter newline, Attach menu (Image/Document/Data), Agent-Mode toggle, file chips, drag-and-drop.
- **Documents**: knowledge-base table + **upload modal** with a drag-zone and an indexing→Indexed animation that adds real rows.
- **Workflows**: the full Incoming Task → Router → (Document/Coding/Vision agents) → RAG/Tools → Sandbox → Final Response diagram.
- **Agent Activity**: live step feed + the agent/security rail.
- **Audit Log**: Time | Action | Component | Status table with **CSV export**.
- **Settings**: local model registry + security toggles (network isolation, sandbox, append-only audit).

## Project structure

```
src/
  main.tsx / App.tsx        entry + 3-column shell + routes (HashRouter)
  index.css                 Tailwind + industrial theme tokens + animations
  store.ts                  single Zustand store (all live state + actions)
  mock.ts                   runAgent(): scripts an agent pass; SAMPLE_PROMPTS + canned replies
  types.ts
  components/
    Sidebar, TopHeader, WorkflowRail (right panel),
    Message, ChatInput, CapabilityCards, SamplePrompts, UploadModal, ui (Card/Chip/StatusDot)
  pages/  Chat, Documents, Workflows, AgentActivity, AuditLog, Settings
```

## Wiring to a real backend

`mock.ts` is the only file that drives the store. To go live, replace `runAgent()` with an SSE/WebSocket client to your FastAPI agent and map events to the same store actions (`addMessage/patchMessage`, `patchStep`, `setRouter`, `incNet`, `addAudit`). No components change — every page/panel just reads the store.

## Design language

A subtly **blurred refinery photo backdrop** (inlined as base64 so the build stays offline) sits behind frosted-glass panels; a strong dark wash keeps text legible. Deep-navy base, petroleum-blue/teal primaries, cyan highlights, small amber industrial accents, light-gray type, a faint technical grid, and clean metallic cards with restrained rounding — professional and futuristic, no neon overload, no stock refinery imagery, an abstract hex/AI mark instead of any logo. Respects `prefers-reduced-motion` and keyboard use.

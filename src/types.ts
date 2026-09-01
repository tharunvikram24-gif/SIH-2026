export type StepStatus = 'run' | 'done' | 'err'
export interface Step { id: number; title: string; tool?: string; detail?: string; status: StepStatus; dur?: string; fresh?: boolean }
export interface EgressEvent { id: number; host: string; path: string; verdict: 'ALLOW' | 'DENY' }
export interface AuditRow { id: number; t: string; tool: string; model: string; hash: string }
export interface NetPoint { i: number; e: number }
export interface Cite { t: string; s: string; sc: string }
export interface Toast { id: number; kind: 'route' | 'ok' | 'warn' | 'deny'; title: string; desc: string }
export interface SandboxLine { t: string; k?: 'pr' | 'cm' | 'ok' | 'kw' | 'st' }
export interface ModelInfo { id: string; name: string; kind: string; vram: number; quant: string; ctx: string }
export interface RouteState { task: string; type: string; model: string | null; reason: string; state: string }
export type TaskKind = 'document' | 'code' | 'vision'

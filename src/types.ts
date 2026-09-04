export interface Source { doc: string; page: number; rel: number }
export interface Msg { id: number; role: 'user' | 'ai'; text: string; streaming?: boolean; sources?: Source[] }
export type StepStatus = 'pending' | 'active' | 'done'
export interface Step { key: string; label: string; sub: string; status: StepStatus }
export interface Doc { name: string; type: string; meta: string; indexed: boolean; updated: string }
export interface AuditRow { id: number; time: string; action: string; component: string; status: string }

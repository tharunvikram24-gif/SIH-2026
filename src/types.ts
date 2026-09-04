export interface Source { doc: string; page: number; rel: number }
export type StepStatus = 'pending' | 'active' | 'done'
export interface Step { key: string; label: string; sub: string; status: StepStatus }
export interface Doc { name: string; type: string; meta: string; indexed: boolean; updated: string }
export interface AuditRow { id: number; time: string; action: string; component: string; status: string }

// --- Task/feature selector -------------------------------------------------
export type TaskType = 'pid' | 'corrosion' | 'calc' | 'report' | 'docqa'

// --- Structured result / confidence / citations -----------------------------
export type ConfidenceLevel = 'high' | 'review' | 'low'
export interface Citation { doc: string; page?: number; chunk?: string; confidence: number }
export interface KeyValue { label: string; value: string }
export interface CalcSection { inputs: KeyValue[]; formula: string; steps: KeyValue[]; result: KeyValue }
export interface Downloadable { filename: string; content: string; mime: string }
export interface StructuredResult {
  summary: string
  extractedData?: KeyValue[]
  insights?: string[]
  warnings?: string[]
  confidence: ConfidenceLevel
  citations?: Citation[]
  calculation?: CalcSection
  downloadable?: Downloadable
}

export interface Msg {
  id: number
  role: 'user' | 'ai'
  text: string
  streaming?: boolean
  sources?: Source[]
  // optional additions used by task-mode runs — absent for plain chat messages
  taskType?: TaskType
  result?: StructuredResult
  error?: string
}

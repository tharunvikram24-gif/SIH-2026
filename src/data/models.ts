import type { ModelInfo } from '../types'

// Open-weight models sized to fit a single on-prem GPU box (8B-20B), per the problem spec.
export const MODELS: ModelInfo[] = [
  { id: 'router', name: 'Llama-3.1 8B',      kind: 'router · classifier', vram: 9,  quant: 'Q5_K_M', ctx: '16k' },
  { id: 'doc',    name: 'LLaVA-1.6 13B',     kind: 'document · vision',   vram: 14, quant: 'Q5_K_M', ctx: '8k'  },
  { id: 'code',   name: 'Qwen2.5-Coder 14B', kind: 'code',                vram: 18, quant: 'Q4_K_M', ctx: '32k' },
  { id: 'embed',  name: 'nomic-embed-text',  kind: 'embeddings · RAG',    vram: 2,  quant: 'F16',    ctx: '8k'  },
]
export const modelById = (id: string | null) => MODELS.find((m) => m.id === id)

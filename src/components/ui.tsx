import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={'card ' + className}>{children}</div>
}

export function StatusDot({ tone = 'grn', pulse = false }: { tone?: 'grn' | 'cyan' | 'amber' | 'red' | 'faint'; pulse?: boolean }) {
  const c: any = { grn: 'bg-grn', cyan: 'bg-cyan', amber: 'bg-amber', red: 'bg-red', faint: 'bg-faint' }
  return <span className={`inline-block w-2 h-2 rounded-full ${c[tone]} ${pulse ? 'pulse' : ''}`} style={{ boxShadow: '0 0 0 3px rgba(255,255,255,.04)' }} />
}

export function Chip({ tone = 'mut', children }: { tone?: 'teal' | 'cyan' | 'amber' | 'grn' | 'red' | 'mut'; children: ReactNode }) {
  const map: any = {
    teal: 'text-tealb border-teal/40 bg-teal/10', cyan: 'text-cyan border-cyan/40 bg-cyan/10',
    amber: 'text-amber border-amber/40 bg-amber/10', grn: 'text-grn border-grn/40 bg-grn/10',
    red: 'text-red border-red/40 bg-red/10', mut: 'text-mut border-edge2 bg-transparent',
  }
  return <span className={'chip ' + map[tone]}>{children}</span>
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="klbl mb-2">{children}</div>
}

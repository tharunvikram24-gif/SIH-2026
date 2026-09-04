type Tone = 'ok' | 'warn' | 'info' | 'vlt' | 'mut'
export function Chip({ tone = 'mut', children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`chip chip-${tone}`}>{children}</span>
}

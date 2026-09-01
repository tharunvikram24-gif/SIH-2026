import { useSystem } from '../../store/useSystem'
export function NetChart({ height = 66 }: { height?: number }) {
  const net = useSystem((s) => s.net)
  const w = 300, h = height, max = 10
  const x = (i: number) => (i / 59) * w
  const y = (v: number) => h - 4 - (v / max) * (h - 10)
  let line = ''
  net.forEach((p, i) => { line += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.i).toFixed(1) + ' ' })
  let area = 'M0 ' + h
  net.forEach((p, i) => { area += 'L' + x(i).toFixed(1) + ' ' + y(p.i).toFixed(1) })
  if (net.length) area += 'L' + x(net.length - 1).toFixed(1) + ' ' + h + 'Z'
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={area} fill="rgba(79,208,138,.08)" />
      <path d={line} fill="none" stroke="#4FD08A" strokeWidth={1.8} strokeLinejoin="round" />
      <line x1="0" y1={h - 4} x2={w} y2={h - 4} stroke="#F0625E" strokeWidth={1.6} strokeDasharray="3 3" />
    </svg>
  )
}

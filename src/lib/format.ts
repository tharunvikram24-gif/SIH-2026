export const now = () => new Date().toTimeString().slice(0, 8)
export const hhmm = (s: number) => {
  const m = Math.floor(s / 60), ss = s % 60
  return String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0')
}
export const rnd = (a: number, b: number) => a + Math.random() * (b - a)
export const shortHash = () => {
  const h = '0123456789abcdef'; let s = ''
  for (let i = 0; i < 6; i++) s += h[Math.floor(Math.random() * 16)]
  return s
}

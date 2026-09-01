/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#090D12', bg2: '#0B1117', panel: '#0E151D', raise: '#121C25',
        edge: '#1C2A35', edge2: '#263743',
        ink: '#D7E0E8', mut: '#8A9AA8', faint: '#5C6B78',
        amber: '#F2A93B', grn: '#4FD08A', red: '#F0625E',
        cyan: '#5CB8E8', violet: '#9E8BFF', paper: '#F5F1E6',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        serif: ['Georgia', 'Iowan Old Style', 'Times New Roman', 'serif'],
      },
      boxShadow: { panel: '0 1px 0 rgba(255,255,255,.045) inset, 0 24px 50px -40px #000' },
    },
  },
  plugins: [],
}

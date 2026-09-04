/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm Claude-inspired palette (light)
        navy: '#F7F6F2',   // page background
        bg2: '#EFEEE9',    // sidebar
        panel: '#FFFFFF',  // cards / input surfaces
        raise: '#F1EFEA',  // hover / secondary surface
        edge: '#E8E6DF',   // borders
        edge2: '#DAD7CE',  // stronger borders
        ink: '#141413',    // primary text
        mut: '#6B6964',    // secondary text
        faint: '#9A968D',  // muted text
        teal: '#6B371D',   // primary accent (buttons)
        tealb: '#7A4225',  // hover / active
        amber: '#8B5A3C',  // active accent (light brown)
        cyan: '#4F2817',   // dark brown -> decorative icon accent
        blue: '#6B6964',   // neutral
        grn: '#4B7A46',    // muted status-ok green (readable on light)
        red: '#B0463E',    // muted danger (readable on light)
        // reference tokens (available if needed)
        cream: '#F7F6F2', beige: '#EFEEE9', surface: '#E8E6DF',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', '"Times New Roman"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: { card: '0 1px 2px rgba(20,20,19,.05), 0 1px 8px rgba(20,20,19,.04)' },
    },
  },
  plugins: [],
}

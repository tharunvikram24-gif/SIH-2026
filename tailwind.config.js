/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme tokens — values come from CSS variables in src/index.css so a single
        // data-theme attribute swap re-themes every existing utility class (light/dark).
        navy: 'rgb(var(--c-navy) / <alpha-value>)',     // page background
        bg2: 'rgb(var(--c-bg2) / <alpha-value>)',       // sidebar
        panel: 'rgb(var(--c-panel) / <alpha-value>)',   // cards / input surfaces
        raise: 'rgb(var(--c-raise) / <alpha-value>)',   // hover / secondary surface
        edge: 'rgb(var(--c-edge) / <alpha-value>)',     // borders
        edge2: 'rgb(var(--c-edge2) / <alpha-value>)',   // stronger borders
        ink: 'rgb(var(--c-ink) / <alpha-value>)',       // primary text
        mut: 'rgb(var(--c-mut) / <alpha-value>)',       // secondary text
        faint: 'rgb(var(--c-faint) / <alpha-value>)',   // muted text
        teal: 'rgb(var(--c-teal) / <alpha-value>)',     // primary accent (buttons)
        tealb: 'rgb(var(--c-tealb) / <alpha-value>)',   // hover / active
        amber: 'rgb(var(--c-amber) / <alpha-value>)',   // active accent (light brown)
        cyan: 'rgb(var(--c-cyan) / <alpha-value>)',     // dark brown -> decorative icon accent
        blue: 'rgb(var(--c-mut) / <alpha-value>)',      // neutral
        grn: 'rgb(var(--c-grn) / <alpha-value>)',       // muted status-ok green (readable on light+dark)
        red: 'rgb(var(--c-red) / <alpha-value>)',       // muted danger (readable on light+dark)
        // reference tokens (available if needed)
        cream: 'rgb(var(--c-navy) / <alpha-value>)',
        beige: 'rgb(var(--c-bg2) / <alpha-value>)',
        surface: 'rgb(var(--c-edge) / <alpha-value>)',
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

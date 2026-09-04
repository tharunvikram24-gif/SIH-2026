import { useStore } from '../store'
import { Sun, Moon } from 'lucide-react'

// Persists to localStorage via store.setTheme(); applies [data-theme] on <html> so
// every existing color utility (bg-panel, text-ink, border-edge, ...) re-themes
// through CSS variables — no component classNames need to change.
export function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'
  return (
    <button onClick={toggleTheme} title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="btn btn-ghost px-2" aria-label="Toggle color theme">
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}

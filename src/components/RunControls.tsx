import { useSystem } from '../store/useSystem'
import { runMission, togglePause, reset, setSpeed } from '../lib/mockEngine'
import { Play, Pause, RotateCcw } from 'lucide-react'

export function RunControls() {
  const running = useSystem((s) => s.running)
  const paused = useSystem((s) => s.paused)
  const speed = useSystem((s) => s.speed)
  const complete = useSystem((s) => s.tlState === 'complete')

  const label = !running ? (complete ? 'Replay demo' : 'Run demo') : paused ? 'Resume' : 'Pause'
  const Icon = !running ? Play : paused ? Play : Pause
  const onClick = () => { if (!running) runMission(); else togglePause() }

  return (
    <div className="flex items-center gap-2">
      <button className="btn btn-primary" onClick={onClick}><Icon size={15} />{label}</button>
      <button className="btn btn-ghost" onClick={reset} title="Reset (R)"><RotateCcw size={15} /></button>
      <div className="inline-flex rounded-lg border border-edge2 overflow-hidden">
        {[0.7, 1, 1.8].map((sp) => (
          <button key={sp} onClick={() => setSpeed(sp)}
            className={'font-mono text-[12px] font-semibold px-2.5 py-2 ' + (speed === sp ? 'bg-raise text-amber' : 'text-mut')}>
            {sp}×
          </button>
        ))}
      </div>
    </div>
  )
}

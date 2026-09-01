import { useSystem } from '../store/useSystem'
import { Panel } from './Panel'
import { Chip } from './Chip'
import { FileText, Lock, Download } from 'lucide-react'

const FIELDS: [string, string, string][] = [
  ['unit', 'Unit / Tag', 'CDU-2 · PV-114'],
  ['date', 'Inspection date', '2026-02-14'],
  ['insp', 'Inspector', 'R. Nayak (NDT-II)'],
  ['press', 'Test pressure', '9.8 bar'],
  ['thk', 'Min. wall thk', '11.4 mm'],
  ['res', 'Visual / UT result', 'No defects'],
]

function downloadNote() {
  const note = `INSPECTION APPROVAL NOTE\nRef MRPL/INS/2026/0442\n\nEquipment: CDU-2 / PV-114 (pressure vessel)\nInspection date: 2026-02-14\nInspector: R. Nayak (NDT-II)\n\nFindings: Visual + ultrasonic examination recorded no defects. Min wall thk 11.4 mm.\nTest pressure: 9.8 bar — checked against MRPL-STD-14 (8.0-10.5 bar): PASS.\n\nRecommendation: return to service, subject to human sign-off.\n\nPrepared by: Sovereign Workbench agent (on-premise, unattended)\nReviewer: ____________________   Date: __________\n\nProvenance: generated on-device from scanned report + local standards library. 0 external network calls.`
  const blob = new Blob([note], { type: 'text/plain' }); const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'approval_note.txt'; a.click(); URL.revokeObjectURL(url)
}

export function ArtefactView() {
  const hit = useSystem((s) => s.fieldsHit)
  const read = useSystem((s) => s.scanRead)
  const ready = useSystem((s) => s.artefactReady)
  return (
    <Panel icon={<FileText size={15} className="text-amber" />} title="Artefact Bay — source → deliverable"
      action={<button className="btn" disabled={!ready} onClick={downloadNote}><Download size={14} />Download approval note</button>}>
      <div className="grid md:grid-cols-2 gap-0 -m-3.5">
        {/* source */}
        <div className="p-4 md:border-r border-b md:border-b-0 border-edge bg-[#0b1016]">
          <div className="font-mono text-[10px] uppercase tracking-wide text-faint mb-2.5 flex gap-2 items-center"><Chip tone="info">INPUT</Chip> inspection_report_A-12.pdf · scanned, 4 pp</div>
          <div className="relative rounded-lg bg-paper text-[#232019] p-4 font-serif shadow-[0_20px_50px_-30px_#000] min-h-[250px]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,0,0,.03) 0 1px,transparent 1px 3px)' }}>
            <div className="text-center border-b-2 border-[#b9b09a] pb-2 mb-3">
              <div className="text-[12.5px] font-bold tracking-wide">MANGALORE REFINERY &amp; PETROCHEMICALS LTD</div>
              <div className="text-[11px] text-[#6a6350] mt-0.5 font-sans">Equipment Inspection Report — Pressure Vessel</div>
            </div>
            {FIELDS.map(([k, lab, val]) => (
              <div key={k} className="flex justify-between gap-3 text-[12.5px] py-[3px]">
                <span className="text-[#5f5943]">{lab}</span>
                <span className={'font-bold px-[3px] rounded-[3px] ' + (hit.includes(k) ? 'bg-amber/[.32] shadow-[0_0_0_1px_rgba(182,122,30,.5)]' : '')}>{val}</span>
              </div>
            ))}
            <div className={'absolute right-3.5 bottom-3 -rotate-[9deg] border-2 border-[#2f7d54] text-[#2f7d54] font-sans font-extrabold text-[12px] tracking-widest px-2 py-[3px] rounded-[5px] transition-opacity ' + (read ? 'opacity-90' : 'opacity-0')}>READ ✓</div>
          </div>
        </div>
        {/* output */}
        <div className="p-4">
          <div className="font-mono text-[10px] uppercase tracking-wide text-faint mb-2.5 flex gap-2 items-center"><Chip tone="ok">OUTPUT</Chip> approval_note.docx · agent-generated</div>
          {!ready ? (
            <div className="grid place-items-center min-h-[250px] text-faint font-mono text-[12px] text-center gap-2">
              <Lock size={26} /><div>Deliverable appears here<br />once the agent completes its run.</div>
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center gap-1.5 font-sans text-[10.5px] font-bold text-grn bg-grn/10 border border-grn/30 px-2.5 py-1 rounded-[7px] mb-2.5">✓ Generated on-device · unattended · unsigned draft</div>
              <div className="rounded-lg bg-paper text-[#232019] p-4 font-serif shadow-[0_20px_50px_-30px_#000]">
                <div className="text-[15px] font-bold text-center">Inspection Approval Note</div>
                <div className="text-center font-sans text-[10.5px] text-[#6a6350] mb-3">Ref MRPL/INS/2026/0442 · generated 2026-02-14</div>
                <p className="text-[12.5px] mb-2 leading-relaxed">Pressure vessel <b>CDU-2 · PV-114</b> was inspected on <b>2026-02-14</b> by R. Nayak (NDT-II). Visual and ultrasonic examination recorded <b>no defects</b>, with minimum wall thickness 11.4 mm.</p>
                <p className="text-[12.5px] mb-2 leading-relaxed">The recorded test pressure of <b>9.8 bar</b> was checked against acceptance standard <b>MRPL-STD-14</b> (8.0–10.5 bar) by an automated sandbox routine and returned <b>PASS</b>. On this basis the vessel is recommended for return to service.</p>
                <p className="text-[11px] text-[#6a6350]">Drafted automatically from the scanned report and the local standards library. Requires human sign-off before issue.</p>
                <div className="mt-4 border-t border-[#c7bfa8] pt-2 text-[11.5px] text-[#4a442f] font-sans">Prepared by: Sovereign Workbench agent · Reviewer: ______________ · Date: ________</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}

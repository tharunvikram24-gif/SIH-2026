import { ArtefactView } from '../components/ArtefactView'
import { CompletionBanner } from '../components/CompletionBanner'
export default function Artefacts() {
  return <div className="flex flex-col gap-4"><CompletionBanner /><ArtefactView /></div>
}

import { useRef, useState } from 'react'
import { useStore } from '../store'
import { Plus, Mic, Bot, ArrowUp, FileText, Image as Img, Database, X, ChevronDown, MessageSquare } from 'lucide-react'

export function ChatInput({ onSend }: { onSend: (t: string) => void }) {
  const [text, setText] = useState('')
  const [menu, setMenu] = useState(false)
  const [chatMenu, setChatMenu] = useState(false)
  const [recording, setRecording] = useState(false)
  const running = useStore((s) => s.running)
  const agentMode = useStore((s) => s.agentMode)
  const toggleAgentMode = useStore((s) => s.toggleAgentMode)
  const attachments = useStore((s) => s.attachments)
  const addAttachment = useStore((s) => s.addAttachment)
  const removeAttachment = useStore((s) => s.removeAttachment)
  const setUploadOpen = useStore((s) => s.setUploadOpen)
  const messages = useStore((s) => s.messages)
  const conversations = useStore((s) => s.conversations)
  const loadConversation = useStore((s) => s.loadConversation)
  const ref = useRef<HTMLTextAreaElement>(null)

  // same underlying chat-history state as the sidebar's "Chat" popover
  const curUser = messages.find((m) => m.role === 'user')
  const curTitle = curUser ? (curUser.text.length > 28 ? curUser.text.slice(0, 28) + '…' : curUser.text) : null

  const submit = () => {
    const t = text.trim(); if (!t || running) return
    if (recording) setRecording(false)
    onSend(t); setText(''); if (ref.current) ref.current.style.height = 'auto'
  }
  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }
  const grow = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget; el.style.height = 'auto'; el.style.height = Math.min(180, el.scrollHeight) + 'px'
  }
  // mocked voice: toggle a recording state; on stop, drop in a mock transcript
  const toggleVoice = () => {
    setRecording((r) => {
      const next = !r
      if (!next && !text.trim()) setText('Summarize the latest inspection findings.')
      return next
    })
  }

  const canSend = !!text.trim() && !running

  return (
    <div className="rounded-2xl border border-edge bg-panel px-3 pt-3 pb-2.5 focus-within:border-edge2 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); addAttachment('dropped_file.pdf') }}>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1 pb-2">
          {attachments.map((a) => (
            <span key={a} className="inline-flex items-center gap-1.5 rounded-md border border-edge bg-raise px-2 py-1 text-[11.5px]">
              <FileText size={12} className="text-mut" /> {a}
              <button onClick={() => removeAttachment(a)} className="text-faint hover:text-red"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}

      {recording && (
        <div className="flex items-center gap-2 px-1.5 pb-2 text-[12.5px] text-teal">
          <span className="w-2 h-2 rounded-full bg-teal pulse" />
          Listening
          <span className="eq"><span /><span /><span /><span /></span>
          <span className="text-faint font-mono text-[10.5px] ml-1">(mock · click mic to stop)</span>
        </div>
      )}

      <textarea ref={ref} value={text} onChange={(e) => setText(e.target.value)} onInput={grow} onKeyDown={onKey}
        rows={1} placeholder={recording ? 'Listening…' : 'Ask Sovereign AI anything...'}
        className="w-full bg-transparent resize-none outline-none px-1.5 py-1.5 text-[14.5px] leading-relaxed placeholder:text-faint min-h-[28px]" />

      <div className="flex items-center gap-1.5 pt-1.5">
        {/* Attach */}
        <div className="relative">
          <button className="btn btn-ghost px-2.5" onClick={() => setMenu(!menu)}><Plus size={16} /> <span className="hidden sm:inline">Attach</span></button>
          {menu && (
            <div className="absolute bottom-11 left-0 z-20 w-44 card p-1.5 fadeup" onMouseLeave={() => setMenu(false)}>
              {[['Image', Img], ['Document', FileText], ['Data', Database]].map(([l, Icon]: any) => (
                <button key={l} onClick={() => { setMenu(false); setUploadOpen(true) }} className="w-full flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] hover:bg-raise text-left">
                  <Icon size={15} className="text-mut" /> {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice — same style as Attach; warm accent on hover; toggles recording */}
        <button onClick={toggleVoice} title="Voice input (mock)"
          className={'btn btn-ghost px-2.5 ' + (recording ? 'text-teal bg-teal/10 border-teal/30' : '')}>
          <Mic size={16} /> <span className="hidden sm:inline">Voice</span>
        </button>

        {/* Agent Mode */}
        <button onClick={toggleAgentMode}
          className={'btn px-2.5 ' + (agentMode ? 'bg-teal text-white border-transparent hover:bg-tealb' : 'btn-ghost')}>
          <Bot size={15} /> <span className="hidden sm:inline">Agent Mode</span>
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Chat dropdown — reuses the same conversations/loadConversation state as the sidebar */}
          <div className="relative">
            <button onClick={() => setChatMenu((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal text-white px-3 py-2 text-[13px] font-medium transition-colors hover:bg-tealb">
              Chat <ChevronDown size={14} className={'transition ' + (chatMenu ? 'rotate-180' : '')} />
            </button>
            {chatMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setChatMenu(false)} />
                <div className="absolute bottom-11 right-0 z-30 w-56 card p-1.5 fadeup max-h-[280px] overflow-y-auto">
                  <div className="klbl px-2 py-1">Recent chats</div>
                  {curTitle && (
                    <button onClick={() => setChatMenu(false)}
                      className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] hover:bg-raise text-left">
                      <MessageSquare size={14} className="text-teal" />
                      <span className="truncate">{curTitle}</span>
                      <span className="ml-auto text-[10px] text-faint">current</span>
                    </button>
                  )}
                  {conversations.length === 0 && !curTitle && (
                    <div className="px-2.5 py-3 text-[12px] text-faint">No previous conversations yet.</div>
                  )}
                  {conversations.map((c) => (
                    <button key={c.id} onClick={() => { loadConversation(c.id); setChatMenu(false) }}
                      className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] hover:bg-raise text-left">
                      <MessageSquare size={14} className="text-faint" />
                      <span className="truncate">{c.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Send — understated */}
          <button onClick={submit} disabled={!canSend}
            className={'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ' +
              (canSend ? 'bg-teal text-white hover:bg-tealb' : 'bg-raise text-faint cursor-not-allowed')}>
            Send <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { useStore } from '../store'
import { runAgent } from '../mock'
import { Message } from '../components/Message'
import { ChatInput } from '../components/ChatInput'
import { CapabilityCards } from '../components/CapabilityCards'
import { SamplePrompts } from '../components/SamplePrompts'
import { WorkflowRail } from '../components/WorkflowRail'
import { Hexagon } from 'lucide-react'

export default function ChatPage() {
  const messages = useStore((s) => s.messages)
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  const send = (t: string) => runAgent(t)
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 p-4 md:p-6">
      {/* chat column */}
      <div className="flex flex-col min-h-[calc(100vh-68px-3rem)]">
        <div className="flex-1">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto pt-6">
              <div className="text-center mb-6">
                <span className="inline-grid place-items-center w-12 h-12 rounded-md border border-edge2 bg-beige mb-3"><Hexagon size={24} className="text-teal" /></span>
                <h2 className="font-serif font-medium text-[30px] tracking-tight">Intelligence for the Refinery.</h2>
                <p className="text-mut text-[14px] mt-1.5">Ask questions, analyze documents, or delegate complex tasks — entirely on-premise.</p>
              </div>
              <CapabilityCards onPick={send} />
              <div className="mt-6"><SamplePrompts onPick={send} /></div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-5 pt-2 pb-4">
              {messages.map((m) => (
                <Message key={m.id} m={m} onRegenerate={lastUser ? () => runAgent(lastUser.text) : undefined} />
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>
        <div className="sticky bottom-0 pt-3 bg-gradient-to-t from-navy via-navy to-transparent">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={send} />
            <div className="text-center font-mono text-[10px] text-faint mt-2">All processing is local · 0 KB leaves this system</div>
          </div>
        </div>
      </div>

      {/* right panel */}
      <div className="hidden xl:block">
        <div className="sticky top-[92px]"><WorkflowRail /></div>
      </div>
    </div>
  )
}

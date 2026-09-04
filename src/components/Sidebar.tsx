import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../store'
import {
  MessageSquarePlus, MessagesSquare, FileText, Workflow, Activity,
  ScrollText, User, Hexagon, X, ChevronDown, MessageSquare, ArrowRight,
} from 'lucide-react'

const rest = [
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/workflows', icon: Workflow, label: 'Workflows' },
  { to: '/activity', icon: Activity, label: 'Agent Activity' },
  { to: '/audit', icon: ScrollText, label: 'Audit Log' },
  { to: '/settings', icon: User, label: 'Settings' },
]

const ago = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago'
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago'
  return Math.floor(h / 24) + 'd ago'
}

// Today / Yesterday / short date — used by the persistent "Chats" list in the sidebar
const dayLabel = (ts: number) => {
  const startOfDay = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime() }
  const diff = Math.round((startOfDay(Date.now()) - startOfDay(ts)) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function Sidebar() {
  const open = useStore((s) => s.sidebarOpen)
  const setSidebar = useStore((s) => s.setSidebar)
  const newConversation = useStore((s) => s.newConversation)
  const conversations = useStore((s) => s.conversations)
  const messages = useStore((s) => s.messages)
  const activeConvId = useStore((s) => s.activeConvId)
  const loadConversation = useStore((s) => s.loadConversation)
  const [histOpen, setHistOpen] = useState(false)
  const [chatsOpen, setChatsOpen] = useState(true)
  const [showAllChats, setShowAllChats] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const chatActive = loc.pathname === '/'

  const curUser = messages.find((m) => m.role === 'user')
  const curTitle = curUser ? (curUser.text.length > 30 ? curUser.text.slice(0, 30) + '…' : curUser.text) : null

  // Same underlying history state as the "Chat" popover, reshaped for the always-visible list
  const chatList = [
    ...(curTitle ? [{ id: activeConvId, title: curTitle, ts: Date.now(), current: true }] : []),
    ...conversations.filter((c) => c.id !== activeConvId).map((c) => ({ id: c.id, title: c.title, ts: c.ts, current: false })),
  ]
  const visibleChats = showAllChats ? chatList : chatList.slice(0, 6)

  const openChat = () => { nav('/'); setHistOpen((o) => !o) }
  const pick = (id: number) => { loadConversation(id); setHistOpen(false); setSidebar(false); nav('/') }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebar(false)} />}
      <aside className={
        'z-50 w-[250px] shrink-0 h-screen flex flex-col border-r border-edge bg-bg2 ' +
        'fixed lg:sticky top-0 transition-transform duration-200 ' + (open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')
      }>
        {/* logo */}
        <div className="px-4 h-[68px] flex items-center gap-3 border-b border-edge">
          <span className="relative grid place-items-center w-10 h-10 rounded-md border border-edge2 bg-panel">
            <Hexagon size={20} className="text-teal" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal ring-2 ring-bg2" />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="font-semibold text-[14px] tracking-wide text-ink">MRPL <span className="text-teal">SOVEREIGN AI</span></div>
            <div className="text-[10px] text-faint">On-Premise Agentic Workbench</div>
          </div>
          <button className="ml-auto lg:hidden text-faint hover:text-ink" onClick={() => setSidebar(false)}><X size={18} /></button>
        </div>

        {/* new conversation */}
        <div className="p-3">
          <NavLink to="/" onClick={() => { newConversation(); setSidebar(false) }} className="btn btn-primary w-full justify-center">
            <MessageSquarePlus size={16} /> New Conversation
          </NavLink>
        </div>

        {/* nav */}
        <nav className="px-3 flex flex-col gap-1 shrink-0">
          {/* Chat + history popover */}
          <div className="relative">
            <button onClick={openChat} className={'group navitem w-full ' + (chatActive ? 'active' : '')}>
              <MessagesSquare size={17} className={chatActive ? 'text-teal' : 'text-faint group-hover:text-mut'} />
              <span>Chat</span>
              <ChevronDown size={15} className={'ml-auto text-faint transition ' + (histOpen ? 'rotate-180' : '')} />
            </button>
            {histOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setHistOpen(false)} />
                <div className="absolute left-1 right-1 top-full mt-1 z-50 card p-1.5 max-h-[320px] overflow-y-auto">
                  <div className="klbl px-2 py-1">Recent conversations</div>
                  {curTitle && (
                    <button onClick={() => { setHistOpen(false); setSidebar(false); nav('/') }}
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
                    <button key={c.id} onClick={() => pick(c.id)}
                      className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] hover:bg-raise text-left">
                      <MessageSquare size={14} className="text-faint" />
                      <span className="truncate">{c.title}</span>
                      <span className="ml-auto text-[10px] text-faint">{ago(c.ts)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* other nav */}
          {rest.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setSidebar(false)}
              className={({ isActive }) => 'group navitem' + (isActive ? ' active' : '')}>
              {({ isActive }) => (
                <>
                  <n.icon size={17} className={isActive ? 'text-teal' : 'text-faint group-hover:text-mut'} />
                  <span>{n.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* persistent chat history — same conversations/loadConversation state as the popover above */}
        <div className="mt-2 px-3 flex-1 min-h-0 overflow-y-auto pb-3">
          <button onClick={() => setChatsOpen((o) => !o)} className="w-full flex items-center justify-between px-1 py-2 klbl">
            <span>Chats</span>
            <ChevronDown size={13} className={'transition ' + (chatsOpen ? '' : '-rotate-90')} />
          </button>
          {chatsOpen && (
            <div className="flex flex-col gap-0.5">
              {visibleChats.length === 0 && (
                <div className="px-2 py-2 text-[12px] text-faint">No previous conversations yet.</div>
              )}
              {visibleChats.map((c) => (
                <button key={c.id} onClick={() => (c.current ? nav('/') : pick(c.id))}
                  className={'group flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] text-left transition-colors ' +
                    (c.current && chatActive ? 'text-ink bg-teal/10' : 'text-mut hover:bg-raise hover:text-ink')}>
                  <MessageSquare size={13} className="text-faint shrink-0 group-hover:text-teal" />
                  <span className="truncate flex-1">{c.title}</span>
                  <span className="text-[10px] text-faint shrink-0">{dayLabel(c.ts)}</span>
                </button>
              ))}
              {chatList.length > 6 && (
                <button onClick={() => setShowAllChats((s) => !s)}
                  className="w-full flex items-center gap-1.5 px-2 py-2 text-[12px] text-mut hover:text-teal transition-colors">
                  <ArrowRight size={13} />
                  {showAllChats ? 'Show fewer chats' : 'View all chats'}
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

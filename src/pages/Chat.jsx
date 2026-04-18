import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Plus, Brain, MessageSquare, Send,
  Menu, X, Briefcase, ChevronDown, Loader2,
} from 'lucide-react'
import API from '../api/client'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import { timeAgo } from '../utils/formatters'

// ── Helpers ───────────────────────────────────────────────────────────────────

function groupSessions(sessions) {
  const now  = new Date()
  const tod  = new Date(now); tod.setHours(0, 0, 0, 0)
  const week = new Date(tod.getTime() - 6 * 86400000)
  const groups = [
    { label: 'Hoy',          items: [] },
    { label: 'Esta semana',  items: [] },
    { label: 'Anteriores',   items: [] },
  ]
  for (const s of sessions) {
    const t = new Date(s.created_at ?? 0).getTime()
    if (t >= tod.getTime())  groups[0].items.push(s)
    else if (t >= week.getTime()) groups[1].items.push(s)
    else groups[2].items.push(s)
  }
  return groups.filter(g => g.items.length > 0)
}

function sessionTitle(s) {
  if (s.title) return s.title
  if (s.case_id) return `Chat caso ${s.case_id}`
  if (s.message_count) return `Conversación · ${s.message_count} mensajes`
  return 'Nueva conversación'
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg, isFirstInGroup }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-2.5 items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* IA avatar */}
      {!isUser && (
        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mb-0.5 ${
          isFirstInGroup ? 'bg-brand-100' : 'opacity-0'
        }`}>
          <Brain className="w-3.5 h-3.5 text-brand-600" />
        </div>
      )}

      <div className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {isFirstInGroup && (
          <span className="text-[10px] font-semibold text-gray-400 px-1">
            {isUser ? 'Tú' : 'Asistente IA'}
          </span>
        )}
        <div
          className={[
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words',
            isUser
              ? 'bg-brand-600 text-white rounded-br-none'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm',
          ].join(' ')}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-gray-400 px-1">
          {msg.created_at ? timeAgo(msg.created_at) : ''}
        </span>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mb-0.5 ${
          isFirstInGroup ? 'bg-brand-600' : 'opacity-0'
        }`}>
          <span className="text-[10px] font-bold text-white">Tú</span>
        </div>
      )}
    </div>
  )
}

// ── Quick suggestions ─────────────────────────────────────────────────────────
const QUICK = [
  '¿Qué normativa aplica a +180 días?',
  'Rango típico para lumbago M54',
  'Proceso de calificación PCL',
  '¿Qué hacer con score >75?',
]

// ── Session item ──────────────────────────────────────────────────────────────
function SessionItem({ session, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150',
        isActive
          ? 'bg-brand-50 border-l-2 border-brand-500'
          : 'hover:bg-gray-50 border-l-2 border-transparent',
      ].join(' ')}
    >
      <p className="text-sm font-medium text-gray-800 truncate leading-snug">
        {sessionTitle(session)}
      </p>
      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
        {session.case_id && (
          <Badge variant="brand" size="sm">{session.case_id}</Badge>
        )}
        <span className="text-[11px] text-gray-400">
          {timeAgo(session.created_at ?? session.last_message_at)}
        </span>
      </div>
    </button>
  )
}

// ── SessionGroup divider ──────────────────────────────────────────────────────
function GroupDivider({ label }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Chat() {
  const [sessions,        setSessions]       = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [activeId,        setActiveId]        = useState(null)
  const [linkedCase,      setLinkedCase]      = useState(null)
  const [messages,        setMessages]        = useState([])
  const [loadingMsgs,     setLoadingMsgs]     = useState(false)
  const [input,           setInput]           = useState('')
  const [sending,         setSending]         = useState(false)
  const [sidebarOpen,     setSidebarOpen]     = useState(false)
  const [showLinkCase,    setShowLinkCase]     = useState(false)
  const [caseInput,       setCaseInput]       = useState('')

  const bottomRef   = useRef(null)
  const textareaRef = useRef(null)
  const linkRef     = useRef(null)

  // ── Fetch sessions ──────────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true)
    try {
      const { data } = await API.get('/api/v1/chat/sessions')
      const list = Array.isArray(data) ? data : (data.sessions ?? [])
      setSessions(list)
      if (list.length > 0 && !activeId) {
        setActiveId(list[0].session_id)
      }
    } catch {
      setSessions([])
    } finally {
      setLoadingSessions(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => { fetchSessions() }, [fetchSessions])

  // ── Load messages when session changes ──────────────────────────────────────
  useEffect(() => {
    if (!activeId) { setMessages([]); return }
    let cancelled = false
    const load = async () => {
      setLoadingMsgs(true)
      try {
        const { data } = await API.get(`/api/v1/chat/sessions/${activeId}/messages`)
        if (!cancelled) {
          const list = Array.isArray(data) ? data : (data.messages ?? [])
          setMessages(list)
          // Sync linked case from session
          const sess = sessions.find(s => s.session_id === activeId)
          if (sess?.case_id) setLinkedCase(sess.case_id)
          else setLinkedCase(null)
        }
      } catch {
        if (!cancelled) setMessages([])
      } finally {
        if (!cancelled) setLoadingMsgs(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [activeId]) // eslint-disable-line

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  // ── Close link case popover on outside click ────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (linkRef.current && !linkRef.current.contains(e.target)) setShowLinkCase(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── New session ─────────────────────────────────────────────────────────────
  const newSession = () => {
    const id = crypto.randomUUID()
    const newSess = { session_id: id, case_id: null, created_at: new Date().toISOString(), message_count: 0 }
    setSessions(prev => [newSess, ...prev])
    setActiveId(id)
    setMessages([])
    setLinkedCase(null)
    setSidebarOpen(false)
  }

  // ── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const content = (text ?? input).trim()
    if (!content || sending) return

    const sessionId = activeId ?? (() => {
      const id = crypto.randomUUID()
      const ns = { session_id: id, case_id: linkedCase, created_at: new Date().toISOString(), message_count: 0 }
      setSessions(prev => [ns, ...prev])
      setActiveId(id)
      return id
    })()

    const userMsg = { role: 'user', content, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setSending(true)

    try {
      const payload = { session_id: sessionId, pregunta: content }
      if (linkedCase) payload.case_id = linkedCase
      const { data } = await API.post('/api/v1/chat', payload)
      const reply = {
        role: 'assistant',
        content: data.respuesta ?? data.response ?? 'Sin respuesta del servidor.',
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, reply])
      // Refresh sessions to pick up message_count update
      fetchSessions()
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Hubo un error al procesar tu pregunta. Intenta de nuevo.',
        created_at: new Date().toISOString(),
      }])
    } finally {
      setSending(false)
    }
  }, [input, activeId, linkedCase, sending, fetchSessions])

  // ── Textarea handlers ────────────────────────────────────────────────────────
  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px'
    setInput(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Link case ────────────────────────────────────────────────────────────────
  const confirmLinkCase = () => {
    const v = caseInput.trim()
    if (!v) return
    setLinkedCase(v)
    setCaseInput('')
    setShowLinkCase(false)
    // Update session in state
    setSessions(prev => prev.map(s =>
      s.session_id === activeId ? { ...s, case_id: v } : s
    ))
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  const groups = groupSessions(sessions)
  const isEmptyChat = messages.length === 0 && !loadingMsgs

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">

      {/* ── Mobile overlay ──────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Left panel — sessions ─────────────────────────────────────────── */}
      <aside
        className={[
          'fixed md:relative inset-y-0 left-0 z-30 md:z-auto',
          'w-[280px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col',
          'transition-transform duration-200 md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-800">Conversaciones</span>
          <div className="flex items-center gap-1">
            <button
              onClick={newSession}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all"
              title="Nueva conversación"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                text-gray-400 hover:bg-gray-100 transition-all md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-2 px-2" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
          {loadingSessions && (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {!loadingSessions && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <MessageSquare className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Aún no hay conversaciones.<br />Empieza una nueva con el botón +
              </p>
            </div>
          )}

          {!loadingSessions && groups.map(group => (
            <div key={group.label}>
              <GroupDivider label={group.label} />
              {group.items.map(s => (
                <SessionItem
                  key={s.session_id}
                  session={s}
                  isActive={activeId === s.session_id}
                  onClick={() => { setActiveId(s.session_id); setSidebarOpen(false) }}
                />
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right panel — chat ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-gray-50/50 min-w-0 overflow-hidden">

        {/* Chat header */}
        <header className="h-14 bg-white border-b border-gray-100 px-4
          flex items-center gap-3 flex-shrink-0 shadow-card">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center
              rounded-lg text-gray-500 hover:bg-gray-100 transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {linkedCase ? (
              <>
                <Briefcase className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-800 truncate">
                  Chat sobre {linkedCase}
                </span>
                <Badge variant="brand" size="sm">{linkedCase}</Badge>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-800">Asistente IA</span>
              </>
            )}
          </div>

          {/* Link case button */}
          <div className="relative flex-shrink-0" ref={linkRef}>
            <button
              onClick={() => setShowLinkCase(v => !v)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium
                text-gray-600 border border-gray-200 bg-white hover:bg-gray-50
                transition-all duration-150"
            >
              <Briefcase className="w-3.5 h-3.5" />
              {linkedCase ? 'Cambiar caso' : 'Vincular caso'}
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {showLinkCase && (
              <div className="absolute right-0 top-10 w-64 bg-white border border-gray-200
                rounded-xl shadow-lifted z-50 p-3 animate-slide-down">
                <p className="text-xs font-medium text-gray-600 mb-2">ID del caso</p>
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={caseInput}
                    onChange={e => setCaseInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && confirmLinkCase()}
                    placeholder="Ej: CASO-2024-001"
                    className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-gray-200
                      focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <button
                    onClick={confirmLinkCase}
                    className="h-8 px-3 bg-brand-600 text-white text-xs font-medium
                      rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Vincular
                  </button>
                </div>
                {linkedCase && (
                  <button
                    onClick={() => { setLinkedCase(null); setShowLinkCase(false) }}
                    className="mt-2 text-xs text-red-500 hover:text-red-600 w-full text-left"
                  >
                    Quitar vínculo actual
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">

          {/* Loading skeleton */}
          {loadingMsgs && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`h-10 rounded-2xl bg-gray-200 animate-pulse ${
                    i % 2 === 0 ? 'w-48' : 'w-72'
                  }`} />
                </div>
              ))}
            </div>
          )}

          {/* Welcome card */}
          {!loadingMsgs && (
            <div className="flex justify-start">
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 max-w-[85%] animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-semibold text-brand-700">Asistente IA</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Soy tu asistente para evaluación de incapacidades. Puedo ayudarte con
                  normativa colombiana, análisis de casos y consultas CIE-10.
                </p>
              </div>
            </div>
          )}

          {/* Quick suggestions (only when empty) */}
          {!loadingMsgs && isEmptyChat && (
            <div className="grid grid-cols-2 gap-2 mt-2 max-w-[85%]">
              {QUICK.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-2.5 text-left text-xs text-gray-700 font-medium
                    bg-white border border-gray-200 rounded-xl hover:border-brand-300
                    hover:bg-brand-50 hover:text-brand-700 transition-all duration-150
                    leading-snug"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Conversation messages */}
          {!loadingMsgs && messages.map((msg, i) => (
            <Bubble key={i} msg={msg} isFirstInGroup={i === 0 || messages[i - 1].role !== msg.role} />
          ))}

          {/* Typing indicator */}
          {sending && <TypingDots />}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onInput={handleTextareaInput}
              onChange={() => {}}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta... (Enter para enviar, Shift+Enter nueva línea)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5
                text-sm text-gray-900 placeholder:text-gray-400 bg-white
                focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                transition-all duration-150 leading-relaxed"
              style={{ minHeight: '42px', maxHeight: '112px' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              className="w-10 h-10 flex-shrink-0 rounded-full bg-brand-600 text-white
                flex items-center justify-center transition-all duration-150
                hover:bg-brand-700 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending
                ? <Loader2 className="w-[18px] h-[18px] animate-spin" />
                : <Send className="w-[18px] h-[18px]" />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

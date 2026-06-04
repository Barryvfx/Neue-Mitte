'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User, AlertCircle } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

const STARTERS = [
  'Was ist die Position der Neuen Mitte zur Schuldenbremse?',
  'Erkläre mir das Bürgergeld einfach.',
  'Was denkt die Neue Mitte über Zuwanderung?',
  'Wie steht die Neue Mitte zur Digitalisierung?',
  'Erkläre mir die Energiepolitik der Neuen Mitte.',
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setError(null)
    const userMessage: Message = { role: 'user', content: msg }
    const history = [...messages, userMessage]
    setMessages(history)
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Fehler beim Abrufen der Antwort.')
      }
      const data = await res.json()
      setMessages([...history, { role: 'assistant', content: data.reply ?? data.message ?? 'Keine Antwort erhalten.' }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  const isEmpty = messages.length === 0

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-12 sm:py-14">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">KI-Assistent</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            <Bot className="h-8 w-8 opacity-80" />
            KI-Politikassistent
          </h1>
          <p className="text-white/60 text-sm flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            Powered by KI — kann Fehler machen. Nicht als Rechts- oder Politikberatung verstehen.
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 nm-container py-6 flex flex-col max-w-3xl mx-auto w-full">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-full bg-nm-blue/10 flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-nm-blue" />
            </div>
            <h2 className="text-lg font-black text-nm-blue mb-2">Wie kann ich Ihnen helfen?</h2>
            <p className="text-nm-muted text-sm mb-8 max-w-sm">
              Stellen Sie Fragen zur Neuen Mitte, zur deutschen Politik oder lassen Sie sich Themen erklären.
            </p>
            <div className="w-full max-w-xl space-y-2">
              {STARTERS.map(starter => (
                <button
                  key={starter}
                  onClick={() => send(starter)}
                  className="w-full text-left text-sm px-4 py-3 border border-nm-line rounded-xl hover:border-nm-blue hover:bg-nm-blue/5 text-nm-muted hover:text-nm-blue transition-all"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4 mb-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${m.role === 'user' ? 'bg-nm-blue text-white' : 'bg-nm-gray border border-nm-line text-nm-blue'}`}>
                  {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${m.role === 'user'
                    ? 'bg-nm-blue text-white rounded-tr-sm'
                    : 'bg-nm-gray border border-nm-line text-nm-text rounded-tl-sm'
                  }`}>
                  {m.content.split('\n').map((line, j) => (
                    <span key={j}>{line}{j < m.content.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-nm-gray border border-nm-line text-nm-blue">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-nm-gray border border-nm-line rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-nm-blue animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 bg-white pt-4 border-t border-nm-line">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Nachricht eingeben… (Enter senden, Shift+Enter neue Zeile)"
              className="nm-input resize-none flex-1 overflow-hidden"
              style={{ minHeight: 44 }}
              disabled={loading}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="btn-primary px-4 py-3 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[10px] text-nm-muted mt-2 text-center">
            KI kann Fehler machen. Wichtige Informationen immer überprüfen.
          </p>
        </div>
      </div>
    </div>
  )
}

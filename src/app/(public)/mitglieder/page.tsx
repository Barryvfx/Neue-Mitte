'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Users, Lock, LogOut, UserPlus, LogIn, MapPin, Star, MessageCircle, FileText, Send, Settings, Eye, EyeOff, Pencil, Check, X } from 'lucide-react'

interface Me {
  id: string
  name: string
  email: string
  city: string
  bio: string
  interests: string
  avatarColor: string
  avatarEmoji: string
  showName: boolean
  showCity: boolean
  showBio: boolean
  createdAt: string
}

interface Member {
  id: string
  name: string
  city: string
  bio: string
  interests: string
  avatarColor: string
  avatarEmoji: string
  createdAt: string
  isMe: boolean
}

interface ContentItem {
  id: string
  title: string
  type: string
  content: string
  createdAt: string
}

interface ChatMessage {
  id: string
  text: string
  createdAt: string
  isMe: boolean
  sender: { id: string; name: string; avatarColor: string; avatarEmoji: string }
}

const INTEREST_OPTIONS = [
  'Wirtschaft', 'Soziales', 'Bildung', 'Energie', 'Migration',
  'Sicherheit', 'Digitalisierung', 'Europa', 'Rente', 'Gesundheit',
]

const AVATAR_COLORS = [
  '#0B3A75', '#1D6FA4', '#16A085', '#27AE60', '#8E44AD',
  '#C0392B', '#E67E22', '#2C3E50', '#7F8C8D', '#E91E8C',
]

const AVATAR_EMOJIS = ['', '🦁', '🐻', '🦊', '🐺', '🦅', '🌟', '⚡', '🌊', '🔥', '🌿', '💡']

type Tab = 'community' | 'chat' | 'inhalte' | 'profil'
type Mode = 'login' | 'register'

function Avatar({ name, color, emoji, size = 'md' }: { name: string; color: string; emoji?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-2xl' }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-black flex-shrink-0`}
      style={{ background: color }}
    >
      {emoji ? (
        <span className={size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'}>{emoji}</span>
      ) : (
        <span className="text-white">{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

export default function MitgliederPage() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('community')
  const [members, setMembers] = useState<Member[]>([])
  const [content, setContent] = useState<ContentItem[]>([])
  const [mode, setMode] = useState<Mode>('login')

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatPollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auth form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Profile edit
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editInterests, setEditInterests] = useState<string[]>([])
  const [editColor, setEditColor] = useState('')
  const [editEmoji, setEditEmoji] = useState('')
  const [editShowName, setEditShowName] = useState(true)
  const [editShowCity, setEditShowCity] = useState(true)
  const [editShowBio, setEditShowBio] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/mitglied/me')
      if (res.ok) setMe(await res.json())
    } catch { /* not logged in */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchMe() }, [fetchMe])

  const fetchCommunity = useCallback(async () => {
    const [membersRes, contentRes] = await Promise.all([
      fetch('/api/mitglied/list'),
      fetch('/api/mitglieder'),
    ])
    if (membersRes.ok) setMembers(await membersRes.json())
    if (contentRes.ok) {
      const data = await contentRes.json()
      setContent(Array.isArray(data) ? data : [])
    }
  }, [])

  const fetchChat = useCallback(async () => {
    const res = await fetch('/api/mitglied/chat')
    if (res.ok) setMessages(await res.json())
  }, [])

  useEffect(() => {
    if (!me) return
    fetchCommunity()
  }, [me, fetchCommunity])

  // Poll chat when on chat tab
  useEffect(() => {
    if (!me || tab !== 'chat') {
      if (chatPollRef.current) { clearInterval(chatPollRef.current); chatPollRef.current = null }
      return
    }
    fetchChat()
    chatPollRef.current = setInterval(fetchChat, 4000)
    return () => { if (chatPollRef.current) clearInterval(chatPollRef.current) }
  }, [me, tab, fetchChat])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    const res = await fetch('/api/mitglied/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!res.ok) { setFormError(json.error); setSubmitting(false); return }
    await fetchMe()
    setSubmitting(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    const res = await fetch('/api/mitglied/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, city, bio, interests }),
    })
    const json = await res.json()
    if (!res.ok) { setFormError(json.error); setSubmitting(false); return }
    await fetchMe()
    setSubmitting(false)
  }

  async function handleLogout() {
    await fetch('/api/mitglied/logout', { method: 'POST' })
    setMe(null); setMembers([]); setContent([]); setMessages([])
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || chatSending) return
    setChatSending(true)
    const res = await fetch('/api/mitglied/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: chatInput }),
    })
    if (res.ok) {
      const msg = await res.json()
      setMessages(prev => [...prev, msg])
      setChatInput('')
    }
    setChatSending(false)
  }

  function startEditing() {
    if (!me) return
    setEditName(me.name)
    setEditCity(me.city)
    setEditBio(me.bio)
    setEditInterests(me.interests ? me.interests.split(',').filter(Boolean).map(s => s.trim()) : [])
    setEditColor(me.avatarColor)
    setEditEmoji(me.avatarEmoji)
    setEditShowName(me.showName)
    setEditShowCity(me.showCity)
    setEditShowBio(me.showBio)
    setEditing(true)
  }

  async function saveProfile() {
    setSaving(true)
    const res = await fetch('/api/mitglied/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editName, city: editCity, bio: editBio,
        interests: editInterests,
        avatarColor: editColor, avatarEmoji: editEmoji,
        showName: editShowName, showCity: editShowCity, showBio: editShowBio,
      }),
    })
    if (res.ok) {
      setMe(await res.json())
      setEditing(false)
      fetchCommunity()
    }
    setSaving(false)
  }

  function toggleInterest(i: string) {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }
  function toggleEditInterest(i: string) {
    setEditInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  }
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-nm-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Exklusiv</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 opacity-80" />
            Mitglieder-Panel
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            {me
              ? `Willkommen, ${me.name}!`
              : 'Melde dich an oder werde Mitglied – kostenlos und unabhängig von deiner Unterstützung.'}
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        {!me ? (
          <div className="max-w-md mx-auto">
            <div className="flex border border-nm-line rounded-xl overflow-hidden mb-8">
              <button
                onClick={() => { setMode('login'); setFormError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-nm-blue text-white' : 'text-nm-muted hover:bg-nm-gray'}`}
              >
                <LogIn className="h-4 w-4" /> Anmelden
              </button>
              <button
                onClick={() => { setMode('register'); setFormError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${mode === 'register' ? 'bg-nm-blue text-white' : 'text-nm-muted hover:bg-nm-gray'}`}
              >
                <UserPlus className="h-4 w-4" /> Mitglied werden
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="nm-label">E-Mail</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="nm-input" placeholder="deine@email.de" required />
                </div>
                <div>
                  <label className="nm-label">Passwort</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="nm-input" placeholder="••••••••" required />
                </div>
                {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                  {submitting ? 'Lädt…' : 'Anmelden'}
                </button>
                <p className="text-center text-sm text-nm-muted">
                  Noch kein Mitglied?{' '}
                  <button type="button" onClick={() => setMode('register')} className="text-nm-blue font-semibold hover:underline">Jetzt registrieren</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="nm-label">Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="nm-input" placeholder="Max Mustermann" required />
                </div>
                <div>
                  <label className="nm-label">E-Mail *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="nm-input" placeholder="deine@email.de" required />
                </div>
                <div>
                  <label className="nm-label">Passwort * (mind. 8 Zeichen)</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="nm-input" placeholder="••••••••" required />
                </div>
                <div>
                  <label className="nm-label">Wohnort</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} className="nm-input" placeholder="Berlin" />
                </div>
                <div>
                  <label className="nm-label">Kurze Vorstellung</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="nm-input" placeholder="Wer bist du?" />
                </div>
                <div>
                  <label className="nm-label">Interessen</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {INTEREST_OPTIONS.map(i => (
                      <button key={i} type="button" onClick={() => toggleInterest(i)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${interests.includes(i) ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue'}`}>
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
                {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                  {submitting ? 'Registriere…' : 'Mitglied werden'}
                </button>
                <p className="text-xs text-nm-muted text-center">
                  Kostenlos und unverbindlich. Du kannst die Neue Mitte auch ohne Mitgliedschaft{' '}
                  <Link href="/unterstuetzen" className="text-nm-blue hover:underline">unterstützen</Link>.
                </p>
              </form>
            )}
          </div>
        ) : (
          <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-nm-line">
              <div className="flex items-center gap-3">
                <Avatar name={me.name} color={me.avatarColor} emoji={me.avatarEmoji} size="md" />
                <div>
                  <p className="font-black text-nm-text text-sm">{me.name}</p>
                  {me.city && <p className="text-xs text-nm-muted flex items-center gap-1"><MapPin className="h-3 w-3" />{me.city}</p>}
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-nm-muted hover:text-red-500 transition-colors">
                <LogOut className="h-4 w-4" /> Abmelden
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mb-8 border-b border-nm-line overflow-x-auto">
              {([
                { key: 'community', label: 'Community', Icon: Users },
                { key: 'chat', label: 'Chat', Icon: MessageCircle },
                { key: 'inhalte', label: 'Inhalte', Icon: FileText },
                { key: 'profil', label: 'Einstellungen', Icon: Settings },
              ] as { key: Tab; label: string; Icon: React.ElementType }[]).map(({ key, label, Icon }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap -mb-px ${tab === key ? 'border-nm-blue text-nm-blue' : 'border-transparent text-nm-muted hover:text-nm-text'}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>

            {/* Community tab */}
            {tab === 'community' && (
              <div>
                <p className="text-nm-muted text-sm mb-6">{members.length} Mitglieder in der Community.</p>
                {members.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-12 w-12 text-nm-line mx-auto mb-4" />
                    <p className="text-nm-muted">Noch keine anderen Mitglieder.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map(m => (
                      <div key={m.id} className={`border rounded-xl p-4 ${m.isMe ? 'border-nm-blue bg-nm-blue/5' : 'border-nm-line hover:border-nm-blue/30 transition-colors'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar name={m.name} color={m.avatarColor} emoji={m.avatarEmoji} size="sm" />
                          <div className="min-w-0">
                            <p className="font-bold text-nm-text text-sm truncate">
                              {m.name} {m.isMe && <span className="text-nm-blue text-xs">(Du)</span>}
                            </p>
                            {m.city && (
                              <p className="text-xs text-nm-muted flex items-center gap-0.5">
                                <MapPin className="h-3 w-3 flex-shrink-0" />{m.city}
                              </p>
                            )}
                          </div>
                        </div>
                        {m.bio && <p className="text-xs text-nm-muted leading-relaxed mb-3 line-clamp-2">{m.bio}</p>}
                        {m.interests && (
                          <div className="flex flex-wrap gap-1">
                            {m.interests.split(',').filter(Boolean).slice(0, 3).map(i => (
                              <span key={i} className="px-2 py-0.5 bg-nm-gray text-nm-muted text-[10px] font-semibold rounded-full">{i.trim()}</span>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] text-nm-muted mt-3">Dabei seit {formatDate(m.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chat tab */}
            {tab === 'chat' && (
              <div className="max-w-2xl flex flex-col" style={{ height: '520px' }}>
                <div className="flex-1 overflow-y-auto border border-nm-line rounded-xl p-4 space-y-3 bg-nm-gray/30 mb-3">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <MessageCircle className="h-10 w-10 text-nm-line mx-auto mb-3" />
                      <p className="text-nm-muted text-sm">Noch keine Nachrichten. Sei der Erste!</p>
                    </div>
                  )}
                  {messages.map((msg, idx) => {
                    const prevMsg = messages[idx - 1]
                    const showSender = !prevMsg || prevMsg.sender.id !== msg.sender.id
                    return (
                      <div key={msg.id} className={`flex gap-2.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                        {showSender && !msg.isMe && (
                          <Avatar name={msg.sender.name} color={msg.sender.avatarColor} emoji={msg.sender.avatarEmoji} size="sm" />
                        )}
                        {!showSender && !msg.isMe && <div className="w-8 flex-shrink-0" />}
                        <div className={`max-w-[72%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                          {showSender && !msg.isMe && (
                            <p className="text-[10px] font-bold text-nm-muted px-1">{msg.sender.name}</p>
                          )}
                          <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${msg.isMe ? 'bg-nm-blue text-white rounded-tr-sm' : 'bg-white border border-nm-line text-nm-text rounded-tl-sm'}`}>
                            {msg.text}
                          </div>
                          <p className={`text-[10px] text-nm-muted px-1 ${msg.isMe ? 'text-right' : ''}`}>{formatTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Nachricht schreiben…"
                    maxLength={500}
                    className="nm-input flex-1"
                  />
                  <button type="submit" disabled={!chatInput.trim() || chatSending}
                    className="btn-primary px-4 py-2.5 disabled:opacity-50">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Content tab */}
            {tab === 'inhalte' && (
              <div className="max-w-2xl">
                {content.length === 0 ? (
                  <div className="text-center py-16">
                    <Lock className="h-12 w-12 text-nm-line mx-auto mb-4" />
                    <p className="text-nm-muted">Noch keine exklusiven Inhalte vorhanden.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {content.map(item => (
                      <div key={item.id} className="border border-nm-line rounded-xl p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-black text-nm-blue text-base">{item.title}</h3>
                          <span className="text-xs text-nm-muted flex-shrink-0">{formatDate(item.createdAt)}</span>
                        </div>
                        {item.content.split('\n\n').map((para, i) => (
                          <p key={i} className="text-nm-muted text-sm leading-relaxed mb-2 last:mb-0">{para}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings / Profile tab */}
            {tab === 'profil' && (
              <div className="max-w-lg">
                {!editing ? (
                  <div className="border border-nm-line rounded-xl p-6 space-y-5">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-4">
                      <Avatar name={me.name} color={me.avatarColor} emoji={me.avatarEmoji} size="lg" />
                      <div>
                        <h2 className="text-xl font-black text-nm-text">{me.name}</h2>
                        <p className="text-sm text-nm-muted">{me.email}</p>
                      </div>
                    </div>

                    {me.city && (
                      <div className="flex items-center gap-2 text-nm-muted text-sm">
                        <MapPin className="h-4 w-4" /><span>{me.city}</span>
                      </div>
                    )}
                    {me.bio && (
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-nm-muted mb-1">Über mich</p>
                        <p className="text-sm text-nm-text leading-relaxed">{me.bio}</p>
                      </div>
                    )}
                    {me.interests && (
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-nm-muted mb-2">Interessen</p>
                        <div className="flex flex-wrap gap-2">
                          {me.interests.split(',').filter(Boolean).map(i => (
                            <span key={i} className="px-3 py-1 bg-nm-blue/10 text-nm-blue text-xs font-semibold rounded-full">{i.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Privacy summary */}
                    <div className="border-t border-nm-line pt-4">
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-nm-muted mb-3">Datenschutz-Einstellungen</p>
                      <div className="space-y-2 text-sm">
                        {[
                          { label: 'Name sichtbar', val: me.showName },
                          { label: 'Wohnort sichtbar', val: me.showCity },
                          { label: 'Bio sichtbar', val: me.showBio },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-nm-muted">{label}</span>
                            <span className={`flex items-center gap-1 text-xs font-semibold ${val ? 'text-green-600' : 'text-nm-muted'}`}>
                              {val ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                              {val ? 'Sichtbar' : 'Verborgen'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={startEditing} className="btn-primary flex items-center gap-2 w-full justify-center">
                      <Pencil className="h-4 w-4" /> Profil bearbeiten
                    </button>
                  </div>
                ) : (
                  <div className="border border-nm-line rounded-xl p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-nm-blue">Profil bearbeiten</h3>
                      <button onClick={() => setEditing(false)} className="text-nm-muted hover:text-nm-text">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Avatar preview */}
                    <div className="flex items-center gap-4">
                      <Avatar name={editName || me.name} color={editColor} emoji={editEmoji} size="lg" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-nm-muted mb-2">Avatar-Farbe</p>
                        <div className="flex flex-wrap gap-2">
                          {AVATAR_COLORS.map(c => (
                            <button key={c} type="button" onClick={() => setEditColor(c)}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${editColor === c ? 'border-white shadow-lg scale-110' : 'border-transparent'}`}
                              style={{ background: c }} />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-nm-muted mb-2 mt-3">Emoji (optional)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {AVATAR_EMOJIS.map(e => (
                            <button key={e || 'none'} type="button" onClick={() => setEditEmoji(e)}
                              className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border transition-colors ${editEmoji === e ? 'border-nm-blue bg-nm-blue/10' : 'border-nm-line hover:border-nm-blue/40'}`}>
                              {e || <span className="text-xs text-nm-muted">A</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="nm-label">Name</label>
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="nm-input" />
                    </div>
                    <div>
                      <label className="nm-label">Wohnort</label>
                      <input type="text" value={editCity} onChange={e => setEditCity(e.target.value)} className="nm-input" placeholder="Berlin" />
                    </div>
                    <div>
                      <label className="nm-label">Über mich</label>
                      <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} className="nm-input" />
                    </div>
                    <div>
                      <label className="nm-label">Interessen</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {INTEREST_OPTIONS.map(i => (
                          <button key={i} type="button" onClick={() => toggleEditInterest(i)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${editInterests.includes(i) ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue'}`}>
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Privacy toggles */}
                    <div className="border-t border-nm-line pt-4">
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-nm-muted mb-3">Datenschutz</p>
                      <p className="text-xs text-nm-muted mb-3">Steuere, was andere Mitglieder von dir sehen können.</p>
                      <div className="space-y-3">
                        {[
                          { label: 'Name für andere sichtbar', val: editShowName, set: setEditShowName },
                          { label: 'Wohnort für andere sichtbar', val: editShowCity, set: setEditShowCity },
                          { label: 'Bio für andere sichtbar', val: editShowBio, set: setEditShowBio },
                        ].map(({ label, val, set }) => (
                          <label key={label} className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-nm-text">{label}</span>
                            <button type="button" onClick={() => set(!val)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${val ? 'bg-nm-blue' : 'bg-nm-line'}`}>
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${val ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={saveProfile} disabled={saving} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                        <Check className="h-4 w-4" /> {saving ? 'Speichern…' : 'Speichern'}
                      </button>
                      <button onClick={() => setEditing(false)} className="btn-outline px-4">Abbrechen</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

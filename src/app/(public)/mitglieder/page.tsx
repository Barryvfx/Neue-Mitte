'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Users, Lock, LogOut, UserPlus, LogIn, MapPin, Star, MessageCircle, FileText } from 'lucide-react'

interface Me {
  id: string
  name: string
  email: string
  city: string
  bio: string
  interests: string
  createdAt: string
}

interface Member {
  id: string
  name: string
  city: string
  bio: string
  interests: string
  createdAt: string
}

interface ContentItem {
  id: string
  title: string
  type: string
  content: string
  createdAt: string
}

const INTEREST_OPTIONS = [
  'Wirtschaft', 'Soziales', 'Bildung', 'Energie', 'Migration',
  'Sicherheit', 'Digitalisierung', 'Europa', 'Rente', 'Gesundheit',
]

type Tab = 'community' | 'inhalte' | 'profil'
type Mode = 'login' | 'register'

export default function MitgliederPage() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('community')
  const [members, setMembers] = useState<Member[]>([])
  const [content, setContent] = useState<ContentItem[]>([])
  const [mode, setMode] = useState<Mode>('login')

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/mitglied/me')
      if (res.ok) {
        setMe(await res.json())
      }
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

  useEffect(() => {
    if (me) fetchCommunity()
  }, [me, fetchCommunity])

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
    setMe(null)
    setMembers([])
    setContent([])
  }

  function toggleInterest(i: string) {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
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
      {/* Header */}
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Exklusiv</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 opacity-80" />
            Mitglieder-Panel
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            {me
              ? `Willkommen, ${me.name}! Hier vernetzt du dich mit anderen Mitgliedern.`
              : 'Melde dich an oder werde Mitglied – kostenlos und unabhängig von deiner Unterstützung.'}
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        {!me ? (
          /* Not logged in – show login / register */
          <div className="max-w-md mx-auto">
            {/* Mode toggle */}
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
                  <button type="button" onClick={() => setMode('register')} className="text-nm-blue font-semibold hover:underline">
                    Jetzt registrieren
                  </button>
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
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="nm-input" placeholder="Wer bist du? Was treibt dich an?" />
                </div>
                <div>
                  <label className="nm-label">Interessen (mehrere wählbar)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {INTEREST_OPTIONS.map(i => (
                      <button
                        key={i} type="button"
                        onClick={() => toggleInterest(i)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${interests.includes(i) ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue hover:text-nm-blue'}`}
                      >
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
          /* Logged in – member panel */
          <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-nm-line">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-nm-blue text-white flex items-center justify-center font-black text-sm">
                  {me.name.charAt(0).toUpperCase()}
                </div>
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
            <div className="flex gap-1 mb-8 border-b border-nm-line">
              {([
                { key: 'community', label: 'Community', Icon: Users },
                { key: 'inhalte', label: 'Exklusive Inhalte', Icon: FileText },
                { key: 'profil', label: 'Mein Profil', Icon: Star },
              ] as { key: Tab; label: string; Icon: React.ElementType }[]).map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab === key ? 'border-nm-blue text-nm-blue' : 'border-transparent text-nm-muted hover:text-nm-text'}`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>

            {/* Community tab */}
            {tab === 'community' && (
              <div>
                <p className="text-nm-muted text-sm mb-6">{members.length} Mitglieder haben sich bisher angemeldet.</p>
                {members.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-12 w-12 text-nm-line mx-auto mb-4" />
                    <p className="text-nm-muted">Noch keine anderen Mitglieder. Lade Gleichgesinnte ein!</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map(m => (
                      <div key={m.id} className={`border rounded-xl p-4 ${m.id === me.id ? 'border-nm-blue bg-nm-blue/5' : 'border-nm-line hover:border-nm-blue/30 transition-colors'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-nm-blue/10 text-nm-blue flex items-center justify-center font-black text-sm flex-shrink-0">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-nm-text text-sm truncate">{m.name} {m.id === me.id && <span className="text-nm-blue">(Du)</span>}</p>
                            {m.city && <p className="text-xs text-nm-muted flex items-center gap-0.5"><MapPin className="h-3 w-3 flex-shrink-0" />{m.city}</p>}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Exclusive content tab */}
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
                          <span className="text-xs text-nm-muted flex-shrink-0">
                            {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
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

            {/* Profile tab */}
            {tab === 'profil' && (
              <div className="max-w-lg">
                <div className="border border-nm-line rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-16 h-16 rounded-full bg-nm-blue text-white flex items-center justify-center font-black text-2xl">
                      {me.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-nm-text">{me.name}</h2>
                      <p className="text-sm text-nm-muted">{me.email}</p>
                    </div>
                  </div>

                  {me.city && (
                    <div className="flex items-center gap-2 text-nm-muted text-sm">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{me.city}</span>
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

                  <div className="pt-2 border-t border-nm-line flex items-center gap-2 text-xs text-nm-muted">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Mitglied seit {new Date(me.createdAt).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

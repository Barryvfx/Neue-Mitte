'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Lock, FileText, FilePen, Star, Loader2, ShieldAlert } from 'lucide-react'

interface MitgliederItem {
  id: string
  title: string
  type: 'dokument' | 'entwurf' | 'exklusiv'
  content: string
  createdAt: string
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string; Icon: React.ElementType }> = {
  'dokument': { label: 'Dokument', bg: 'bg-blue-100',   text: 'text-blue-800',   Icon: FileText },
  'entwurf':  { label: 'Entwurf',  bg: 'bg-amber-100',  text: 'text-amber-800',  Icon: FilePen },
  'exklusiv': { label: 'Exklusiv', bg: 'bg-purple-100', text: 'text-purple-800', Icon: Star },
}

export default function MitgliederPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [items, setItems] = useState<MitgliederItem[]>([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [emailChecked, setEmailChecked] = useState(false)

  // Check localStorage for email first
  useEffect(() => {
    const stored = localStorage.getItem('nm_supporter_email')
    setEmail(stored)
    setEmailChecked(true)
  }, [])

  const fetchContent = useCallback(async () => {
    if (!email) { setLoading(false); return }
    try {
      const res = await fetch('/api/mitglieder')
      if (res.status === 401) {
        setAccessDenied(true)
        setLoading(false)
        return
      }
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [email])

  useEffect(() => {
    if (emailChecked) fetchContent()
  }, [emailChecked, fetchContent])

  // Group by type
  const grouped: Record<string, MitgliederItem[]> = {}
  for (const item of items) {
    if (!grouped[item.type]) grouped[item.type] = []
    grouped[item.type].push(item)
  }
  const typeOrder: Array<'exklusiv' | 'dokument' | 'entwurf'> = ['exklusiv', 'dokument', 'entwurf']

  if (!emailChecked) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-nm-blue" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Exklusiv</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Lock className="h-8 w-8 sm:h-10 sm:w-10 opacity-80" />
            Mitgliederbereich
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Exklusive Inhalte für bestätigte Unterstützer der Neuen Mitte.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        {/* Not logged in */}
        {!email ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-nm-blue/10 mb-6">
              <Lock className="h-8 w-8 text-nm-blue" />
            </div>
            <h2 className="text-2xl font-black text-nm-blue mb-3">Nur für bestätigte Unterstützer</h2>
            <p className="text-nm-muted mb-8 leading-relaxed">
              Dieser Bereich ist exklusiv für Mitglieder und Unterstützer der Neuen Mitte.
              Bestätigen Sie Ihre Unterstützung, um Zugang zu erhalten.
            </p>
            <Link href="/unterstuetzen" className="btn-primary text-base px-8 py-3.5">
              Jetzt Unterstützer werden
            </Link>
          </div>
        ) : accessDenied ? (
          /* Access denied (401) */
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
              <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-nm-blue mb-3">Zugang verweigert</h2>
            <p className="text-nm-muted mb-6 leading-relaxed">
              Ihr Konto wurde noch nicht bestätigt oder hat keinen Zugriff auf diesen Bereich.
              Bitte kontaktieren Sie uns oder bestätigen Sie Ihre E-Mail-Adresse.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/unterstuetzen/bestaetigen" className="btn-primary">E-Mail bestätigen</Link>
              <Link href="/kontakt" className="btn-outline">Kontakt aufnehmen</Link>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-24 gap-2 text-nm-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Inhalte werden geladen…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Star className="h-14 w-14 text-nm-line mx-auto mb-4" />
            <p className="text-nm-muted text-lg font-semibold mb-1">Willkommen, {email}</p>
            <p className="text-nm-muted text-sm">Noch keine Mitgliederinhalte vorhanden.</p>
          </div>
        ) : (
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-nm-muted mb-8 bg-nm-gray border border-nm-line rounded-xl px-4 py-3">
              <Lock className="h-4 w-4 text-nm-blue flex-shrink-0" />
              <span>Eingeloggt als <strong className="text-nm-text">{email}</strong></span>
            </div>

            <div className="space-y-10">
              {typeOrder.map(type => {
                const typeItems = grouped[type]
                if (!typeItems || typeItems.length === 0) return null
                const cfg = TYPE_CONFIG[type]
                const Icon = cfg.Icon

                return (
                  <div key={type}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
                        <Icon className="h-3.5 w-3.5" /> {cfg.label}e
                      </span>
                      <div className="flex-1 h-px bg-nm-line" />
                    </div>

                    <div className="space-y-4">
                      {typeItems.map(item => (
                        <div key={item.id} className="border border-nm-line rounded-xl p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-black text-nm-blue text-base">{item.title}</h3>
                            <span className="text-xs text-nm-muted flex-shrink-0">
                              {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            {item.content.split('\n\n').map((para, i) => (
                              <p key={i} className="text-nm-muted text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

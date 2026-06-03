'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supporterSchema } from '@/lib/validations'
import type { z } from 'zod'
import Link from 'next/link'
import MemberCard from '@/components/sections/MemberCard'

type SupporterData = z.infer<typeof supporterSchema>
type TickerChoice = 'first' | 'city' | 'both' | 'custom'

const GOALS = [
  { label: 'Erste 100', target: 100 },
  { label: '500 Unterstützer', target: 500 },
  { label: '1.000 Unterstützer', target: 1000 },
]

export default function UnterstuetzenPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<{ firstName: string; lastName: string; city?: string } | null>(null)
  const [alreadySigned, setAlreadySigned] = useState(false)
  const [error, setError] = useState('')
  const [showInTicker, setShowInTicker] = useState(false)
  const [tickerChoice, setTickerChoice] = useState<TickerChoice>('both')
  const [customText, setCustomText] = useState('')

  useEffect(() => {
    fetch('/api/supporters/token')
      .then((r) => r.json())
      .then((data) => { if (data.used) setAlreadySigned(true) })
      .catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SupporterData>({ resolver: zodResolver(supporterSchema) })

  const firstName = watch('firstName') ?? ''
  const city = watch('city') ?? ''

  function getTickerName(): string {
    switch (tickerChoice) {
      case 'first': return firstName || 'Dein Vorname'
      case 'city': return city ? `aus ${city}` : 'aus Deiner Stadt'
      case 'both': return `${firstName || 'Dein Vorname'}${city ? ` aus ${city}` : ''}`
      case 'custom': return customText || 'Dein eigener Text'
    }
  }

  async function onSubmit(data: SupporterData) {
    setError('')
    const tickerName = showInTicker
      ? (tickerChoice === 'custom' ? customText : getTickerName())
      : undefined

    try {
      const res = await fetch('/api/supporters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, showInTicker, tickerName }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Ein Fehler ist aufgetreten.'); return }
      setSubmittedData({ firstName: data.firstName, lastName: data.lastName, city: data.city })
      setSubmitted(true)
    } catch {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.')
    }
  }

  return (
    <div className="bg-white">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Mitmachen</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Jetzt unterstützen</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Zeigen Sie, dass es in Deutschland eine politische Mitte gibt, die pragmatisch, lösungsorientiert und glaubwürdig ist.
          </p>
        </div>
      </div>

      <div className="nm-container py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">

          {/* Form */}
          <div className="lg:col-span-7">
            {submitted && submittedData ? (
              <div>
                <div className="border border-nm-line bg-nm-gray p-8 mb-2">
                  <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-nm-blue mb-2">Vielen Dank</p>
                  <h2 className="text-2xl font-black text-nm-blue mb-3">Sie stehen jetzt für die Neue Mitte.</h2>
                  <p className="text-nm-muted leading-relaxed mb-6">
                    Ihre Unterstützung ist ein Signal: Deutschland braucht eine pragmatische Mitte. Wir freuen uns, Sie an unserer Seite zu haben.
                  </p>
                  <Link href="/programm" className="btn-primary">Programm lesen</Link>
                </div>
                <MemberCard
                  firstName={submittedData.firstName}
                  lastName={submittedData.lastName}
                  city={submittedData.city}
                />
              </div>
            ) : alreadySigned ? (
              <div className="border border-nm-line bg-nm-gray p-8">
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-nm-blue mb-2">Bereits registriert</p>
                <h2 className="text-2xl font-black text-nm-blue mb-3">Sie haben bereits unterschrieben.</h2>
                <p className="text-nm-muted leading-relaxed mb-6">
                  Ihre Unterstützung ist bereits registriert. Vielen Dank, dass Sie dabei sind!
                </p>
                <Link href="/programm" className="btn-primary">Programm lesen</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="nm-label">Vorname *</label>
                    <input id="firstName" {...register('firstName')} className="nm-input" placeholder="Max" />
                    {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="nm-label">Nachname *</label>
                    <input id="lastName" {...register('lastName')} className="nm-input" placeholder="Mustermann" />
                    {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="nm-label">E-Mail-Adresse *</label>
                  <input id="email" type="email" {...register('email')} className="nm-input" placeholder="max@beispiel.de" />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="nm-label">Wohnort</label>
                  <input id="city" {...register('city')} className="nm-input" placeholder="Berlin" />
                  {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="nm-label">Nachricht (optional)</label>
                  <textarea id="message" {...register('message')} rows={4} className="nm-input" placeholder="Was bewegt Sie?" />
                  {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {/* Ticker opt-in */}
                <div className="border border-nm-line bg-nm-gray p-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInTicker}
                      onChange={(e) => setShowInTicker(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-nm-blue focus:ring-nm-blue"
                    />
                    <div>
                      <span className="text-sm font-semibold text-nm-blue">Auf der Website erscheinen</span>
                      <p className="text-xs text-nm-muted mt-0.5">Ihr Name oder Ort wird im Unterstützer-Ticker angezeigt.</p>
                    </div>
                  </label>

                  {showInTicker && (
                    <div className="pl-7 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {([
                          ['first', 'Vorname'],
                          ['city', 'Wohnort'],
                          ['both', 'Vorname + Ort'],
                          ['custom', 'Eigener Text'],
                        ] as [TickerChoice, string][]).map(([val, label]) => (
                          <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="tickerChoice"
                              value={val}
                              checked={tickerChoice === val}
                              onChange={() => setTickerChoice(val)}
                              className="text-nm-blue"
                            />
                            <span className="text-nm-muted">{label}</span>
                          </label>
                        ))}
                      </div>

                      {tickerChoice === 'custom' && (
                        <input
                          type="text"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          maxLength={100}
                          placeholder="z. B. Ein Bürger aus Hamburg"
                          className="nm-input text-sm"
                        />
                      )}

                      {/* Live preview */}
                      <div className="flex items-center gap-2.5 bg-white border border-nm-line rounded-full px-4 py-2 text-sm w-fit">
                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        <span className="text-nm-muted text-xs">Neuester Unterstützer:</span>
                        <span className="font-bold text-nm-blue text-xs">{getTickerName()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
                )}

                <div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
                    {isSubmitting ? 'Wird gesendet…' : 'Jetzt unterstützen'}
                  </button>
                  <p className="text-[11px] text-nm-muted mt-3">
                    Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer{' '}
                    <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link> zu.
                    Diese Unterstützung ist kostenfrei und unverbindlich.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5 mt-12 lg:mt-0 space-y-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-4">Warum unterstützen?</p>
              <ul className="space-y-4">
                {[
                  'Sie zeigen, dass es eine schweigende Mehrheit der Mitte gibt.',
                  'Sie geben einem neuen politischen Projekt Sichtbarkeit.',
                  'Sie erhalten Updates über die Entwicklung der Neuen Mitte.',
                  'Sie helfen dabei, das Programm in die öffentliche Debatte zu tragen.',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-nm-muted leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-nm-blue flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-nm-line pt-8">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-4">Meilensteine</p>
              <ul className="space-y-3">
                {GOALS.map((goal) => (
                  <li key={goal.label} className="flex justify-between text-sm">
                    <span className="text-nm-muted">{goal.label}</span>
                    <span className="font-bold text-nm-blue">{goal.target.toLocaleString('de-DE')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-nm-line pt-8">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-3">Fragen?</p>
              <p className="text-sm text-nm-muted leading-relaxed">
                Bei Fragen zur Unterstützung wenden Sie sich an{' '}
                <a href="mailto:info@neue-mitte.org" className="text-nm-blue hover:underline">info@neue-mitte.org</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

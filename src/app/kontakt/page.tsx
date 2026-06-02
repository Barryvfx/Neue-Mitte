'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema } from '@/lib/validations'
import type { z } from 'zod'
import Link from 'next/link'

type ContactData = z.infer<typeof contactSchema>

export default function KontaktPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactData) {
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Ein Fehler ist aufgetreten.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.')
    }
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
            Neue Mitte
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Kontakt
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Fragen, Anmerkungen, Medienanfragen – wir freuen uns über jede Nachricht.
          </p>
        </div>
      </div>

      <div className="nm-container py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">

          {/* Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="border border-nm-line bg-nm-gray p-8">
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-nm-blue mb-2">
                  Nachricht erhalten
                </p>
                <h2 className="text-2xl font-black text-nm-blue mb-3">
                  Vielen Dank für Ihre Nachricht.
                </h2>
                <p className="text-nm-muted leading-relaxed">
                  Wir melden uns so bald wie möglich bei Ihnen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Honeypot */}
                <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="nm-label">Name *</label>
                    <input id="name" {...register('name')} className="nm-input" placeholder="Max Mustermann" />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="nm-label">E-Mail *</label>
                    <input id="email" type="email" {...register('email')} className="nm-input" placeholder="max@beispiel.de" />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="nm-label">Betreff *</label>
                  <input id="subject" {...register('subject')} className="nm-input" placeholder="Ihr Betreff" />
                  {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="nm-label">Nachricht *</label>
                  <textarea id="message" {...register('message')} rows={6} className="nm-input" placeholder="Ihre Nachricht…" />
                  {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
                    {error}
                  </div>
                )}

                <div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
                    {isSubmitting ? 'Wird gesendet…' : 'Nachricht senden'}
                  </button>
                  <p className="text-[11px] text-nm-muted mt-3">
                    Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer{' '}
                    <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link> zu.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Contact info */}
          <aside className="lg:col-span-5 mt-12 lg:mt-0 space-y-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-4">
                Direktkontakt
              </p>
              <div className="space-y-3 text-sm text-nm-muted">
                <div>
                  <span className="font-semibold text-nm-blue block">E-Mail</span>
                  <a href="mailto:info@neue-mitte.org" className="hover:underline">info@neue-mitte.org</a>
                </div>
                <div>
                  <span className="font-semibold text-nm-blue block">Telefon</span>
                  <a href="tel:+4915252990491" className="hover:underline">+49 152 52990491</a>
                </div>
              </div>
            </div>

            <div className="border-t border-nm-line pt-8">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-4">
                Anschrift
              </p>
              <address className="text-sm text-nm-muted not-italic leading-relaxed">
                Nico Waitkus<br />
                Pestalozzistr. 17<br />
                34260 Kaufungen<br />
                Deutschland
              </address>
            </div>

            <div className="border-t border-nm-line pt-8">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-3">
                Rechtliches
              </p>
              <p className="text-sm text-nm-muted leading-relaxed">
                Vollständige Angaben im{' '}
                <Link href="/impressum" className="text-nm-blue hover:underline">Impressum</Link>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

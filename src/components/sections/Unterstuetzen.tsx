'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supporterSchema, type SupporterInput } from '@/lib/validations'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface UnterstuetzenProps {
  count: number
}

export default function Unterstuetzen({ count }: UnterstuetzenProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupporterInput>({
    resolver: zodResolver(supporterSchema),
  })

  const onSubmit = async (data: SupporterInput) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/supporters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMsg(json.error ?? 'Ein Fehler ist aufgetreten.')
        setStatus('error')
        return
      }
      setStatus('success')
      reset()
    } catch {
      setErrorMsg('Verbindungsfehler. Bitte versuchen Sie es erneut.')
      setStatus('error')
    }
  }

  return (
    <section id="unterstuetzen" className="py-24 bg-gray-50 dark:bg-gray-900" ref={ref}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Gemeinsam für Deutschland</span>
            <h2 className="section-title mb-5">
              Werden Sie <br />
              <span className="text-nm-sky">Unterstützer</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Zeigen Sie, dass Deutschland eine pragmatische Mitte braucht. Ihre
              Unterstützung ist ein klares Zeichen: Wir wollen Politik, die
              Ergebnisse liefert, nicht nur Versprechen macht.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { title: 'Kostenlos & unverbindlich', desc: 'Keine Mitgliedsbeiträge, keine Verpflichtungen.' },
                { title: 'DSGVO-konform', desc: 'Ihre Daten werden sicher gespeichert und nicht weitergegeben.' },
                { title: 'Jederzeit widerrufbar', desc: 'Sie können Ihre Unterstützung jederzeit zurückziehen.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-nm-sky flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-nm-blue/5 dark:bg-nm-sky/5 border border-nm-blue/15 dark:border-nm-sky/15 rounded-xl">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong className="text-gray-800 dark:text-gray-200">Rechtlicher Hinweis:</strong>{' '}
                Die Neue Mitte ist ein privates Projekt zur Entwicklung politischer
                Ideen und steht in keiner Verbindung zu bestehenden Parteien oder
                Organisationen.
              </p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="card-base p-8">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Vielen Dank für Ihre Unterstützung!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Sie sind nun Teil der {(count + 1).toLocaleString('de-DE')} Unterstützerinnen
                    und Unterstützer der Neuen Mitte.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-nm-blue dark:text-nm-sky font-semibold text-sm hover:underline"
                  >
                    Weiteres Formular ausfüllen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Jetzt eintragen
                  </h3>

                  {/* Honeypot */}
                  <input
                    type="text"
                    {...register('website')}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label" htmlFor="firstName">Vorname *</label>
                      <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Max"
                        className="form-input"
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <p className="form-error">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="form-label" htmlFor="lastName">Nachname *</label>
                      <input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Mustermann"
                        className="form-input"
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p className="form-error">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="email">E-Mail-Adresse *</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="max@beispiel.de"
                      className="form-input"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="form-error">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="form-label" htmlFor="city">Wohnort *</label>
                    <input
                      id="city"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Berlin"
                      className="form-input"
                      {...register('city')}
                    />
                    {errors.city && (
                      <p className="form-error">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 rounded accent-nm-blue dark:accent-nm-sky flex-shrink-0"
                        {...register('consent')}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                        Ich stimme der Speicherung meiner Daten gemäß der{' '}
                        <Link
                          href="/datenschutz"
                          className="text-nm-blue dark:text-nm-sky hover:underline"
                          target="_blank"
                        >
                          Datenschutzerklärung
                        </Link>{' '}
                        zu. *
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="form-error mt-1">{errors.consent.message}</p>
                    )}
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl mb-4">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={status === 'loading'}
                    className="w-full"
                  >
                    Jetzt unterstützen
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 text-center">
                    * Pflichtfelder
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

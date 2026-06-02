'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Kontakt() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="kontakt" className="py-24 bg-white dark:bg-gray-950" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Schreiben Sie uns</span>
          <h2 className="section-title mb-4">Kontakt</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Fragen, Anregungen oder Interesse an einer Zusammenarbeit? Wir freuen uns auf Ihre Nachricht.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              {
                Icon: Mail,
                label: 'E-Mail',
                value: 'info@neue-mitte.org',
                href: 'mailto:info@neue-mitte.org',
              },
              {
                Icon: Phone,
                label: 'Telefon',
                value: '+49 152 52990491',
                href: 'tel:+4915252990491',
              },
              {
                Icon: MapPin,
                label: 'Adresse',
                value: 'Pestalozzistr. 17\n34260 Kaufungen',
                href: null,
              },
            ].map(({ Icon, label, value, href }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 bg-nm-blue/10 dark:bg-nm-sky/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-nm-blue dark:text-nm-sky" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-nm-blue dark:hover:text-nm-sky transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-pre-line">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="card-base p-8">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nachricht gesendet!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Wir antworten Ihnen so schnell wie möglich.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-nm-blue dark:text-nm-sky font-semibold text-sm hover:underline"
                  >
                    Neue Nachricht schreiben
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                      <label className="form-label" htmlFor="c-name">Name *</label>
                      <input
                        id="c-name"
                        type="text"
                        placeholder="Ihr Name"
                        className="form-input"
                        {...register('name')}
                      />
                      {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="form-label" htmlFor="c-email">E-Mail *</label>
                      <input
                        id="c-email"
                        type="email"
                        placeholder="ihre@email.de"
                        className="form-input"
                        {...register('email')}
                      />
                      {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="c-message">Nachricht *</label>
                    <textarea
                      id="c-message"
                      rows={5}
                      placeholder="Ihre Nachricht…"
                      className="form-input resize-none"
                      {...register('message')}
                    />
                    {errors.message && <p className="form-error">{errors.message.message}</p>}
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl mb-4">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-400">
                        Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    loading={status === 'loading'}
                    className="w-full"
                    size="lg"
                  >
                    Nachricht senden
                  </Button>
                  <p className="text-xs text-gray-500 mt-3 text-center">* Pflichtfelder</p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

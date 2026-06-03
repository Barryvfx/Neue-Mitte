'use client'

import { useState } from 'react'
import { Send, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Props {
  count: number
}

type SendStatus = 'idle' | 'sending' | 'done' | 'error'

export default function NewsletterCompose({ count }: Props) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [preview, setPreview] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [status, setStatus] = useState<SendStatus>('idle')
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setError('Bitte Betreff und Inhalt ausfüllen.')
      return
    }
    if (!confirmed) {
      setError('Bitte bestätigen Sie den Versand.')
      return
    }
    setError('')
    setStatus('sending')
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html: body.replace(/\n/g, '<br/>'), preview }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Fehler beim Senden.')
        setStatus('error')
        return
      }
      setResult(json)
      setStatus('done')
      setConfirmed(false)
    } catch {
      setError('Verbindungsfehler. Bitte erneut versuchen.')
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setResult(null)
    setError('')
    setSubject('')
    setBody('')
    setPreview('')
    setConfirmed(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Newsletter verfassen</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Wird an {count} {count === 1 ? 'Abonnenten' : 'Abonnenten'} gesendet
          </p>
        </div>
        {count > 0 && (
          <button
            onClick={() => setShowPreview((p) => !p)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-nm-blue dark:hover:text-blue-400 transition-colors"
          >
            {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? 'Vorschau schließen' : 'Vorschau anzeigen'}
          </button>
        )}
      </div>

      {status === 'done' && result ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Erfolgreich gesendet!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white">{result.sent}</span> E-Mails verschickt
            {result.failed > 0 && (
              <span className="text-red-500 ml-2">· {result.failed} fehlgeschlagen</span>
            )}
          </p>
          <button onClick={reset} className="mt-4 text-sm font-medium text-nm-blue hover:underline">
            Neuen Newsletter verfassen
          </button>
        </div>
      ) : count === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          Noch keine Abonnenten vorhanden. Sobald sich jemand anmeldet, können Sie hier Newsletter versenden.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Betreff *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="z. B. Neuigkeiten aus der Neuen Mitte – Juni 2025"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue transition-colors"
            />
          </div>

          {/* Preview text */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Vorschautext <span className="font-normal text-gray-400">(erscheint im Posteingang neben dem Betreff)</span>
            </label>
            <input
              type="text"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              placeholder="Kurze Zusammenfassung des Newsletters…"
              maxLength={140}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue transition-colors"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Inhalt * <span className="font-normal text-gray-400">(Zeilenumbrüche werden automatisch zu &lt;br&gt;)</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder={'Sehr geehrte Unterstützerinnen und Unterstützer,\n\n...'}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue transition-colors resize-none font-mono"
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                E-Mail-Vorschau
              </div>
              {!subject && !body ? (
                <div className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">
                  Betreff und Inhalt ausfüllen, um die Vorschau zu sehen.
                </div>
              ) : (
                <div className="p-4">
                  <div className="bg-[#0B3A75] text-white rounded-t-lg px-6 py-5">
                    <div className="inline-block bg-white/20 rounded px-3 py-1 text-xs font-black mb-3">Neue Mitte</div>
                    <h3 className="text-xl font-black leading-snug">{subject || '(Kein Betreff)'}</h3>
                  </div>
                  <div
                    className="bg-white px-6 py-6 text-sm text-gray-700 leading-relaxed border border-t-0 border-gray-200 rounded-b-lg"
                    dangerouslySetInnerHTML={{ __html: body ? body.replace(/\n/g, '<br/>') : '<em style="color:#9CA3AF">Kein Inhalt</em>' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Confirm + Send */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <label className="flex items-start gap-2.5 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-nm-blue focus:ring-nm-blue"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Ich bestätige, dass ich diesen Newsletter an{' '}
                <strong className="text-gray-900 dark:text-white">{count} Abonnenten</strong> senden möchte.
                Dieser Vorgang kann nicht rückgängig gemacht werden.
              </span>
            </label>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mb-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={status === 'sending' || !confirmed || !subject.trim() || !body.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-nm-blue text-white text-sm font-bold rounded-xl hover:bg-nm-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird gesendet…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Newsletter senden
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

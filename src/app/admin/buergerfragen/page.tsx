'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { CheckCircle, Trash2, Eye, EyeOff, MessageSquare } from 'lucide-react'

interface Frage { id: string; question: string; authorName: string; votes: number; published: boolean; answered: boolean; answer?: string; createdAt: string }

export default function AdminBuergerFragenPage() {
  const [items, setItems] = useState<Frage[]>([])
  const [answering, setAnswering] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState('')

  useEffect(() => {
    fetch('/api/admin/buergerfragen').then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  async function patch(id: string, data: Partial<Frage>) {
    await fetch(`/api/admin/buergerfragen/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setItems(prev => prev.map(x => x.id === id ? { ...x, ...data } : x))
  }

  async function del(id: string) {
    if (!confirm('Löschen?')) return
    await fetch(`/api/admin/buergerfragen/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(x => x.id !== id))
  }

  async function saveAnswer(id: string) {
    await patch(id, { answered: true, answer: answerText, published: true })
    setAnswering(null); setAnswerText('')
  }

  return (
    <AdminShell active="buergerfragen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Bürgerfragen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{items.length} Fragen · {items.filter(i => !i.published).length} ausstehend</p>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-nm-blue border border-nm-blue/30 px-2 py-0.5 rounded-full">{item.votes} Votes</span>
                    {item.answered && <span className="text-xs font-bold text-green-600 border border-green-200 px-2 py-0.5 rounded-full">Beantwortet</span>}
                    {!item.published && <span className="text-xs font-bold text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">Ausstehend</span>}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.question}</p>
                  <p className="text-xs text-gray-400">{item.authorName} · {new Date(item.createdAt).toLocaleDateString('de-DE')}</p>
                  {item.answered && item.answer && (
                    <div className="mt-2 pl-3 border-l-2 border-nm-blue/30">
                      <p className="text-xs text-gray-500 italic">{item.answer}</p>
                    </div>
                  )}
                  {answering === item.id && (
                    <div className="mt-3 space-y-2">
                      <textarea value={answerText} onChange={e => setAnswerText(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30 dark:bg-gray-900 dark:text-white" placeholder="Antwort verfassen…" />
                      <div className="flex gap-2">
                        <button onClick={() => saveAnswer(item.id)} className="text-xs font-bold bg-nm-blue text-white px-3 py-1.5 rounded-lg hover:bg-nm-blue/90 transition-all">Antwort speichern</button>
                        <button onClick={() => setAnswering(null)} className="text-xs text-gray-400 hover:text-gray-600">Abbrechen</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!item.answered && (
                    <button onClick={() => { setAnswering(item.id); setAnswerText(item.answer ?? '') }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Beantworten">
                      <MessageSquare className="h-4 w-4 text-nm-blue" />
                    </button>
                  )}
                  <button onClick={() => patch(item.id, { published: !item.published })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    {item.published ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                  </button>
                  <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Noch keine Fragen eingereicht.</div>}
        </div>
      </div>
    </AdminShell>
  )
}

'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface QuizFrage {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correct: 'A' | 'B' | 'C' | 'D'
  category: string
  active: boolean
  createdAt: string
}

const CATEGORIES = [
  'Allgemein', 'Grundgesetz', 'Wahlen', 'Parlament', 'Bundesrat',
  'EU-Politik', 'Parteien', 'Geschichte', 'Wirtschaft', 'Soziales',
]

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

const CATEGORY_COLOR: Record<string, string> = {
  Grundgesetz: 'bg-amber-900/40 text-amber-300',
  Wahlen: 'bg-nm-blue/30 text-blue-300',
  Parlament: 'bg-purple-900/40 text-purple-300',
  Bundesrat: 'bg-indigo-900/40 text-indigo-300',
  'EU-Politik': 'bg-cyan-900/40 text-cyan-300',
  Geschichte: 'bg-orange-900/40 text-orange-300',
  Wirtschaft: 'bg-green-900/40 text-green-300',
  Allgemein: 'bg-gray-700 text-gray-300',
}

export default function AdminWissenstestPage() {
  const [items, setItems] = useState<QuizFrage[]>([])
  const [showForm, setShowForm] = useState(false)
  const [question, setQuestion] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correct, setCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A')
  const [category, setCategory] = useState('Allgemein')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<QuizFrage | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/wissenstest')
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : []
        setItems(arr)
        if (arr.length > 0) setPreview(arr[0])
      })
      .catch(() => {})
  }, [])

  function resetForm() {
    setQuestion(''); setOptionA(''); setOptionB(''); setOptionC(''); setOptionD('')
    setCorrect('A'); setCategory('Allgemein'); setError('')
  }

  async function create() {
    if (!question.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setError('Alle Felder sind Pflicht'); return
    }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/wissenstest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, optionA, optionB, optionC, optionD, correct, category }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [json, ...prev])
    setPreview(json)
    resetForm(); setShowForm(false); setSaving(false)
  }

  async function toggleActive(item: QuizFrage) {
    const active = !item.active
    await fetch(`/api/admin/wissenstest/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, active } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, active } : p)
  }

  async function del(id: string) {
    if (!confirm('Frage löschen?')) return
    await fetch(`/api/admin/wissenstest/${id}`, { method: 'DELETE' })
    setItems(prev => {
      const next = prev.filter(x => x.id !== id)
      if (preview?.id === id) { setPreview(next[0] ?? null); setSelectedOption(null) }
      return next
    })
  }

  const opts = preview
    ? [
        { label: 'A', text: preview.optionA },
        { label: 'B', text: preview.optionB },
        { label: 'C', text: preview.optionC },
        { label: 'D', text: preview.optionD },
      ]
    : []

  return (
    <AdminShell active="wissenstest">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Wissenstest</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} Fragen · {items.filter(i => i.active).length} aktiv
            </p>
          </div>
          <button
            onClick={() => { setShowForm(f => !f); if (showForm) resetForm() }}
            className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all"
          >
            <Plus className="h-4 w-4" /> Neue Frage
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left */}
          <div className="lg:col-span-3 space-y-4">
            {/* Create form */}
            {showForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-white">Neue Frage</h2>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Frage *</label>
                  <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="Wie viele Abgeordnete hat der Bundestag mindestens?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map((l, i) => {
                    const val = [optionA, optionB, optionC, optionD][i]
                    const set = [setOptionA, setOptionB, setOptionC, setOptionD][i]
                    return (
                      <div key={l}>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Option {l} *</label>
                        <input
                          value={val}
                          onChange={e => set(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                          placeholder={`Antwort ${l}`}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Richtige Antwort</label>
                    <select
                      value={correct}
                      onChange={e => setCorrect(e.target.value as 'A' | 'B' | 'C' | 'D')}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    >
                      {OPTION_LABELS.map(l => <option key={l} value={l}>Option {l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Kategorie</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={create}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40 transition-all"
                  >
                    {saving ? 'Speichern…' : 'Erstellen'}
                  </button>
                  <button onClick={() => { setShowForm(false); resetForm() }} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-200">
                    Abbrechen
                  </button>
                </div>
              </div>
            )}

            {/* List */}
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => { setPreview(item); setSelectedOption(null) }}
                  className={`bg-gray-800 border rounded-xl p-4 cursor-pointer transition-all ${preview?.id === item.id ? 'border-nm-blue/60' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[item.category] ?? CATEGORY_COLOR['Allgemein']}`}>
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                          Richtig: {item.correct}
                        </span>
                        {!item.active && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Inaktiv</span>
                        )}
                      </div>
                      <p className="font-bold text-white text-sm leading-snug">{item.question}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        A: {item.optionA} · B: {item.optionB} · C: {item.optionC} · D: {item.optionD}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => toggleActive(item)}
                        className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                        title={item.active ? 'Deaktivieren' : 'Aktivieren'}
                      >
                        {item.active
                          ? <Eye className="h-4 w-4 text-green-400" />
                          : <EyeOff className="h-4 w-4 text-gray-500" />}
                      </button>
                      <button
                        onClick={() => del(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">Noch keine Fragen.</div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Vorschau — Quiz-Karte</p>
              {preview ? (
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[preview.category] ?? CATEGORY_COLOR['Allgemein']}`}>
                      {preview.category}
                    </span>
                  </div>
                  <p className="font-bold text-white text-sm leading-snug">{preview.question}</p>
                  <div className="space-y-2">
                    {opts.map(o => (
                      <button
                        key={o.label}
                        onClick={() => setSelectedOption(o.label)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                          selectedOption === o.label
                            ? 'border-nm-blue bg-nm-blue/20 text-white font-semibold'
                            : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                          selectedOption === o.label ? 'bg-nm-blue text-white' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {o.label}
                        </span>
                        {o.text}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-600 text-center">Korrekte Antwort: <span className="text-gray-400 font-bold">{preview.correct}</span> (nur im Admin sichtbar)</p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-center text-gray-600 text-xs">
                  Wähle eine Frage aus der Liste.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

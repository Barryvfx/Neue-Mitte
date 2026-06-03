'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { BarChart2 } from 'lucide-react'

interface AbTestData { A: number; B: number }

export default function AdminAbTestPage() {
  const [data, setData] = useState<AbTestData | null>(null)

  useEffect(() => {
    fetch('/api/abtest').then(r => r.json()).then(setData).catch(() => {})
  }, [])

  const total = (data?.A ?? 0) + (data?.B ?? 0)
  const pctA = total > 0 ? Math.round(((data?.A ?? 0) / total) * 100) : 50
  const pctB = total > 0 ? Math.round(((data?.B ?? 0) / total) * 100) : 50

  const variants = [
    { key: 'A', label: 'Variante A', desc: '"Deutschland kann mehr."', clicks: data?.A ?? 0, pct: pctA },
    { key: 'B', label: 'Variante B', desc: '"Gemeinsam. Pragmatisch. Neu."', clicks: data?.B ?? 0, pct: pctB },
  ]

  return (
    <AdminShell active="abtest">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-black text-gray-900 dark:text-white">A/B-Test</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Hero-Textvarianten vergleichen · {total} Klicks insgesamt
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {variants.map(v => (
            <div key={v.key} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white ${v.key === 'A' ? 'bg-nm-blue' : 'bg-emerald-500'}`}>
                  {v.key}
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-sm">{v.label}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">{v.desc}</p>
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{v.clicks}</div>
              <div className="text-xs text-gray-400 mb-3">CTA-Klicks</div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${v.key === 'A' ? 'bg-nm-blue' : 'bg-emerald-500'}`}
                  style={{ width: `${v.pct}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{v.pct}% der Klicks</div>
            </div>
          ))}
        </div>

        <div className="bg-nm-gray border border-nm-line rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="h-4 w-4 text-nm-muted" />
            <span className="text-sm font-bold text-nm-blue">Wie funktioniert der A/B-Test?</span>
          </div>
          <p className="text-xs text-nm-muted leading-relaxed">
            Besucher werden beim ersten Seitenaufruf zufällig einer Variante zugewiesen (gespeichert im localStorage).
            Wenn sie auf den "Jetzt unterstützen"-Button klicken, wird ein Klick für ihre Variante gezählt.
            Die Variante mit höherer Klickrate ist effektiver.
          </p>
        </div>
      </div>
    </AdminShell>
  )
}

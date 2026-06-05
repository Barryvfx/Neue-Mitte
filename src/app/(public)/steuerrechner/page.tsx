'use client'

import { useState, useMemo } from 'react'
import { Calculator, Info } from 'lucide-react'

function calcTax(income: number, married: boolean): {
  tax: number; soli: number; total: number; rate: number; net: number
} {
  const z = married ? income / 2 : income

  let tax = 0
  if (z <= 11784) {
    tax = 0
  } else if (z <= 17005) {
    const y = (z - 11784) / 10000
    tax = (979.18 * y + 1400) * y
  } else if (z <= 66760) {
    const y = (z - 17005) / 10000
    tax = (192.59 * y + 2397) * y + 1025.38
  } else if (z <= 277825) {
    tax = 0.42 * z - 10602.13
  } else {
    tax = 0.45 * z - 18936.88
  }

  if (married) tax *= 2

  const soli = tax > 18130 ? Math.max(0, tax * 0.055) : 0
  const total = tax + soli

  return {
    tax: Math.round(tax),
    soli: Math.round(soli),
    total: Math.round(total),
    rate: income > 0 ? Math.round((total / income) * 1000) / 10 : 0,
    net: Math.round(income - total),
  }
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-nm-muted">{label}</span>
        <span className="font-bold text-nm-text">{value.toLocaleString('de-DE')} €</span>
      </div>
      <div className="h-2.5 bg-nm-gray rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  )
}

export default function SteuerrechnerPage() {
  const [income, setIncome] = useState(50000)
  const [married, setMarried] = useState(false)
  const [inputVal, setInputVal] = useState('50000')

  const result = useMemo(() => calcTax(income, married), [income, married])

  function handleInput(v: string) {
    setInputVal(v)
    const n = parseInt(v.replace(/\D/g, ''), 10)
    if (!isNaN(n) && n >= 0 && n <= 10000000) setIncome(n)
  }

  const PRESETS = [20000, 35000, 50000, 75000, 100000, 150000, 250000]

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Tools</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Calculator className="h-8 w-8 opacity-80" /> Steuerrechner 2024
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Berechne deine Einkommensteuer und den Solidaritätszuschlag – schnell und verständlich.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="border border-nm-line rounded-xl p-6 mb-6">
            <label className="nm-label text-base mb-3 block">Zu versteuerndes Jahreseinkommen (brutto)</label>
            <div className="relative mb-4">
              <input
                type="text"
                value={inputVal}
                onChange={e => handleInput(e.target.value)}
                className="nm-input pr-8 text-xl font-black"
                placeholder="50000"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nm-muted font-bold">€</span>
            </div>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 mb-5">
              {PRESETS.map(p => (
                <button key={p} onClick={() => { setIncome(p); setInputVal(String(p)) }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${income === p ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue'}`}>
                  {p.toLocaleString('de-DE')} €
                </button>
              ))}
            </div>

            {/* Range slider */}
            <input
              type="range" min="0" max="300000" step="1000" value={income}
              onChange={e => { const v = Number(e.target.value); setIncome(v); setInputVal(String(v)) }}
              className="w-full accent-nm-blue mb-4"
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setMarried(!married)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${married ? 'bg-nm-blue' : 'bg-nm-line'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${married ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-semibold text-nm-text">Verheiratet / Splittingtarif</span>
            </label>
          </div>

          {/* Results */}
          <div className="border border-nm-line rounded-xl p-6">
            <h2 className="font-black text-nm-blue text-lg mb-6">Ergebnis</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-nm-blue text-white rounded-xl p-4 text-center">
                <p className="text-white/70 text-xs font-bold uppercase tracking-wide mb-1">Nettoeinkommen</p>
                <p className="text-2xl font-black">{result.net.toLocaleString('de-DE')} €</p>
                <p className="text-white/60 text-xs">≈ {Math.round(result.net / 12).toLocaleString('de-DE')} €/Monat</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-red-600 text-xs font-bold uppercase tracking-wide mb-1">Gesamtbelastung</p>
                <p className="text-2xl font-black text-red-700">{result.total.toLocaleString('de-DE')} €</p>
                <p className="text-red-500 text-xs">Eff. Steuersatz: {result.rate} %</p>
              </div>
            </div>

            <div className="space-y-3">
              <Bar label="Einkommensteuer" value={result.tax} max={income} color="bg-nm-blue" />
              <Bar label="Solidaritätszuschlag" value={result.soli} max={income} color="bg-blue-300" />
              <Bar label="Nettoeinkommen" value={result.net} max={income} color="bg-green-500" />
            </div>

            <div className="mt-5 flex items-start gap-2 text-xs text-nm-muted bg-nm-gray rounded-lg p-3">
              <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <span>Ohne Kirchensteuer, gesetzliche Kranken-, Renten- und Pflegeversicherung. Nur Einkommensteuer + Soli nach dem Grundtarif 2024. Keine Steuerberatung.</span>
            </div>
          </div>

          {/* Context */}
          <div className="mt-6 border border-nm-line rounded-xl p-5">
            <h3 className="font-black text-nm-blue mb-3">Was die Neue Mitte fordert</h3>
            <ul className="space-y-2 text-sm text-nm-muted">
              <li className="flex gap-2"><span className="text-nm-blue font-bold flex-shrink-0">→</span> Vereinfachung des Steuerrechts – weniger Ausnahmen, mehr Klarheit</li>
              <li className="flex gap-2"><span className="text-nm-blue font-bold flex-shrink-0">→</span> Vollautomatische Steuererklärung für Arbeitnehmer</li>
              <li className="flex gap-2"><span className="text-nm-blue font-bold flex-shrink-0">→</span> Abbau der kalten Progression für Normalverdiener</li>
              <li className="flex gap-2"><span className="text-nm-blue font-bold flex-shrink-0">→</span> Mehr Transparenz: Jeder Bürger soll wissen, wofür seine Steuern ausgegeben werden</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

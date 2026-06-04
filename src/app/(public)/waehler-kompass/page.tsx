'use client'

import { useState } from 'react'

const PARTIES = ['CDU/CSU', 'SPD', 'Grüne', 'FDP', 'AfD', 'BSW', 'Neue Mitte']
const PARTY_COLORS: Record<string, string> = {
  'CDU/CSU': '#000000', 'SPD': '#E3000F', 'Grüne': '#1AA037', 'FDP': '#FFED00',
  'AfD': '#009EE0', 'BSW': '#E91E8C', 'Neue Mitte': '#0E4795',
}

const THESES: { id: string; text: string; positions: number[] }[] = [
  { id: 'schuldenbremse', text: 'Die Schuldenbremse soll beibehalten werden.', positions: [2, -1, -2, 2, 2, -1, 1] },
  { id: 'mindestlohn', text: 'Der Mindestlohn soll auf 15 € erhöht werden.', positions: [-1, 2, 1, -1, 0, 2, 0] },
  { id: 'atomkraft', text: 'Kernkraftwerke sollen wieder in Betrieb genommen werden.', positions: [2, -1, -2, 2, 2, 0, 1] },
  { id: 'cannabis', text: 'Cannabis soll vollständig legalisiert werden.', positions: [-1, 1, 2, 2, -2, 0, 0] },
  { id: 'buergergeld', text: 'Das Bürgergeld soll abgeschafft werden.', positions: [1, -2, -2, 1, 2, 0, -1] },
  { id: 'nato', text: 'Deutschland soll die NATO-Ausgaben auf 2 % BIP erhöhen.', positions: [2, 1, 0, 1, 2, -1, 2] },
  { id: 'tempolimit', text: 'Es soll ein generelles Tempolimit auf Autobahnen eingeführt werden.', positions: [-1, 2, 2, -2, -2, 1, -1] },
  { id: 'zuwanderung', text: 'Zuwanderung soll stärker begrenzt werden.', positions: [2, 0, -2, 1, 2, 1, 1] },
  { id: 'vermoegen', text: 'Es soll eine Vermögenssteuer für sehr Reiche eingeführt werden.', positions: [-1, 2, 2, -2, 0, 2, -1] },
  { id: 'mietpreisbremse', text: 'Die Mietpreisbremse soll bundesweit verschärft werden.', positions: [0, 2, 2, -1, -1, 2, 0] },
  { id: 'digitalisierung', text: 'Der Staat soll massiv in digitale Infrastruktur investieren.', positions: [1, 1, 2, 2, 1, 0, 2] },
  { id: 'erneuerbare', text: 'Erneuerbare Energien sollen vorrangig ausgebaut werden.', positions: [0, 2, 2, 1, -2, 0, 1] },
  { id: 'bundeswehr', text: 'Die Bundeswehr soll deutlich gestärkt werden.', positions: [2, 1, 0, 1, 2, -1, 2] },
  { id: 'bildung', text: 'Der Bund soll mehr Geld für Bildung ausgeben dürfen.', positions: [1, 2, 2, 0, 0, 2, 2] },
  { id: 'sozialleistungen', text: 'Sozialleistungen sollen für arbeitsfähige Menschen gekürzt werden.', positions: [1, -2, -2, 1, 2, -1, 0] },
  { id: 'privatisierung', text: 'Staatliche Unternehmen sollen privatisiert werden.', positions: [1, -1, -2, 2, 1, -1, 0] },
  { id: 'buerokratie', text: 'Bürokratieabbau soll Priorität haben.', positions: [2, 1, 1, 2, 2, 1, 2] },
  { id: 'europa', text: 'Europa soll enger zusammenwachsen (mehr EU-Kompetenzen).', positions: [1, 1, 2, 1, -2, -1, 2] },
  { id: 'steuern', text: 'Steuern für Unternehmen sollen gesenkt werden.', positions: [2, -1, -2, 2, 1, -1, 2] },
  { id: 'klima', text: 'Klimaschutz soll Vorrang vor wirtschaftlichen Interessen haben.', positions: [-1, 1, 2, 0, -2, 0, 1] },
]

const LABELS: Record<number, string> = { '-2': 'Stark dagegen', '-1': 'Eher dagegen', '0': 'Neutral', '1': 'Eher dafür', '2': 'Stark dafür' }

export default function WaehlerKompassPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [done, setDone] = useState(false)

  const answered = Object.keys(answers).length
  const total = THESES.length

  function setAnswer(id: string, val: number) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  function calcResults() {
    return PARTIES.map((party, pi) => {
      let totalDist = 0
      let count = 0
      THESES.forEach(thesis => {
        if (answers[thesis.id] !== undefined) {
          totalDist += Math.abs(answers[thesis.id] - thesis.positions[pi])
          count++
        }
      })
      const maxDist = count * 4
      const match = maxDist > 0 ? Math.round((1 - totalDist / maxDist) * 100) : 0
      return { party, match }
    }).sort((a, b) => b.match - a.match)
  }

  if (done) {
    const results = calcResults()
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-nm-blue text-white">
          <div className="nm-container py-12 sm:py-14">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">Wähler-Kompass</p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Ihr Ergebnis</h1>
            <p className="text-white/60 text-sm mt-2">Basierend auf Ihren {answered} Antworten</p>
          </div>
        </div>

        <div className="nm-container py-10">
          <div className="max-w-2xl">
            <div className="space-y-3 mb-8">
              {results.map(({ party, match }, i) => (
                <div
                  key={party}
                  className={`p-4 sm:p-5 rounded-xl border ${
                    party === 'Neue Mitte'
                      ? 'border-nm-blue bg-nm-blue/5 ring-2 ring-nm-blue/20'
                      : 'border-nm-line bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-nm-muted w-6">#{i + 1}</span>
                      <span className={`font-black text-sm ${party === 'Neue Mitte' ? 'text-nm-blue' : 'text-nm-text'}`}>
                        {party}
                        {party === 'Neue Mitte' && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-nm-blue text-white font-black">Unsere Partei</span>
                        )}
                      </span>
                    </div>
                    <span className={`text-xl font-black tabular-nums ${party === 'Neue Mitte' ? 'text-nm-blue' : 'text-nm-text'}`}>
                      {match}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${match}%`, background: PARTY_COLORS[party] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setAnswers({}); setDone(false) }}
                className="btn-outline"
              >
                ← Neu starten
              </button>
              <a href="/unterstuetzen" className="btn-primary">
                Neue Mitte unterstützen →
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Interaktiv</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Wähler-Kompass</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Bewerten Sie 20 politische Thesen und finden Sie heraus, welche Partei am besten zu Ihnen passt.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="max-w-2xl">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 progress-track">
              <div className="progress-fill" style={{ width: `${(answered / total) * 100}%` }} />
            </div>
            <span className="text-xs text-nm-muted font-bold flex-shrink-0">{answered}/{total} beantwortet</span>
          </div>

          <div className="space-y-5">
            {THESES.map(thesis => (
              <div key={thesis.id} className={`border rounded-xl p-5 transition-all ${answers[thesis.id] !== undefined ? 'border-nm-blue/30 bg-nm-blue/[0.02]' : 'border-nm-line bg-white'}`}>
                <p className="font-semibold text-nm-text mb-4 leading-snug">{thesis.text}</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {([-2, -1, 0, 1, 2] as const).map(val => (
                    <button
                      key={val}
                      onClick={() => setAnswer(thesis.id, val)}
                      title={LABELS[val]}
                      className={`py-2 text-[10px] font-bold rounded-lg transition-all border leading-tight ${
                        answers[thesis.id] === val
                          ? val < 0
                            ? 'bg-red-500 text-white border-red-500'
                            : val > 0
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-gray-400 text-white border-gray-400'
                          : 'border-nm-line text-nm-muted hover:border-nm-blue/60 hover:text-nm-blue hover:bg-nm-blue/5'
                      }`}
                    >
                      {LABELS[val]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-nm-muted">
              {answered === 0
                ? 'Bitte beantworten Sie mindestens 5 Thesen.'
                : answered < 5
                  ? `Noch ${5 - answered} weitere Antworten benötigt.`
                  : `${answered} von ${total} beantwortet — Ergebnis verfügbar.`
              }
            </p>
            <button
              onClick={() => setDone(true)}
              disabled={answered < 5}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ergebnis anzeigen →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

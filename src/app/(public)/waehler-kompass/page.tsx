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
      <div className="nm-container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-black text-nm-blue mb-2">Ihr Ergebnis</h1>
          <p className="text-nm-muted mb-8">Basierend auf Ihren {answered} Antworten</p>
          <div className="space-y-3">
            {results.map(({ party, match }, i) => (
              <div key={party} className={`p-4 rounded-xl border ${party === 'Neue Mitte' ? 'border-nm-blue bg-nm-blue/5' : 'border-nm-line bg-white'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-nm-muted">#{i + 1}</span>
                    <span className={`font-bold text-sm ${party === 'Neue Mitte' ? 'text-nm-blue' : 'text-nm-text'}`}>{party}</span>
                  </div>
                  <span className={`text-lg font-black ${party === 'Neue Mitte' ? 'text-nm-blue' : 'text-nm-text'}`}>{match}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${match}%`, background: PARTY_COLORS[party] }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setAnswers({}); setDone(false) }} className="mt-8 text-sm text-nm-blue hover:underline">
            ← Neu starten
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="nm-container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-nm-blue mb-2">Wähler-Kompass</p>
          <h1 className="text-2xl font-black text-nm-blue mb-2">Wo stehen Sie politisch?</h1>
          <p className="text-nm-muted text-sm mb-4">Bewerten Sie 20 politische Aussagen und finden Sie heraus, welche Partei am besten zu Ihnen passt.</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-nm-blue transition-all" style={{ width: `${(answered / total) * 100}%` }} />
            </div>
            <span className="text-xs text-nm-muted font-medium">{answered}/{total}</span>
          </div>
        </div>

        <div className="space-y-6">
          {THESES.map(thesis => (
            <div key={thesis.id} className="bg-white border border-nm-line rounded-xl p-5">
              <p className="font-semibold text-nm-text mb-4">{thesis.text}</p>
              <div className="flex gap-2">
                {([-2, -1, 0, 1, 2] as const).map(val => (
                  <button
                    key={val}
                    onClick={() => setAnswer(thesis.id, val)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${
                      answers[thesis.id] === val
                        ? val < 0 ? 'bg-red-500 text-white border-red-500' : val > 0 ? 'bg-green-500 text-white border-green-500' : 'bg-gray-400 text-white border-gray-400'
                        : 'border-nm-line text-nm-muted hover:border-nm-blue hover:text-nm-blue'
                    }`}
                  >
                    {LABELS[val]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-nm-muted">{answered} von {total} beantwortet</p>
          <button
            onClick={() => setDone(true)}
            disabled={answered < 5}
            className="btn-primary disabled:opacity-40"
          >
            Ergebnis anzeigen →
          </button>
        </div>
      </div>
    </div>
  )
}

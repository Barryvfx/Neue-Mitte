'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Party { name: string; short: string; color: string }
interface Topic { id: string; label: string; nm: string; parties: Record<string, string> }

const PARTIES: Party[] = [
  { name: 'CDU/CSU', short: 'CDU', color: '#000000' },
  { name: 'SPD',     short: 'SPD', color: '#E3000F' },
  { name: 'Grüne',   short: 'GRN', color: '#1AA037' },
  { name: 'FDP',     short: 'FDP', color: '#FFED00' },
  { name: 'AfD',     short: 'AfD', color: '#009EE0' },
  { name: 'BSW',     short: 'BSW', color: '#8B2252' },
]

// ✓ = stimmt überein, ○ = teilweise, ✗ = widerspricht
const TOPICS: Topic[] = [
  {
    id: 'buerokratie', label: 'Bürokratieabbau',
    nm: 'Radikaler Bürokratieabbau: One-in-two-out-Regel, digitale Verwaltung, Entfesselung des Mittelstands.',
    parties: { CDU: '○', SPD: '✗', GRN: '✗', FDP: '✓', AfD: '○', BSW: '✗' },
  },
  {
    id: 'bildung', label: 'Bildungsreform',
    nm: 'Nationale Bildungsstandards, mehr Digitalisierung, Lehrermangel beheben, Bildung entkoppeln vom Geldbeutel der Eltern.',
    parties: { CDU: '○', SPD: '○', GRN: '○', FDP: '○', AfD: '✗', BSW: '○' },
  },
  {
    id: 'migration', label: 'Geordnete Migration',
    nm: 'Feste Kontingente, Rückführungen bei Ablehnung, Fachkräftezuwanderung fördern, Integrationsnachweis als Pflicht.',
    parties: { CDU: '✓', SPD: '✗', GRN: '✗', FDP: '○', AfD: '✗', BSW: '○' },
  },
  {
    id: 'energie', label: 'Energiepolitik',
    nm: 'Genehmigungen beschleunigen, Technologieoffenheit, kein Ideologiestreit – was funktioniert, wird gebaut.',
    parties: { CDU: '○', SPD: '✗', GRN: '✗', FDP: '✓', AfD: '○', BSW: '✗' },
  },
  {
    id: 'wirtschaft', label: 'Wirtschaftspolitik',
    nm: 'Unternehmenssteuern senken, Investitionen anziehen, Start-up-Kultur stärken, Lieferketten diversifizieren.',
    parties: { CDU: '✓', SPD: '✗', GRN: '✗', FDP: '✓', AfD: '○', BSW: '✗' },
  },
  {
    id: 'digitalisierung', label: 'Digitalisierung',
    nm: 'Glasfaser und 5G flächendeckend, E-Government als Standard, KI-Strategie, digitale Identität für alle.',
    parties: { CDU: '○', SPD: '○', GRN: '○', FDP: '✓', AfD: '✗', BSW: '✗' },
  },
  {
    id: 'sicherheit', label: 'Innere Sicherheit',
    nm: 'Mehr Personal bei Polizei und Justiz, schnellere Verfahren, Null-Toleranz bei Wiederholungstätern.',
    parties: { CDU: '✓', SPD: '○', GRN: '✗', FDP: '○', AfD: '✓', BSW: '○' },
  },
  {
    id: 'rente', label: 'Rentensystem',
    nm: 'Kapitalgedeckte Säule einführen, Lebensarbeitszeit flexibilisieren, Fachkräftezuwanderung als Demografiepuffer.',
    parties: { CDU: '○', SPD: '✗', GRN: '✗', FDP: '✓', AfD: '✗', BSW: '✗' },
  },
]

const MATCH_CONFIG: Record<string, { pct: number; color: string }> = {
  '✓': { pct: 100, color: 'bg-green-500' },
  '○': { pct:  50, color: 'bg-amber-400' },
  '✗': { pct:   0, color: 'bg-red-400' },
}

const ICON_LABEL: Record<string, string> = { '✓': 'Übereinstimmung', '○': 'Teilweise', '✗': 'Widerspruch' }

export default function KoalitionsrechnerPage() {
  const [selected, setSelected] = useState<string | null>(null)

  function partyScore(short: string) {
    const sum = TOPICS.reduce((acc, t) => {
      const v = t.parties[short] ?? '✗'
      return acc + MATCH_CONFIG[v].pct
    }, 0)
    return Math.round(sum / TOPICS.length)
  }

  const sorted = [...PARTIES].sort((a, b) => partyScore(b.short) - partyScore(a.short))

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Transparenz</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Koalitionsrechner</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Welche Parteien stimmen mit der Neuen Mitte überein? Ein sachlicher Vergleich nach Themenbereichen.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {/* Party scores */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {sorted.map(p => {
            const score = partyScore(p.short)
            return (
              <button
                key={p.short}
                onClick={() => setSelected(selected === p.short ? null : p.short)}
                className={`border rounded-xl p-4 text-left transition-all ${selected === p.short ? 'border-nm-blue shadow-sm' : 'border-nm-line hover:border-nm-blue/40'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-nm-blue text-base">{p.name}</span>
                  <span className="text-2xl font-black" style={{ color: score > 60 ? '#16a34a' : score > 35 ? '#d97706' : '#dc2626' }}>{score}%</span>
                </div>
                <div className="h-2 bg-nm-line rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: score > 60 ? '#16a34a' : score > 35 ? '#d97706' : '#dc2626' }} />
                </div>
                <p className="text-xs text-nm-muted mt-1.5">Übereinstimmung mit der Neuen Mitte</p>
              </button>
            )
          })}
        </div>

        {/* Detail table */}
        <div className="overflow-x-auto rounded-xl border border-nm-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-nm-gray border-b border-nm-line">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-nm-muted w-40">Thema</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-nm-blue text-center">Neue Mitte</th>
                {PARTIES.map(p => (
                  <th key={p.short} className={`px-3 py-3 text-xs font-bold text-center transition-colors ${selected === p.short ? 'bg-nm-blue/10 text-nm-blue' : 'text-nm-muted'}`}>
                    {p.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOPICS.map((topic, i) => (
                <tr key={topic.id} className={`border-b border-nm-line/50 ${i % 2 === 0 ? '' : 'bg-nm-gray/30'}`}>
                  <td className="px-4 py-3 font-semibold text-nm-text">
                    <button onClick={() => setSelected(prev => prev === `topic_${topic.id}` ? null : `topic_${topic.id}`)} className="hover:text-nm-blue transition-colors text-left">
                      {topic.label}
                    </button>
                    {selected === `topic_${topic.id}` && (
                      <p className="text-xs text-nm-muted font-normal mt-1 leading-relaxed max-w-[200px]">{topic.nm}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-nm-blue mx-auto" />
                  </td>
                  {PARTIES.map(p => {
                    const v = topic.parties[p.short] ?? '✗'
                    const cfg = MATCH_CONFIG[v]
                    return (
                      <td key={p.short} className={`px-3 py-3 text-center transition-colors ${selected === p.short ? 'bg-nm-blue/5' : ''}`}>
                        <span title={ICON_LABEL[v]} className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold ${cfg.color}`}>
                          {v}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-6 mt-4 text-xs text-nm-muted">
          {Object.entries(MATCH_CONFIG).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white font-bold ${v.color}`}>{k}</span>
              {ICON_LABEL[k]}
            </div>
          ))}
          <span className="text-nm-muted/60 ml-auto">Eigene Einschätzung der Neuen Mitte. Stand: 2025.</span>
        </div>

        <div className="mt-8 p-5 bg-nm-gray border border-nm-line rounded-xl text-center">
          <p className="text-nm-muted text-sm mb-3">Überzeugt? Werden Sie Teil der Bewegung.</p>
          <Link href="/unterstuetzen" className="btn-primary text-sm px-6 py-2.5">Jetzt unterstützen</Link>
        </div>
      </div>
    </div>
  )
}

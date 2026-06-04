import Link from 'next/link'

const PARTIES = ['CDU/CSU', 'SPD', 'Grüne', 'FDP', 'AfD', 'BSW']
const PARTY_COLORS = ['#000000', '#E3000F', '#1AA037', '#FFCC00', '#009EE0', '#8B2252']

interface Row { topic: string; nm: string; values: string[] }

const ROWS: Row[] = [
  { topic: 'Bürokratieabbau',    nm: 'One-in-two-out, vollständige Digitalisierung der Verwaltung', values: ['○', '✗', '✗', '✓', '○', '✗'] },
  { topic: 'Migration',          nm: 'Kontingente + konsequente Rückführungen + Fachkräftezuwanderung', values: ['✓', '✗', '✗', '○', '✗', '○'] },
  { topic: 'Bildung',            nm: 'Nationale Standards, Digitalisierung, kein Sitzenbleiben mehr', values: ['○', '○', '○', '○', '✗', '○'] },
  { topic: 'Wirtschaft',         nm: 'Steuersenkungen, Bürokratieabbau, Standortförderung', values: ['✓', '✗', '✗', '✓', '○', '✗'] },
  { topic: 'Energie',            nm: 'Technologieoffenheit, Genehmigungsbeschleunigung', values: ['○', '✗', '✗', '✓', '○', '✗'] },
  { topic: 'Innere Sicherheit',  nm: 'Mehr Personal, schnellere Justiz, Null-Toleranz bei Wiederholungstätern', values: ['✓', '○', '✗', '○', '✓', '○'] },
  { topic: 'Digitalisierung',    nm: 'Glasfaser + 5G flächendeckend, E-Government, KI-Strategie', values: ['○', '○', '○', '✓', '✗', '✗'] },
  { topic: 'Rente',              nm: 'Kapitalgedeckte Säule + Fachkräftezuwanderung', values: ['○', '✗', '✗', '✓', '✗', '✗'] },
  { topic: 'Staatsfinanzen',     nm: 'Effizienz vor Schulden, keine neuen Steuern', values: ['✓', '✗', '✗', '✓', '○', '✗'] },
  { topic: 'Außenpolitik',       nm: 'Pro-EU, starke NATO, regelbasierte Weltordnung', values: ['✓', '✓', '✓', '✓', '✗', '✗'] },
]

const ICON: Record<string, { emoji: string; bg: string; text: string }> = {
  '✓': { emoji: '✓', bg: 'bg-green-100', text: 'text-green-700' },
  '○': { emoji: '○', bg: 'bg-amber-50',  text: 'text-amber-600' },
  '✗': { emoji: '✗', bg: 'bg-red-50',   text: 'text-red-600'   },
}

function calcScore(colIdx: number) {
  const total = ROWS.reduce((acc, row) => {
    const v = row.values[colIdx]
    return acc + (v === '✓' ? 100 : v === '○' ? 50 : 0)
  }, 0)
  return Math.round(total / ROWS.length)
}

export default function BundestagscheckPage() {
  const scores = PARTIES.map((_, i) => calcScore(i))

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Transparenz</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Bundestagscheck</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Wo stimmt die Neue Mitte mit den Bundestagsparteien überein – und wo nicht? Ein sachlicher Vergleich.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {/* Score cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-10">
          {PARTIES.map((p, i) => {
            const s = scores[i]
            return (
              <div key={p} className="border border-nm-line rounded-xl p-3 text-center">
                <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: PARTY_COLORS[i] + '22', border: `2px solid ${PARTY_COLORS[i]}44` }}>
                  <span className="text-[10px] font-black" style={{ color: PARTY_COLORS[i] === '#FFCC00' ? '#856000' : PARTY_COLORS[i] }}>{p.split('/')[0].slice(0, 3)}</span>
                </div>
                <div className="text-lg font-black text-nm-blue">{s}%</div>
                <div className="text-[10px] text-nm-muted truncate">{p}</div>
              </div>
            )
          })}
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-xl border border-nm-line">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-nm-gray border-b border-nm-line">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-nm-muted w-32">Thema</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-nm-blue text-left">Neue Mitte Position</th>
                {PARTIES.map((p, i) => (
                  <th key={p} className="px-3 py-3 text-xs font-bold text-center text-nm-muted">{p.split('/')[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.topic} className={`border-b border-nm-line/50 ${ri % 2 === 0 ? '' : 'bg-nm-gray/30'}`}>
                  <td className="px-4 py-3 font-bold text-nm-blue text-sm">{row.topic}</td>
                  <td className="px-4 py-3 text-nm-muted text-xs leading-relaxed max-w-[200px]">{row.nm}</td>
                  {row.values.map((v, vi) => {
                    const cfg = ICON[v] ?? ICON['✗']
                    return (
                      <td key={vi} className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                          {cfg.emoji}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-nm-muted mt-3">Eigene Einschätzung der Neuen Mitte auf Basis öffentlicher Wahlprogramme. Stand: 2025. ✓ = Übereinstimmung · ○ = Teilweise · ✗ = Widerspruch</p>

        <div className="mt-8 p-5 bg-nm-gray border border-nm-line rounded-xl text-center">
          <p className="text-nm-muted text-sm mb-3">Unterstützen Sie die einzige Kraft, die wirklich pragmatisch denkt.</p>
          <Link href="/unterstuetzen" className="btn-primary text-sm px-6 py-2.5">Jetzt unterstützen</Link>
        </div>
      </div>
    </div>
  )
}

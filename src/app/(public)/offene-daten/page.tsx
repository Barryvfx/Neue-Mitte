import Link from 'next/link'
import { Download, Database } from 'lucide-react'

const DATASETS = [
  { type: 'versprechen', label: 'Versprechen-Tracker', desc: 'Alle politischen Forderungen mit Status', count: 'JSON' },
  { type: 'ideen', label: 'Ideen-Plattform', desc: 'Alle veröffentlichten Ideen der Bürger', count: 'JSON' },
  { type: 'buergerfragen', label: 'Bürgerfragen', desc: 'Beantwortete Bürgerfragen', count: 'JSON' },
  { type: 'wissenstest-stats', label: 'Wissenstest-Statistiken', desc: 'Quizfragen nach Kategorie', count: 'JSON' },
]

export default function OffeneDatenPage() {
  return (
    <div className="nm-container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-nm-blue mb-2">Transparenz</p>
          <h1 className="text-2xl font-black text-nm-blue mb-2">Offene Daten</h1>
          <p className="text-nm-muted text-sm">Alle Daten der Neuen Mitte stehen zur freien Nutzung bereit. Download als JSON.</p>
        </div>

        <div className="space-y-3">
          {DATASETS.map(ds => (
            <div key={ds.type} className="bg-white border border-nm-line rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-nm-blue/10 flex items-center justify-center flex-shrink-0">
                  <Database className="h-5 w-5 text-nm-blue" />
                </div>
                <div>
                  <p className="font-bold text-nm-text text-sm">{ds.label}</p>
                  <p className="text-xs text-nm-muted">{ds.desc}</p>
                </div>
              </div>
              <a
                href={`/api/offene-daten?type=${ds.type}`}
                download
                className="flex items-center gap-2 text-xs font-bold text-nm-blue border border-nm-blue px-3 py-2 rounded-lg hover:bg-nm-blue hover:text-white transition-all whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                {ds.count}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-nm-gray border border-nm-line rounded-xl p-5">
          <h2 className="font-bold text-nm-text text-sm mb-2">Nutzungsbedingungen</h2>
          <p className="text-xs text-nm-muted leading-relaxed">
            Die Daten stehen unter der <strong>CC BY 4.0</strong> Lizenz. Bei Verwendung bitte angeben: „Quelle: Neue Mitte (neue-mitte.org)". Kommerzielle Nutzung erlaubt.
          </p>
        </div>
      </div>
    </div>
  )
}

import { Download, Database } from 'lucide-react'

const DATASETS = [
  {
    type: 'versprechen',
    label: 'Versprechen-Tracker',
    desc: 'Alle politischen Forderungen mit aktuellem Status und Fortschritt',
    format: 'JSON',
  },
  {
    type: 'ideen',
    label: 'Ideen-Plattform',
    desc: 'Alle veröffentlichten Bürgerideen mit Bewertungen',
    format: 'JSON',
  },
  {
    type: 'buergerfragen',
    label: 'Bürgerfragen',
    desc: 'Öffentlich beantwortete Fragen von Bürgerinnen und Bürgern',
    format: 'JSON',
  },
  {
    type: 'wissenstest-stats',
    label: 'Wissenstest-Statistiken',
    desc: 'Quizfragen und Antwortverteilungen nach Thema',
    format: 'JSON',
  },
  {
    type: 'debatte',
    label: 'Debatte-Argumente',
    desc: 'Pro & Contra Argumente aus dem Debattierforum mit Votes',
    format: 'JSON',
  },
  {
    type: 'faktencheck',
    label: 'Faktenchecks',
    desc: 'Geprüfte politische Aussagen mit Bewertung und Analyse',
    format: 'JSON',
  },
]

export default function OffeneDatenPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Transparenz</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Offene Daten</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Alle Daten der Neuen Mitte stehen zur freien Nutzung bereit. Transparency by default.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="max-w-3xl">
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {DATASETS.map(ds => (
              <div
                key={ds.type}
                className="border border-nm-line rounded-xl p-5 flex flex-col bg-white hover:border-nm-blue/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3 mb-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-nm-blue/10 flex items-center justify-center flex-shrink-0">
                    <Database className="h-5 w-5 text-nm-blue" />
                  </div>
                  <div>
                    <p className="font-black text-nm-blue text-sm mb-0.5">{ds.label}</p>
                    <p className="text-xs text-nm-muted leading-relaxed">{ds.desc}</p>
                  </div>
                </div>
                <a
                  href={`/api/offene-daten?type=${ds.type}`}
                  download
                  className="inline-flex items-center gap-2 text-xs font-bold text-nm-blue border border-nm-blue/40 px-3 py-2 rounded-lg hover:bg-nm-blue hover:text-white hover:border-nm-blue transition-all w-fit"
                >
                  <Download className="h-3.5 w-3.5" />
                  {ds.format} herunterladen
                </a>
              </div>
            ))}
          </div>

          <div className="bg-nm-gray border border-nm-line rounded-xl p-6">
            <h2 className="font-black text-nm-blue text-base mb-2">Lizenz &amp; Nutzung</h2>
            <p className="text-sm text-nm-muted leading-relaxed">
              Alle Datensätze stehen unter der{' '}
              <strong className="text-nm-text">Creative Commons CC BY 4.0</strong>{' '}
              Lizenz. Bei Verwendung bitte angeben:{' '}
              <em>„Quelle: Neue Mitte (neue-mitte.de)"</em>. Kommerzielle Nutzung erlaubt.
              Die Daten werden täglich aktualisiert.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

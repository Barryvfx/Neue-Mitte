import Link from 'next/link'

const PRIORITIES = [
  {
    number: '01',
    title: 'Staat modernisieren',
    href: '/digitalisierung',
    lead: 'Deutschland leidet unter langsamen Verwaltungsprozessen, überholten Strukturen und einer Bürokratie, die Bürger und Unternehmen gleichermaßen belastet.',
    body: 'Wir wollen einen Staat, der funktioniert. Behörden müssen digital erreichbar sein, Anträge innerhalb fester Fristen bearbeiten und transparent über Ausgaben informieren. Das ist kein technisches Problem – es ist eine Frage des politischen Willens.',
    points: [
      'Digitale Behördengänge bis 2026 vollständig möglich',
      'Gesetzliche Bearbeitungsfristen mit Entschädigungspflicht',
      'Öffentliches Transparenzregister für Staatsausgaben ab 50.000 €',
      'Volksabstimmungen auf Bundesebene einführen',
    ],
  },
  {
    number: '02',
    title: 'Bildung reformieren',
    href: '/bildung',
    lead: 'Das deutsche Bildungssystem bereitet Schülerinnen und Schüler nicht ausreichend auf das echte Leben vor. Finanzbildung, praktische Kompetenzen und digitale Kenntnisse fehlen weitgehend.',
    body: 'Ein modernes Bildungssystem muss junge Menschen auf das Leben im 21. Jahrhundert vorbereiten. Das bedeutet: weniger Auswendiglernen, mehr kritisches Denken, praktische Fähigkeiten und ein bundesweit einheitliches Niveau. Bildungserfolg darf nicht vom Wohnort abhängen.',
    points: [
      'Finanzbildung und Steuererklärung als Pflichtfächer',
      'Informatik und digitale Medienkompetenz ab Klasse 5',
      'Bundesweit einheitliches Abitur mit vergleichbaren Standards',
      'Begabtenförderung unabhängig vom sozialen Hintergrund',
    ],
  },
  {
    number: '03',
    title: 'Leistung belohnen',
    href: '/wirtschaft',
    lead: 'Arbeit muss sich lohnen. Unternehmertum muss sich lohnen. Deutschland verliert zunehmend Investitionen, Fachkräfte und Unternehmen an Standorte mit besseren Bedingungen.',
    body: 'Eine wettbewerbsfähige Wirtschaft braucht niedrige Steuern, einfache Regeln und verlässliche Infrastruktur. Wir stehen für den Mittelstand, der das Rückgrat unserer Volkswirtschaft bildet – und der in den vergangenen Jahren zu oft mit bürokratischen Lasten überhäuft wurde.',
    points: [
      'Körperschaftsteuer auf 15 % absenken',
      'Für jede neue Vorschrift müssen zwei abgeschafft werden',
      'Fachkräfteeinwanderung pragmatisch und schnell regeln',
      'Staatliche Subventionen auf Kernbereiche reduzieren',
    ],
  },
]

export default function PrioritiesSection() {
  return (
    <section className="nm-section bg-white">
      <div className="nm-container">
        <div className="mb-14">
          <span className="section-label">Unsere Positionen</span>
          <h2 className="section-title">Drei Prioritäten</h2>
          <span className="section-rule" />
          <p className="text-nm-muted max-w-xl">
            Die Neue Mitte hat klare Schwerpunkte. Keine Versprechen, die nicht finanzierbar sind.
            Keine Rhetorik ohne Inhalt.
          </p>
        </div>

        <div className="space-y-0 divide-y divide-nm-line border-t border-nm-line">
          {PRIORITIES.map((p) => (
            <div key={p.number} className="py-12 grid lg:grid-cols-12 gap-8">

              {/* Number */}
              <div className="lg:col-span-1 hidden lg:block">
                <span className="priority-number">{p.number}</span>
              </div>

              {/* Content */}
              <div className="lg:col-span-7">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-nm-muted mb-2 lg:hidden">
                  {p.number}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-nm-blue mb-4 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-nm-muted font-medium text-base mb-3 leading-relaxed italic">
                  {p.lead}
                </p>
                <p className="text-nm-muted leading-relaxed text-[15px]">
                  {p.body}
                </p>
              </div>

              {/* Points */}
              <div className="lg:col-span-4">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-4">
                  Konkrete Forderungen
                </p>
                <ul className="space-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-sm text-nm-muted leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-nm-blue flex-shrink-0 mt-2" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-1.5 text-nm-blue text-sm font-semibold mt-5 hover:underline"
                >
                  Vollständige Position lesen →
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

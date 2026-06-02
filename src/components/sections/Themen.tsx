'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown, Building2, TrendingUp, GraduationCap, Shield, Monitor, Zap } from 'lucide-react'

const FEATURED_THEMES = [
  {
    Icon: Building2,
    title: 'Staat & Verwaltung',
    teaser: 'Ein moderner Staat braucht eine moderne Verwaltung. Wir digitalisieren Behörden, bauen Bürokratie ab und bringen Transparenz in staatliche Ausgaben.',
    details: [
      { heading: 'Digitalisierung der Behörden', text: 'Alle Behördengänge sollen vollständig digital möglich sein. Kein Bürger soll mehr persönlich erscheinen müssen, was auch digital erledigt werden kann.' },
      { heading: 'Bürokratieabbau', text: 'Für jede neue Regelung werden zwei abgeschafft. Wir entrümpeln das deutsche Regelwerk von Jahrzehnten überflüssiger Vorschriften.' },
      { heading: 'Volksabstimmungen', text: 'Direkte Demokratie auf Bundesebene – Bürger sollen bei wichtigen Entscheidungen direkt mitbestimmen können.' },
      { heading: 'Transparenz der Staatsfinanzen', text: 'Alle staatlichen Ausgaben ab 50.000 Euro werden öffentlich zugänglich gemacht. Lobbyismus wird streng reguliert und offengelegt.' },
    ],
  },
  {
    Icon: TrendingUp,
    title: 'Wirtschaft & Steuern',
    teaser: 'Deutschland muss wieder wettbewerbsfähig werden. Niedrigere Steuern, weniger Bürokratie und ein einfacheres Steuersystem sind der Schlüssel.',
    details: [
      { heading: 'Steuerreform', text: 'Einfacheres Steuersystem mit einheitlichen Prozentsätzen, Entlastung der Mittelschicht und einer Reichensteuer für sehr hohe Einkommen.' },
      { heading: 'Mittelstandsförderung', text: 'Der Mittelstand ist das Rückgrat der deutschen Wirtschaft. Wir senken Unternehmenssteuern und schaffen Bürokratieerleichterungen gezielt für KMU.' },
      { heading: 'Mehr Produktion in Deutschland', text: 'Wir stärken Anreize, Produktionsstandorte in Deutschland zu halten oder zurückzuholen.' },
    ],
  },
  {
    Icon: GraduationCap,
    title: 'Bildung',
    teaser: 'Bildung ist die wichtigste Investition in die Zukunft. Wir wollen praxisnahe, einheitliche und moderne Bildung für alle.',
    details: [
      { heading: 'Finanzbildung als Pflichtfach', text: 'Steuererklärung, Altersvorsorge und Budgetplanung müssen in der Schule gelehrt werden.' },
      { heading: 'Informatik als Pflichtfach', text: 'Programmieren, Datensicherheit und digitale Kompetenz sind Grundfertigkeiten des 21. Jahrhunderts.' },
      { heading: 'Bundesweit einheitliches Abitur', text: 'Ein Abitur in Bayern soll dasselbe Niveau haben wie in Berlin. Schluss mit dem Flickenteppich unterschiedlicher Standards.' },
      { heading: 'Mehr Praxisbezug', text: 'Weniger Auswendiglernen, mehr kritisches Denken, Teamarbeit und echte Problemlösungen im Unterricht.' },
    ],
  },
  {
    Icon: Shield,
    title: 'Sicherheit & Rechtsstaat',
    teaser: 'Ein funktionierender Staat schützt seine Bürger. Wir investieren in moderne Polizei und konsequente Strafverfolgung.',
    details: [
      { heading: 'Moderne Polizeiausstattung', text: 'Bodycams, moderne IT-Systeme und ausreichend Personal sind Grundvoraussetzungen für eine effektive Polizei.' },
      { heading: 'Konsequente Strafverfolgung', text: 'Gesetze müssen für alle gelten. Wir stehen für einen Rechtsstaat, der keine Zweiklassengesellschaft kennt.' },
      { heading: 'Härtere Strafen bei Gewalt', text: 'Bei schweren Gewaltverbrechen brauchen wir abschreckende Strafen, die der Schwere der Tat entsprechen.' },
    ],
  },
  {
    Icon: Monitor,
    title: 'Digitalisierung',
    teaser: 'Deutschland hinkt digital hinterher. Wir bringen die Verwaltung ins 21. Jahrhundert und schaffen einen starken digitalen Rahmen.',
    details: [
      { heading: 'Vollständig digitale Verwaltung', text: 'Vom Reisepass bis zum Gewerbeschein – alle Behördengänge digital, schnell und sicher.' },
      { heading: 'Regulierung von Tech-Konzernen', text: 'Große Plattformen tragen Verantwortung. Wir regulieren Algorithmen, schützen Daten und bekämpfen Fake News systematisch.' },
      { heading: 'Digitale Infrastruktur', text: 'Glasfaser und 5G flächendeckend bis 2030. Keine digitalen Wüsten mehr auf dem Land.' },
    ],
  },
  {
    Icon: Zap,
    title: 'Energie & Klima',
    teaser: 'Klimaschutz ja – aber mit Vernunft und Technologie, nicht mit Verboten. Wir brauchen günstige und verlässliche Energie.',
    details: [
      { heading: 'Technologieoffener Klimaschutz', text: 'Wir setzen auf erneuerbare Energien, aber schließen keine ernsthaften Optionen aus – einschließlich moderner Kerntechnologie.' },
      { heading: 'Keine Kohlekraft vor Ersatz', text: 'Kohle wird abgeschaltet, wenn der Ersatz steht – nicht vorher. Versorgungssicherheit hat Vorrang.' },
      { heading: 'Bezahlbare Energie', text: 'Energiekosten belasten Haushalte und Unternehmen massiv. Günstiger Strom ist kein Luxus, sondern Voraussetzung für Wettbewerbsfähigkeit.' },
    ],
  },
]

function ThemeCard({ theme, index }: { theme: typeof FEATURED_THEMES[0]; index: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-base overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-11 h-11 bg-nm-blue/10 dark:bg-nm-sky/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <theme.Icon className="h-5 w-5 text-nm-blue dark:text-nm-sky" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">{theme.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{theme.teaser}</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {theme.details.map((d) => (
                  <div key={d.heading} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <h4 className="font-semibold text-sm text-nm-blue dark:text-nm-sky mb-2">{d.heading}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{d.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Themen() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="themen" className="py-24 bg-white dark:bg-gray-950" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Im Detail</span>
          <h2 className="section-title mb-4">Unsere Themen</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Hinter jedem Schlagwort stecken konkrete Forderungen. Hier erfahren Sie, was wir genau wollen.
          </p>
        </motion.div>

        <div className="space-y-3 max-w-4xl mx-auto">
          {FEATURED_THEMES.map((theme, i) => (
            <ThemeCard key={theme.title} theme={theme} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

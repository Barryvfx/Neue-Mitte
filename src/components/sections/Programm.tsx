'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Building2, TrendingUp, Receipt, GraduationCap, Heart,
  Home, Users, Shield, Monitor, Globe, Zap, Wheat,
  Baby, Clock, Flag,
} from 'lucide-react'

const AREAS = [
  {
    Icon: Building2,
    title: 'Staat & Verwaltung',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    points: ['Digitalisierung der Behörden', 'Bürokratieabbau', 'Volksabstimmungen auf Bundesebene', 'Transparenz staatlicher Ausgaben'],
  },
  {
    Icon: TrendingUp,
    title: 'Wirtschaft',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/40',
    points: ['Niedrigere Unternehmenssteuern', 'Förderung des Mittelstands', 'Mehr Produktion in Deutschland', 'Bekämpfung des Fachkräftemangels'],
  },
  {
    Icon: Receipt,
    title: 'Steuern',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/40',
    points: ['Einfacheres Steuersystem', 'Entlastung der Mittelschicht', 'Gleiche Prozentsätze für alle', 'Zusätzliche Reichensteuer'],
  },
  {
    Icon: GraduationCap,
    title: 'Bildung',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    points: ['Finanzbildung als Pflichtfach', 'Informatik als Pflichtfach', 'Bundesweit einheitliches Abitur', 'Mehr Praxisbezug'],
  },
  {
    Icon: Heart,
    title: 'Gesundheit',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40',
    points: ['Mehr Medizinstudienplätze', 'Kürzere Wartezeiten', 'Bessere Versorgung', 'Größere Krankenhäuser'],
  },
  {
    Icon: Home,
    title: 'Wohnen',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    points: ['Förderung von Wohneigentum', 'Mehr Wohnungsbau', 'Familienfreundliche Baupolitik'],
  },
  {
    Icon: Users,
    title: 'Migration',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    points: ['Fachkräfte willkommen', 'Integration fördern', 'Klare Regeln', 'Staatsbürgerschaft an Integration koppeln'],
  },
  {
    Icon: Shield,
    title: 'Sicherheit',
    color: 'text-nm-blue dark:text-nm-sky',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    points: ['Moderne Polizei & Bodycams', 'Konsequente Strafverfolgung', 'Härtere Strafen für Gewaltverbrechen', 'Schutz der Bürger'],
  },
  {
    Icon: Monitor,
    title: 'Digitalisierung',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    points: ['Digitale Behördengänge', 'Regulierung großer Plattformen', 'Bekämpfung von Fake News', 'Moderne digitale Infrastruktur'],
  },
  {
    Icon: Globe,
    title: 'Europa',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    points: ['Starkes Europa aus starken Staaten', 'Nationale Selbstbestimmung stärken', 'Keine weitere Zentralisierung der EU'],
  },
  {
    Icon: Zap,
    title: 'Energie',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/40',
    points: ['Ausbau erneuerbarer Energien', 'Solar- & Windenergie', 'Kohle nur abschalten wenn Ersatz vorhanden', 'Klimaneutralität als langfristiges Ziel'],
  },
  {
    Icon: Wheat,
    title: 'Landwirtschaft',
    color: 'text-lime-600 dark:text-lime-400',
    bg: 'bg-lime-50 dark:bg-lime-950/40',
    points: ['Weniger Bürokratie', 'Unterstützung deutscher Landwirte', 'Faire Wettbewerbsbedingungen'],
  },
  {
    Icon: Baby,
    title: 'Familie',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    points: ['Mehr Kita-Plätze', 'Unterstützung von Familien', 'Förderung von Wohneigentum'],
  },
  {
    Icon: Clock,
    title: 'Rente',
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-800/40',
    points: ['Renteneintrittsalter bei 67', 'Stärkere private Vorsorge', 'Kombination aus staatlicher & privater Altersvorsorge'],
  },
  {
    Icon: Flag,
    title: 'Außenpolitik',
    color: 'text-nm-blue dark:text-nm-sky',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    points: ['NATO-Mitgliedschaft beibehalten', 'Bundeswehr modernisieren', '2%-Ziel erfüllen', 'Weniger Abhängigkeit von China'],
  },
]

export default function Programm() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="programm" className="py-24 bg-gray-50 dark:bg-gray-900" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Was wir fordern</span>
          <h2 className="section-title mb-4">Unser Programm</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            15 Themenbereiche. Klare Forderungen. Keine leeren Versprechen.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {AREAS.map(({ Icon, title, color, bg, points }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="card-base card-hover p-5 group"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">{title}</h3>
              <ul className="space-y-1.5">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-1.5">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-nm-sky flex-shrink-0" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

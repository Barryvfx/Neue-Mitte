'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Scale, Lightbulb, Eye, Users } from 'lucide-react'

const VALUES = [
  {
    Icon: Scale,
    title: 'Pragmatismus',
    desc: 'Lösungen statt Ideologie. Was wirkt, wird umgesetzt – egal ob links, rechts oder mittig.',
  },
  {
    Icon: Eye,
    title: 'Transparenz',
    desc: 'Staatliche Ausgaben gehören veröffentlicht. Bürger haben ein Recht zu wissen, wohin ihr Geld fließt.',
  },
  {
    Icon: Users,
    title: 'Verantwortung',
    desc: 'Wir übernehmen Verantwortung für kommende Generationen – finanziell und gesellschaftlich.',
  },
  {
    Icon: Lightbulb,
    title: 'Innovation',
    desc: 'Deutschland muss technologischer Vorreiter werden. Dafür brauchen wir Mut zur Veränderung.',
  },
]

export default function Mission() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="ueber-uns" className="py-24 bg-white dark:bg-gray-950" ref={ref}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Über die Neue Mitte</span>
            <h2 className="section-title mb-6">
              Ein Staat,<br />
              <span className="text-nm-sky">der funktioniert.</span>
            </h2>
            <blockquote className="border-l-4 border-nm-sky pl-5 mb-6">
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed italic">
                „Deutschland braucht keinen größeren oder kleineren Staat.
                Deutschland braucht einen Staat, der funktioniert."
              </p>
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Die Neue Mitte ist eine politische Bewegung der pragmatischen Mitte.
              Wir stehen nicht für Ideologie, sondern für Ergebnisse. Für ein
              Deutschland, in dem Behörden funktionieren, Schulen exzellent sind,
              die Wirtschaft floriert und die Bürger wieder Vertrauen in den Staat
              haben.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Wir glauben: Wer gute Politik machen will, muss zuerst ehrlich sein –
              über Probleme, über Kosten und über Kompromisse. Die Neue Mitte
              spricht Klartext.
            </p>
          </motion.div>

          {/* Values grid */}
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="card-base card-hover p-6"
              >
                <div className="w-10 h-10 bg-nm-blue/10 dark:bg-nm-sky/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-nm-blue dark:text-nm-sky" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

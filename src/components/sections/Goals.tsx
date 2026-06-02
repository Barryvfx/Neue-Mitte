'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

const MILESTONES = [10, 50, 100, 500, 1000]

interface GoalsProps {
  count: number
}

function getNextMilestone(count: number): number {
  return MILESTONES.find((m) => m > count) ?? MILESTONES[MILESTONES.length - 1]
}

function getPrevMilestone(count: number): number {
  const passed = MILESTONES.filter((m) => m <= count)
  return passed.length > 0 ? passed[passed.length - 1] : 0
}

export default function Goals({ count }: GoalsProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const next = getNextMilestone(count)
  const prev = getPrevMilestone(count)
  const progress = next > prev ? Math.min(((count - prev) / (next - prev)) * 100, 100) : 100

  return (
    <section className="py-20 bg-nm-blue dark:bg-gray-950" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-nm-gold mb-3">
            Gemeinsam wachsen
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Unsere Unterstützer-Ziele
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Jede Unterschrift zählt. Zusammen zeigen wir: Deutschland will Politik, die funktioniert.
          </p>
        </motion.div>

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-10"
        >
          <div className="text-7xl sm:text-8xl font-black text-white mb-2 tabular-nums">
            {count.toLocaleString('de-DE')}
          </div>
          <p className="text-white/60 text-lg">
            {count === 1 ? 'Unterstützer' : 'Unterstützerinnen & Unterstützer'}
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="flex justify-between text-xs text-white/50 mb-2">
            <span>{prev.toLocaleString('de-DE')}</span>
            <span className="text-nm-gold font-bold">
              Nächstes Ziel: {next.toLocaleString('de-DE')}
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${progress}%` } : { width: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-nm-sky to-nm-gold rounded-full"
            />
          </div>
          <p className="text-center text-xs text-white/50 mt-2">
            {Math.round(progress)}% des nächsten Ziels erreicht
          </p>
        </motion.div>

        {/* Milestones */}
        <div className="flex flex-wrap justify-center gap-4">
          {MILESTONES.map((m, i) => {
            const achieved = count >= m
            return (
              <motion.div
                key={m}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  achieved
                    ? 'bg-white/15 border-white/30 text-white'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {achieved ? (
                  <CheckCircle2 className="h-4 w-4 text-nm-gold flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="font-bold text-sm">{m.toLocaleString('de-DE')}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

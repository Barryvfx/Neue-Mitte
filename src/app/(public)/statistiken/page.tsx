'use client'

import { useEffect, useState, useRef } from 'react'
import { BarChart3, Users, MessageSquare, Lightbulb, BookOpen, ShieldCheck, Scale, Quote, Vote } from 'lucide-react'

interface Stats {
  supporters: number
  members: number
  fragen: number
  ideen: number
  debatten: number
  wissenstest: number
  faktencheck: number
  glossar: number
  zitate: number
  abstimmungVotes: number
}

function AnimatedCount({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current || target === 0) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString('de-DE')}</span>
}

const STAT_CARDS = (s: Stats) => [
  { icon: Users, label: 'Unterstützer', value: s.supporters, color: 'text-nm-blue', bg: 'bg-nm-blue/10', desc: 'Menschen stehen für die Neue Mitte' },
  { icon: Users, label: 'Mitglieder', value: s.members, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'registrierte Community-Mitglieder' },
  { icon: MessageSquare, label: 'Bürgerfragen', value: s.fragen, color: 'text-green-600', bg: 'bg-green-50', desc: 'Fragen von Bürgerinnen und Bürgern' },
  { icon: Lightbulb, label: 'Ideen', value: s.ideen, color: 'text-yellow-600', bg: 'bg-yellow-50', desc: 'eingereichte Bürgerideen' },
  { icon: Scale, label: 'Debatten', value: s.debatten, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'aktive Pro-Contra-Diskussionen' },
  { icon: BookOpen, label: 'Glossar-Begriffe', value: s.glossar, color: 'text-teal-600', bg: 'bg-teal-50', desc: 'politische Begriffe erklärt' },
  { icon: ShieldCheck, label: 'Faktenchecks', value: s.faktencheck, color: 'text-red-600', bg: 'bg-red-50', desc: 'geprüfte politische Aussagen' },
  { icon: Quote, label: 'Zitate', value: s.zitate, color: 'text-pink-600', bg: 'bg-pink-50', desc: 'inspirierende politische Zitate' },
  { icon: Vote, label: 'Abstimmungen', value: s.abstimmungVotes, color: 'text-orange-600', bg: 'bg-orange-50', desc: 'abgegebene Bürgerstimmen' },
  { icon: BarChart3, label: 'Wissensfragen', value: s.wissenstest, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Quizfragen im Wissenstest' },
]

export default function StatistikenPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/statistiken').then(r => r.json()).then(setStats)
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Transparenz</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 opacity-80" /> Statistiken
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Live-Zahlen der Neuen Mitte – wie viele mitmachen, mitreden und mitdenken.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        {!stats ? (
          <div className="text-center py-20 text-nm-muted">Wird geladen…</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {STAT_CARDS(stats).map((card, i) => {
              const Icon = card.icon
              return (
                <div key={i} className="border border-nm-line rounded-xl p-5">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.bg} mb-4`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className="text-3xl font-black text-nm-text mb-1">
                    <AnimatedCount target={card.value} />
                  </p>
                  <p className={`text-xs font-black uppercase tracking-wide ${card.color} mb-1`}>{card.label}</p>
                  <p className="text-xs text-nm-muted leading-relaxed">{card.desc}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

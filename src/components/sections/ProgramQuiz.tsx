'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, RotateCcw } from 'lucide-react'

interface Question {
  text: string
  options: { label: string; topics: string[] }[]
}

const QUESTIONS: Question[] = [
  {
    text: 'Was ist für Sie die größte Herausforderung Deutschlands?',
    options: [
      { label: 'Wirtschaft & Arbeitsplätze', topics: ['wirtschaft', 'steuern'] },
      { label: 'Bildung & Zukunft', topics: ['bildung', 'digitalisierung'] },
      { label: 'Sicherheit & Ordnung', topics: ['sicherheit', 'migration'] },
      { label: 'Gesundheit & Soziales', topics: ['gesundheit', 'rente'] },
    ],
  },
  {
    text: 'Welches Zukunftsthema liegt Ihnen am meisten am Herzen?',
    options: [
      { label: 'Energie & Klimaschutz', topics: ['energie', 'landwirtschaft'] },
      { label: 'Wohnen & Familie', topics: ['wohnen', 'familie'] },
      { label: 'Europa & Außenpolitik', topics: ['europa', 'aussenpolitik'] },
      { label: 'Digitalisierung & Innovation', topics: ['digitalisierung', 'wirtschaft'] },
    ],
  },
  {
    text: 'Was sollte der Staat prioritär tun?',
    options: [
      { label: 'Bürger entlasten (Steuern & Bürokratie)', topics: ['steuern', 'wirtschaft'] },
      { label: 'Mehr investieren (Infrastruktur & Bildung)', topics: ['bildung', 'digitalisierung'] },
      { label: 'Sicherheit stärken', topics: ['sicherheit', 'migration'] },
      { label: 'Soziale Absicherung verbessern', topics: ['gesundheit', 'rente', 'familie'] },
    ],
  },
  {
    text: 'Wie sehen Sie Deutschlands Rolle?',
    options: [
      { label: 'Starke EU & internationale Verantwortung', topics: ['europa', 'aussenpolitik'] },
      { label: 'Erst Deutschland stärken', topics: ['wirtschaft', 'bildung', 'wohnen'] },
      { label: 'Ökologische Vorreiterrolle', topics: ['energie', 'landwirtschaft'] },
      { label: 'Soziale Gerechtigkeit sichern', topics: ['rente', 'gesundheit', 'familie'] },
    ],
  },
]

const LABELS: Record<string, string> = {
  wirtschaft: 'Wirtschaft', steuern: 'Steuern', bildung: 'Bildung',
  gesundheit: 'Gesundheit', migration: 'Migration', sicherheit: 'Sicherheit',
  digitalisierung: 'Digitalisierung', energie: 'Energie', wohnen: 'Wohnen',
  familie: 'Familie', rente: 'Rente', landwirtschaft: 'Landwirtschaft',
  europa: 'Europa', aussenpolitik: 'Außenpolitik',
}

export default function ProgramQuiz() {
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [done, setDone] = useState(false)

  function answer(topics: string[]) {
    const next = { ...scores }
    topics.forEach((t) => { next[t] = (next[t] ?? 0) + 1 })
    setScores(next)
    if (step + 1 >= QUESTIONS.length) {
      setDone(true)
    } else {
      setStep((s) => s + 1)
    }
  }

  function reset() {
    setStep(0)
    setScores({})
    setDone(false)
  }

  const topTopics = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([topic]) => topic)

  const progress = ((step) / QUESTIONS.length) * 100

  return (
    <div className="border border-nm-line bg-nm-gray p-6 sm:p-8">
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-nm-blue mb-2">Quiz</p>
      <h3 className="font-black text-nm-blue text-lg mb-5">Was passt zu mir?</h3>

      {/* Progress bar */}
      {!done && (
        <div className="mb-6">
          <div className="h-1 bg-nm-line rounded-full overflow-hidden">
            <div className="h-full bg-nm-blue transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-nm-muted mt-1.5">Frage {step + 1} von {QUESTIONS.length}</p>
        </div>
      )}

      {done ? (
        <div>
          <p className="text-nm-muted text-sm mb-4 leading-relaxed">
            Basierend auf Ihren Antworten sind diese Programmpunkte besonders relevant für Sie:
          </p>
          <div className="space-y-2.5 mb-6">
            {topTopics.map((topic, i) => (
              <Link
                key={topic}
                href={`/${topic}`}
                className="flex items-center justify-between p-4 bg-white border border-nm-line hover:border-nm-blue group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-nm-blue text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-bold text-nm-blue">{LABELS[topic]}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-nm-muted group-hover:text-nm-blue transition-colors" />
              </Link>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={reset} className="flex items-center gap-1.5 text-sm text-nm-muted hover:text-nm-blue transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              Nochmal
            </button>
            <Link href="/programm" className="text-sm font-semibold text-nm-blue hover:underline">
              Gesamtes Programm →
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-black text-nm-blue text-base leading-snug mb-5">
            {QUESTIONS[step].text}
          </p>
          <div className="space-y-2">
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => answer(opt.topics)}
                className="w-full text-left px-4 py-3.5 text-sm border border-nm-line bg-white text-nm-muted hover:border-nm-blue hover:text-nm-blue hover:bg-white transition-colors font-medium"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

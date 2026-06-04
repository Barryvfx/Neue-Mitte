'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, RotateCcw } from 'lucide-react'

interface Option { text: string; score: number }
interface Question { text: string; topic: string; options: Option[] }

const QUESTIONS: Question[] = [
  {
    text: 'Der Staatshaushalt ist im Defizit. Wie lösen Sie das Problem?',
    topic: 'Finanzen',
    options: [
      { text: 'Schulden machen – Investitionen jetzt, Rückzahlung später', score: 0 },
      { text: 'Ausgaben kürzen – vor allem Sozialleistungen', score: 2 },
      { text: 'Effizienz steigern: Bürokratieabbau, Digitalisierung, Verschwendung reduzieren', score: 10 },
      { text: 'Steuern erhöhen für Spitzenverdiener', score: 4 },
    ],
  },
  {
    text: 'Wie viele Flüchtlinge soll Deutschland jährlich aufnehmen?',
    topic: 'Migration',
    options: [
      { text: 'Keine Begrenzung – Humanität geht vor', score: 0 },
      { text: 'Kompletter Einwanderungsstopp', score: 0 },
      { text: 'Festes Kontingent + klare Rückführung bei Ablehnung', score: 10 },
      { text: 'Nur Hochqualifizierte, kein Asyl mehr', score: 3 },
    ],
  },
  {
    text: 'Wie beschleunigt man den Ausbau erneuerbarer Energien?',
    topic: 'Energie',
    options: [
      { text: 'Staatliche Subventionen massiv erhöhen', score: 4 },
      { text: 'Genehmigungsverfahren radikal vereinfachen + Bürokratie abbauen', score: 10 },
      { text: 'Kernkraft verlängern als Brücke', score: 7 },
      { text: 'Marktkräfte regeln das alleine', score: 2 },
    ],
  },
  {
    text: 'Was ist das wichtigste Bildungsproblem in Deutschland?',
    topic: 'Bildung',
    options: [
      { text: 'Zu wenig Geld für Schulen', score: 5 },
      { text: 'Föderalismus – 16 verschiedene Systeme sind ein Chaos', score: 8 },
      { text: 'Lehrer sind schlecht ausgebildet', score: 3 },
      { text: 'Zu wenig Digitalisierung im Unterricht', score: 10 },
    ],
  },
  {
    text: 'Wie soll die Rente langfristig gesichert werden?',
    topic: 'Soziales',
    options: [
      { text: 'Renteneintrittsalter auf 70 erhöhen', score: 2 },
      { text: 'Kapitalgedeckte Rente wie in Schweden', score: 8 },
      { text: 'Mehr Zuwanderung für mehr Beitragszahler', score: 4 },
      { text: 'Effizienzgewinne im System + Fachkräftestrategie', score: 10 },
    ],
  },
  {
    text: 'Was bremst Deutschland wirtschaftlich am meisten?',
    topic: 'Wirtschaft',
    options: [
      { text: 'Zu hohe Steuern und Abgaben', score: 8 },
      { text: 'Zu viel Bürokratie und Regulierung', score: 10 },
      { text: 'Zu wenig Innovation und Digitalisierung', score: 9 },
      { text: 'Fehlende Infrastruktur', score: 6 },
    ],
  },
]

const MAX_SCORE = QUESTIONS.reduce((s, q) => s + Math.max(...q.options.map(o => o.score)), 0)

export default function SimulatorPage() {
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const total = scores.reduce((a, b) => a + b, 0)
  const pct = Math.round((total / MAX_SCORE) * 100)

  function choose(idx: number) {
    setSelected(idx)
  }

  function next() {
    if (selected === null) return
    const newScores = [...scores, QUESTIONS[step].options[selected].score]
    if (step + 1 >= QUESTIONS.length) {
      setScores(newScores)
      setDone(true)
    } else {
      setScores(newScores)
      setStep(step + 1)
      setSelected(null)
    }
  }

  function reset() {
    setStep(0); setScores([]); setSelected(null); setDone(false)
  }

  function getResult() {
    if (pct >= 75) return { label: 'Hohe Übereinstimmung', desc: 'Sie denken wie die Neue Mitte: pragmatisch, lösungsorientiert, ohne Ideologie.', color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
    if (pct >= 50) return { label: 'Mittlere Übereinstimmung', desc: 'Sie teilen viele Ansichten der Neuen Mitte, sehen manches aber anders.', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' }
    return { label: 'Geringe Übereinstimmung', desc: 'Ihre Positionen unterscheiden sich in wesentlichen Punkten von der Neuen Mitte.', color: 'text-nm-blue', bg: 'bg-nm-blue/5 border-nm-blue/20' }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Interaktiv</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Wahlkampf-Simulator</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Treffen Sie echte politische Entscheidungen. Am Ende sehen Sie Ihre Übereinstimmung mit der Neuen Mitte.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        <div className="max-w-2xl mx-auto">
          {done ? (
            <div className="text-center">
              <div className={`border rounded-2xl p-10 mb-8 ${getResult().bg}`}>
                <div className="text-7xl font-black text-nm-blue mb-2">{pct}%</div>
                <div className={`text-xl font-black mb-3 ${getResult().color}`}>{getResult().label}</div>
                <p className="text-nm-muted leading-relaxed max-w-md mx-auto">{getResult().desc}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {QUESTIONS.map((q, i) => {
                  const s = scores[i]
                  const maxS = Math.max(...q.options.map(o => o.score))
                  const pctQ = Math.round((s / maxS) * 100)
                  return (
                    <div key={i} className="border border-nm-line rounded-xl p-4 text-left">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-nm-muted mb-1">{q.topic}</div>
                      <div className="h-1.5 bg-nm-line rounded-full overflow-hidden">
                        <div className="h-full bg-nm-blue rounded-full" style={{ width: `${pctQ}%` }} />
                      </div>
                      <div className="text-xs text-nm-muted mt-1">{pctQ}% Übereinstimmung</div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/unterstuetzen" className="btn-primary text-base px-8 py-3.5">Jetzt unterstützen</Link>
                <button onClick={reset} className="btn-outline text-base px-8 py-3.5 flex items-center gap-2 justify-center">
                  <RotateCcw className="h-4 w-4" /> Nochmal spielen
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Progress */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 h-2 bg-nm-line rounded-full overflow-hidden">
                  <div className="h-full bg-nm-blue transition-all duration-500" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-nm-muted flex-shrink-0">{step + 1} / {QUESTIONS.length}</span>
              </div>

              <div className="mb-2">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-nm-blue">{QUESTIONS[step].topic}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-nm-blue mb-6 leading-snug">{QUESTIONS[step].text}</h2>

              <div className="space-y-3 mb-8">
                {QUESTIONS[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-all ${selected === i ? 'border-nm-blue bg-nm-blue/5' : 'border-nm-line hover:border-nm-blue/40'}`}
                  >
                    <span className="text-sm font-medium text-nm-text">{opt.text}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={next}
                disabled={selected === null}
                className="btn-primary text-base px-8 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step + 1 === QUESTIONS.length ? 'Ergebnis anzeigen' : 'Weiter'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

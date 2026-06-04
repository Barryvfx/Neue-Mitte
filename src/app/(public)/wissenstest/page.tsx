'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, RotateCcw, Loader2, Brain } from 'lucide-react'

interface Question {
  id: string
  text: string
  options: string[]
  stats?: Record<string, number>
}

interface AnswerResult {
  correct: boolean
  correctAnswer: string
  stats: Record<string, number>
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function WissenstestPage() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)

  const loadQuestion = useCallback(async () => {
    setLoading(true)
    setSelected(null)
    setResult(null)
    try {
      const res = await fetch('/api/wissenstest')
      const data = await res.json()
      setQuestion(data)
    } catch {
      setQuestion(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadQuestion() }, [loadQuestion])

  async function handleAnswer(option: string) {
    if (result || submitting || !question) return
    setSelected(option)
    setSubmitting(true)
    try {
      const res = await fetch('/api/wissenstest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, answer: option }),
      })
      const data: AnswerResult = await res.json()
      setResult(data)
      setQuestionCount(c => c + 1)

      // Increment civic score if email stored
      const email = typeof window !== 'undefined' ? localStorage.getItem('nm_supporter_email') : null
      if (email && data.correct) {
        fetch('/api/civic-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, action: 'wissenstest' }),
        }).catch(() => {})
      }
    } catch {
      setSubmitting(false)
    }
    setSubmitting(false)
  }

  function getTotalVotes(stats: Record<string, number>) {
    return Object.values(stats).reduce((a, b) => a + b, 0)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Politische Bildung</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Wissenstest</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Testen Sie Ihr politisches Wissen. Beantworten Sie Fragen zu Politik, Recht und Demokratie.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        <div className="max-w-2xl mx-auto">
          {questionCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-nm-muted mb-6">
              <Brain className="h-4 w-4" />
              <span>{questionCount} Frage{questionCount !== 1 ? 'n' : ''} beantwortet in dieser Sitzung</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3 text-nm-muted">
              <Loader2 className="h-8 w-8 animate-spin text-nm-blue" />
              <span>Frage wird geladen…</span>
            </div>
          ) : !question ? (
            <div className="text-center py-24">
              <Brain className="h-14 w-14 text-nm-line mx-auto mb-4" />
              <p className="text-nm-muted text-lg font-semibold mb-4">Keine Fragen verfügbar</p>
              <button onClick={loadQuestion} className="btn-primary">
                <RotateCcw className="h-4 w-4" /> Erneut versuchen
              </button>
            </div>
          ) : (
            <div>
              <div className="border border-nm-line rounded-2xl p-6 sm:p-8 mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-nm-blue mb-6 leading-snug">
                  {question.text}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, i) => {
                    const label = OPTION_LABELS[i]
                    const isSelected = selected === option
                    const isCorrect = result?.correctAnswer === option
                    const isWrong = isSelected && result && !result.correct

                    let borderClass = 'border-nm-line hover:border-nm-blue/50'
                    let bgClass = 'bg-white'
                    let textClass = 'text-nm-text'

                    if (result) {
                      if (isCorrect) {
                        borderClass = 'border-green-500'
                        bgClass = 'bg-green-50'
                        textClass = 'text-green-800'
                      } else if (isWrong) {
                        borderClass = 'border-red-400'
                        bgClass = 'bg-red-50'
                        textClass = 'text-red-700'
                      } else {
                        borderClass = 'border-nm-line'
                        bgClass = 'bg-white'
                        textClass = 'text-nm-muted'
                      }
                    } else if (isSelected) {
                      borderClass = 'border-nm-blue'
                      bgClass = 'bg-nm-blue/5'
                    }

                    const totalVotes = result ? getTotalVotes(result.stats) : 0
                    const pct = result && totalVotes > 0
                      ? Math.round(((result.stats[option] ?? 0) / totalVotes) * 100)
                      : 0

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={!!result || submitting}
                        className={`w-full text-left border-2 rounded-xl p-4 transition-all relative overflow-hidden ${borderClass} ${bgClass} disabled:cursor-default`}
                      >
                        {result && (
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-700 ${isCorrect ? 'bg-green-100' : isWrong ? 'bg-red-100' : 'bg-nm-gray/60'}`}
                            style={{ width: `${pct}%` }}
                          />
                        )}
                        <div className="relative flex items-center gap-3">
                          <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black
                            ${isCorrect ? 'border-green-500 bg-green-500 text-white' : isWrong ? 'border-red-400 bg-red-400 text-white' : 'border-current'} ${textClass}`}>
                            {label}
                          </span>
                          <span className={`text-sm font-medium flex-1 ${textClass}`}>{option}</span>
                          {result && (
                            <span className={`text-xs font-bold ml-auto ${textClass}`}>{pct}%</span>
                          )}
                          {isCorrect && result && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                          {isWrong && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {result && (
                <div className={`rounded-xl p-4 mb-6 border ${result.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className={`flex items-center gap-2 font-black text-base mb-1 ${result.correct ? 'text-green-700' : 'text-red-700'}`}>
                    {result.correct
                      ? <><CheckCircle className="h-5 w-5" /> Richtig! Gut gemacht.</>
                      : <><XCircle className="h-5 w-5" /> Leider falsch.</>
                    }
                  </div>
                  {!result.correct && (
                    <p className="text-sm text-red-700">
                      Die richtige Antwort ist: <strong>{result.correctAnswer}</strong>
                    </p>
                  )}
                </div>
              )}

              {result && (
                <button onClick={loadQuestion} className="btn-primary w-full sm:w-auto">
                  <RotateCcw className="h-4 w-4" /> Nächste Frage
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

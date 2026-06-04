'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Trophy, Star, Zap, TrendingUp, Medal, Loader2 } from 'lucide-react'

interface CivicScore {
  email: string
  score: number
  rank: number
  actionsCount: number
  displayName?: string
}

interface LeaderboardEntry {
  email: string
  displayName?: string
  score: number
  rank: number
}

const MILESTONES = [100, 250, 500, 1000]

function getNextMilestone(score: number) {
  return MILESTONES.find(m => m > score) ?? null
}

function getMilestoneProgress(score: number) {
  const prev = MILESTONES.filter(m => m <= score).pop() ?? 0
  const next = getNextMilestone(score)
  if (!next) return 100
  return Math.round(((score - prev) / (next - prev)) * 100)
}

function getRankBadge(rank: number) {
  if (rank === 1) return { label: '🥇 Platz 1', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' }
  if (rank === 2) return { label: '🥈 Platz 2', bg: 'bg-gray-100',   text: 'text-gray-700',   border: 'border-gray-300' }
  if (rank === 3) return { label: '🥉 Platz 3', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' }
  if (rank <= 10) return { label: `Top 10 · #${rank}`, bg: 'bg-nm-blue/10', text: 'text-nm-blue', border: 'border-nm-blue/30' }
  return { label: `Platz ${rank}`, bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
}

export default function CivicScorePage() {
  const [email, setEmail] = useState<string | null>(null)
  const [emailChecked, setEmailChecked] = useState(false)
  const [score, setScore] = useState<CivicScore | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingBoard, setLoadingBoard] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('nm_supporter_email')
    setEmail(stored)
    setEmailChecked(true)
  }, [])

  const fetchScore = useCallback(async () => {
    if (!email) { setLoading(false); return }
    try {
      const res = await fetch(`/api/civic-score?email=${encodeURIComponent(email)}`)
      if (res.ok) setScore(await res.json())
    } catch {}
    setLoading(false)
  }, [email])

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/civic-score/leaderboard')
      if (res.ok) setLeaderboard(await res.json())
    } catch {}
    setLoadingBoard(false)
  }, [])

  useEffect(() => {
    if (emailChecked) {
      fetchScore()
      fetchLeaderboard()
    }
  }, [emailChecked, fetchScore, fetchLeaderboard])

  const nextMilestone = score ? getNextMilestone(score.score) : null
  const progress = score ? getMilestoneProgress(score.score) : 0

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Gamification</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 opacity-80" />
            Civic Score
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Sammeln Sie Punkte für Ihr politisches Engagement. Wissenstests, Debatten, Petitionen — alles zählt.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl">
          {/* Personal Score */}
          <div className="lg:col-span-2">
            {!emailChecked ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-nm-blue" />
              </div>
            ) : !email ? (
              <div className="border border-nm-line rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-nm-blue/10 mb-6">
                  <Star className="h-8 w-8 text-nm-blue" />
                </div>
                <h2 className="text-xl font-black text-nm-blue mb-3">Werden Sie Unterstützer</h2>
                <p className="text-nm-muted mb-6 leading-relaxed">
                  Um Ihren persönlichen Civic Score zu sehen und Punkte zu sammeln, werden Sie Unterstützer der Neuen Mitte.
                </p>
                <Link href="/unterstuetzen" className="btn-primary">Jetzt Unterstützer werden</Link>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-nm-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Score wird geladen…</span>
              </div>
            ) : !score ? (
              <div className="border border-nm-line rounded-2xl p-8 text-center">
                <Star className="h-12 w-12 text-nm-line mx-auto mb-4" />
                <p className="text-nm-muted font-semibold mb-2">Noch kein Score</p>
                <p className="text-nm-muted text-sm mb-6">
                  Starten Sie mit dem Wissenstest oder einer Debatte, um Punkte zu sammeln.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/wissenstest" className="btn-primary">Wissenstest starten</Link>
                  <Link href="/debatte" className="btn-outline">An Debatte teilnehmen</Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score card */}
                <div className="border border-nm-line rounded-2xl p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-nm-muted mb-1">Ihr Score</p>
                      <p className="text-7xl font-black text-nm-blue leading-none">{score.score}</p>
                      <p className="text-nm-muted text-sm mt-2">Punkte</p>
                    </div>
                    <div>
                      {(() => {
                        const badge = getRankBadge(score.rank)
                        return (
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-black border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {badge.label}
                          </span>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-nm-gray rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-nm-blue" />
                        <span className="text-xs font-bold text-nm-muted uppercase tracking-wide">Aktionen</span>
                      </div>
                      <p className="text-2xl font-black text-nm-blue">{score.actionsCount}</p>
                    </div>
                    <div className="bg-nm-gray rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-nm-blue" />
                        <span className="text-xs font-bold text-nm-muted uppercase tracking-wide">Rang</span>
                      </div>
                      <p className="text-2xl font-black text-nm-blue">#{score.rank}</p>
                    </div>
                  </div>

                  {/* Milestone progress */}
                  {nextMilestone ? (
                    <div>
                      <div className="flex justify-between text-xs text-nm-muted mb-2">
                        <span>Fortschritt zum nächsten Meilenstein</span>
                        <span className="font-bold">{score.score} / {nextMilestone} Punkte</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-nm-muted mt-1.5">
                        Noch {nextMilestone - score.score} Punkte bis zum Meilenstein <strong>{nextMilestone}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                      <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                      <p className="text-yellow-800 font-black text-sm">Alle Meilensteine erreicht! 🎉</p>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                <div className="border border-nm-line rounded-xl p-5">
                  <h3 className="text-sm font-black text-nm-blue mb-4">Meilensteine</h3>
                  <div className="flex items-center gap-2">
                    {MILESTONES.map((m, i) => {
                      const achieved = score.score >= m
                      return (
                        <div key={m} className="flex-1 text-center">
                          <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-black
                            ${achieved ? 'bg-nm-blue text-white' : 'bg-nm-gray text-nm-muted border border-nm-line'}`}>
                            {achieved ? '✓' : i + 1}
                          </div>
                          <p className={`text-[10px] font-bold ${achieved ? 'text-nm-blue' : 'text-nm-muted'}`}>{m}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3">
                  <Link href="/wissenstest" className="btn-primary text-sm">Wissenstest (+10 Punkte)</Link>
                  <Link href="/debatte" className="btn-outline text-sm">Debattieren</Link>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-base font-black text-nm-blue mb-4 flex items-center gap-2">
              <Medal className="h-5 w-5" /> Top 10
            </h2>
            {loadingBoard ? (
              <div className="flex items-center justify-center py-12 gap-2 text-nm-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="border border-nm-line rounded-xl p-5 text-center">
                <p className="text-nm-muted text-sm">Noch keine Einträge.</p>
              </div>
            ) : (
              <div className="border border-nm-line rounded-xl overflow-hidden">
                {leaderboard.slice(0, 10).map((entry, i) => {
                  const isMe = entry.email === email
                  const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null

                  return (
                    <div
                      key={entry.email}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-nm-line last:border-b-0 ${isMe ? 'bg-nm-blue/5 border-nm-blue/20' : 'bg-white'}`}
                    >
                      <span className="w-6 text-center text-sm font-black text-nm-muted">
                        {medal ?? `${i + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${isMe ? 'text-nm-blue' : 'text-nm-text'}`}>
                          {entry.displayName ?? entry.email.split('@')[0]}
                          {isMe && <span className="text-[10px] ml-1.5 text-nm-blue/70">(Sie)</span>}
                        </p>
                      </div>
                      <span className="text-sm font-black text-nm-blue tabular-nums">{entry.score}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

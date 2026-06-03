'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const CELL = 18
const COLS = 20
const ROWS = 15
const W = CELL * COLS
const H = CELL * ROWS
const TICK_MS = 145

type Pt = { x: number; y: number }
type GameState = 'idle' | 'playing' | 'dead'

function rnd(max: number) { return Math.floor(Math.random() * max) }

function placeFood(snake: Pt[]): Pt {
  let p: Pt
  do { p = { x: rnd(COLS), y: rnd(ROWS) } }
  while (snake.some(s => s.x === p.x && s.y === p.y))
  return p
}

const INIT: Pt[] = [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }]

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const g = useRef({
    snake: INIT.map(p => ({ ...p })),
    dir: { x: 1, y: 0 } as Pt,
    next: { x: 1, y: 0 } as Pt,
    food: { x: 15, y: 7 } as Pt,
    score: 0,
    alive: false,
  })
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [ui, setUi] = useState<{ score: number; state: GameState }>({ score: 0, state: 'idle' })

  const render = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const { snake, food } = g.current

    ctx.fillStyle = '#0B3A75'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 1
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke() }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke() }

    // food = gold vote token
    ctx.fillStyle = '#F0B823'
    ctx.beginPath()
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0B3A75'
    ctx.font = `bold ${CELL - 7}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✓', food.x * CELL + CELL / 2, food.y * CELL + CELL / 2 + 1)

    // snake
    snake.forEach((s, i) => {
      const isHead = i === 0
      const alpha = isHead ? 1 : Math.max(0.35, 1 - i * 0.04)
      ctx.fillStyle = isHead ? '#22C55E' : `rgba(34,197,94,${alpha})`
      const pad = isHead ? 2 : 3
      ctx.fillRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
    })
  }, [])

  const steer = useCallback((nd: Pt) => {
    const { dir, alive } = g.current
    if (!alive) return
    if (nd.x + dir.x !== 0 || nd.y + dir.y !== 0) g.current.next = nd
  }, [])

  const tick = useCallback(() => {
    const s = g.current
    s.dir = s.next
    const head = s.snake[0]
    const nx = {
      x: (head.x + s.dir.x + COLS) % COLS,
      y: (head.y + s.dir.y + ROWS) % ROWS,
    }
    if (s.snake.some(c => c.x === nx.x && c.y === nx.y)) {
      s.alive = false
      if (timer.current) clearInterval(timer.current)
      setUi({ score: s.score, state: 'dead' })
      render()
      return
    }
    const ate = nx.x === s.food.x && nx.y === s.food.y
    s.snake = [nx, ...s.snake]
    if (!ate) s.snake.pop()
    else { s.score++; s.food = placeFood(s.snake); setUi(u => ({ ...u, score: s.score })) }
    render()
  }, [render])

  const start = useCallback(() => {
    const s = g.current
    s.snake = INIT.map(p => ({ ...p }))
    s.dir = { x: 1, y: 0 }
    s.next = { x: 1, y: 0 }
    s.food = { x: 15, y: 7 }
    s.score = 0
    s.alive = true
    setUi({ score: 0, state: 'playing' })
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(tick, TICK_MS)
    render()
  }, [tick, render])

  useEffect(() => {
    render()
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      }
      const nd = map[e.key]
      if (!nd) return
      steer(nd)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); if (timer.current) clearInterval(timer.current) }
  }, [render, steer])

  // swipe support
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    let tx = 0, ty = 0
    const onStart = (e: TouchEvent) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; e.preventDefault() }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - tx
      const dy = e.changedTouches[0].clientY - ty
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return
      if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 })
      else steer(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 })
    }
    c.addEventListener('touchstart', onStart, { passive: false })
    c.addEventListener('touchend', onEnd)
    return () => { c.removeEventListener('touchstart', onStart); c.removeEventListener('touchend', onEnd) }
  }, [steer])

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="text-white/60 text-sm tracking-wide">
        Stimmen gesammelt: <span className="text-yellow-400 font-black text-base">{ui.score}</span>
      </div>

      <div className="relative w-full" style={{ maxWidth: W }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block rounded-xl border border-white/10 w-full"
        />
        {ui.state !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B3A75]/75 backdrop-blur-sm rounded-xl gap-4">
            {ui.state === 'dead' && (
              <div className="text-center">
                <p className="text-white/60 text-sm uppercase tracking-widest font-bold mb-1">Ergebnis</p>
                <p className="text-white font-black text-4xl">{ui.score}</p>
                <p className="text-white/50 text-sm">Stimmen gesammelt</p>
              </div>
            )}
            {ui.state === 'idle' && (
              <div className="text-center">
                <div className="text-white font-black text-2xl mb-1">Sammle Stimmen!</div>
                <p className="text-white/50 text-xs">Steuere die Schlange zu den goldenen Stimmen</p>
              </div>
            )}
            <button
              onClick={start}
              className="px-8 py-3 bg-white text-nm-blue font-black rounded-xl hover:bg-yellow-400 hover:text-nm-blue transition-colors text-sm"
            >
              {ui.state === 'dead' ? 'Nochmal spielen' : 'Spiel starten'}
            </button>
            <p className="text-white/30 text-xs">Pfeiltasten · WASD · Wischen</p>
          </div>
        )}
      </div>

      {/* Mobile d-pad */}
      {ui.state === 'playing' && (
        <div className="grid grid-rows-3 grid-cols-3 gap-1 sm:hidden" style={{ gridTemplateAreas: `". up ." "left . right" ". down ."` }}>
          <button onClick={() => steer({ x: 0, y: -1 })} style={{ gridArea: 'up' }}
            className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl text-white active:bg-white/25">
            <ChevronUp className="w-6 h-6" />
          </button>
          <button onClick={() => steer({ x: -1, y: 0 })} style={{ gridArea: 'left' }}
            className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl text-white active:bg-white/25">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => steer({ x: 1, y: 0 })} style={{ gridArea: 'right' }}
            className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl text-white active:bg-white/25">
            <ChevronRight className="w-6 h-6" />
          </button>
          <button onClick={() => steer({ x: 0, y: 1 })} style={{ gridArea: 'down' }}
            className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl text-white active:bg-white/25">
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Sparkles } from 'lucide-react'

interface Props {
  firstName: string
  lastName: string
  city?: string
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export default function MemberCard({ firstName, lastName, city }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const memberIdRef = useRef(`NM-${String(Date.now()).slice(-6)}`)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 600, H = 375
    canvas.width = W
    canvas.height = H

    // Clip rounded corners
    rrect(ctx, 0, 0, W, H, 18)
    ctx.clip()

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W * 0.7, H)
    bg.addColorStop(0, '#0E4795')
    bg.addColorStop(0.5, '#0B3A75')
    bg.addColorStop(1, '#030D1F')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Subtle diagonal grid
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.025)'
    ctx.lineWidth = 1
    for (let i = -H; i < W + H; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke()
    }
    ctx.restore()

    // Large decorative ring — bottom right
    const rings = [
      { cx: W - 30, cy: H + 20, r: 230, alpha: 0.07 },
      { cx: W - 30, cy: H + 20, r: 185, alpha: 0.1 },
      { cx: W - 30, cy: H + 20, r: 140, alpha: 0.08 },
    ]
    for (const ring of rings) {
      ctx.beginPath()
      ctx.arc(ring.cx, ring.cy, ring.r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(240, 184, 35, ${ring.alpha})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // NM emblem circle (top right)
    const emCx = W - 78, emCy = 78, emR = 52
    const emGrad = ctx.createRadialGradient(emCx - 15, emCy - 15, 8, emCx, emCy, emR)
    emGrad.addColorStop(0, 'rgba(240,184,35,0.22)')
    emGrad.addColorStop(1, 'rgba(240,184,35,0.04)')
    ctx.beginPath()
    ctx.arc(emCx, emCy, emR, 0, Math.PI * 2)
    ctx.fillStyle = emGrad
    ctx.fill()
    ctx.strokeStyle = 'rgba(240,184,35,0.35)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    // NM text
    ctx.font = '900 28px system-ui, sans-serif'
    ctx.fillStyle = '#F0B823'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('NM', emCx, emCy + 1)

    // German flag stripes (top)
    const sw = W, sh = 4.5
    ctx.fillStyle = '#1A1A1A'; ctx.fillRect(0, 0, sw, sh)
    ctx.fillStyle = '#CC0000'; ctx.fillRect(0, sh, sw, sh)
    ctx.fillStyle = '#F0B823'; ctx.fillRect(0, sh * 2, sw, sh)

    // "NEUE MITTE" label
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.font = '700 11px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.38)'
    ctx.fillText('N E U E   M I T T E', 38, 68)

    // Thin separator
    const sepGrad = ctx.createLinearGradient(38, 0, 300, 0)
    sepGrad.addColorStop(0, 'rgba(255,255,255,0.15)')
    sepGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = sepGrad
    ctx.fillRect(38, 78, 260, 1)

    // Name
    ctx.font = '900 38px system-ui, sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(`${firstName} ${lastName}`, 38, 168)

    // City
    if (city) {
      ctx.font = '400 18px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.fillText(city, 38, 198)
    }

    // Gold gradient line
    const lineY = city ? 224 : 208
    const lg = ctx.createLinearGradient(38, 0, 180, 0)
    lg.addColorStop(0, '#F0B823')
    lg.addColorStop(0.7, 'rgba(240,184,35,0.4)')
    lg.addColorStop(1, 'rgba(240,184,35,0)')
    ctx.fillStyle = lg
    ctx.fillRect(38, lineY, 160, 2)

    // Date
    const since = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    ctx.font = '400 13px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.38)'
    ctx.fillText(`Unterstützer seit ${since}`, 38, lineY + 30)

    // Member ID
    ctx.font = '700 11px monospace'
    ctx.fillStyle = 'rgba(240,184,35,0.55)'
    ctx.fillText(memberIdRef.current, 38, lineY + 56)

    // Bottom gold bar
    const botGrad = ctx.createLinearGradient(0, 0, W, 0)
    botGrad.addColorStop(0, '#F0B823')
    botGrad.addColorStop(0.5, '#FFD566')
    botGrad.addColorStop(1, '#F0B823')
    ctx.fillStyle = botGrad
    ctx.fillRect(0, H - 5, W, 5)

    // URL bottom right
    ctx.font = '400 11px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.textAlign = 'right'
    ctx.fillText('neue-mitte.org', W - 38, H - 18)
  }

  useEffect(() => { draw() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function download() {
    draw()
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `neue-mitte-${memberIdRef.current}.png`
    a.click()
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 10
    setTilt({ x, y })
  }

  const since = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-3.5 h-3.5 text-nm-blue" />
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted">
          Ihre Mitgliedskarte
        </p>
      </div>

      {/* Interactive CSS card (preview) */}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative cursor-default select-none"
        style={{
          perspective: '900px',
          maxWidth: 440,
        }}
      >
        <div
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            transition: tilt.x === 0 ? 'transform 0.6s ease' : 'transform 0.08s ease',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${50 + tilt.x * 2}% ${50 - tilt.y * 2}%, rgba(255,255,255,0.08) 0%, transparent 65%)`,
              borderRadius: 14,
            }}
          />

          {/* Card body */}
          <div
            className="relative"
            style={{
              background: 'linear-gradient(135deg, #0E4795 0%, #0B3A75 50%, #030D1F 100%)',
              padding: '0 0 0 0',
            }}
          >
            {/* German flag stripes */}
            <div className="flex" style={{ height: 13 }}>
              <div className="flex-1" style={{ background: '#1A1A1A' }} />
              <div className="flex-1" style={{ background: '#CC0000' }} />
              <div className="flex-1" style={{ background: '#F0B823' }} />
            </div>

            <div className="relative px-8 pt-5 pb-6">
              {/* Decorative rings */}
              <div className="absolute right-[-20px] bottom-[-30px] w-56 h-56 rounded-full pointer-events-none"
                style={{ border: '1px solid rgba(240,184,35,0.12)' }} />
              <div className="absolute right-[-4px] bottom-[-14px] w-40 h-40 rounded-full pointer-events-none"
                style={{ border: '1px solid rgba(240,184,35,0.15)' }} />

              {/* Top row */}
              <div className="flex items-start justify-between mb-5">
                <p className="text-[10px] font-bold tracking-[0.22em] text-white/35 uppercase">
                  N E U E &nbsp;&nbsp; M I T T E
                </p>
                {/* NM Emblem */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, rgba(240,184,35,0.22), rgba(240,184,35,0.04))',
                    border: '1.5px solid rgba(240,184,35,0.38)',
                  }}>
                  <span className="font-black text-lg text-yellow-400">NM</span>
                </div>
              </div>

              {/* Divider */}
              <div className="mb-4" style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />

              {/* Name */}
              <p className="font-black text-white text-2xl leading-tight mb-1">
                {firstName} {lastName}
              </p>
              {city && (
                <p className="text-white/55 text-sm">{city}</p>
              )}

              {/* Gold line */}
              <div className="my-4" style={{ height: 2, width: 120, background: 'linear-gradient(90deg, #F0B823, rgba(240,184,35,0))' }} />

              {/* Info row */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/38 text-[11px]">Unterstützer seit</p>
                  <p className="text-white/60 text-xs font-semibold">{since}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-400/60 text-[11px] font-mono">{memberIdRef.current}</p>
                  <p className="text-white/20 text-[10px] mt-0.5">neue-mitte.org</p>
                </div>
              </div>
            </div>

            {/* Gold bottom bar */}
            <div style={{ height: 5, background: 'linear-gradient(90deg, #F0B823, #FFD566, #F0B823)' }} />
          </div>
        </div>
      </div>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={download}
          className="flex items-center gap-2 px-4 py-2 bg-nm-blue text-white text-sm font-semibold rounded-lg hover:bg-nm-dark transition-colors"
        >
          <Download className="w-4 h-4" />
          Als Bild herunterladen
        </button>
        <p className="text-xs text-nm-muted">PNG · Für Social Media geeignet</p>
      </div>
    </div>
  )
}

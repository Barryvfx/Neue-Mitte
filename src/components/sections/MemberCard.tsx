'use client'

import { useRef } from 'react'
import { Download } from 'lucide-react'

interface Props {
  firstName: string
  lastName: string
  city?: string
}

export default function MemberCard({ firstName, lastName, city }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 560, H = 320
    canvas.width = W
    canvas.height = H

    // Background
    ctx.fillStyle = '#0B3A75'
    ctx.fillRect(0, 0, W, H)

    // Gold top bar
    ctx.fillStyle = '#F0B823'
    ctx.fillRect(0, 0, W, 8)

    // Subtle pattern dots
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    for (let x = 0; x < W; x += 24) {
      for (let y = 0; y < H; y += 24) {
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // "NEUE MITTE" badge
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.fillRect(40, 36, 140, 32)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 13px system-ui, sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText('NEUE MITTE', 52, 52)

    // Name
    ctx.font = 'bold 38px system-ui, sans-serif'
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`${firstName} ${lastName}`, 40, 160)

    // City
    if (city) {
      ctx.font = '22px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.fillText(`aus ${city}`, 40, 192)
    }

    // Divider
    ctx.fillStyle = '#F0B823'
    ctx.fillRect(40, 218, 60, 3)

    // Since text
    const since = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText(`Unterstützer seit ${since}`, 40, 252)

    // URL
    ctx.font = 'bold 13px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillText('neue-mitte.org', 40, 290)
  }

  function download() {
    draw()
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'neue-mitte-unterstuetzer.png'
    a.click()
  }

  return (
    <div className="mt-6">
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-nm-muted mb-3">
        Ihre Mitgliedskarte
      </p>
      <div className="border border-nm-line overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ aspectRatio: '560/320' }}
          // draw on first mount via CSS background until downloaded
        />
        {/* Preview rendered by JS on mount */}
        <div className="bg-nm-blue p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-400" />
          <div className="inline-block bg-white/15 px-3 py-1 text-white text-[11px] font-black tracking-widest mb-4">
            NEUE MITTE
          </div>
          <p className="text-white font-black text-2xl leading-tight">
            {firstName} {lastName}
          </p>
          {city && <p className="text-white/60 text-base mt-0.5">aus {city}</p>}
          <div className="w-12 h-0.5 bg-yellow-400 my-4" />
          <p className="text-white/40 text-xs">
            Unterstützer seit {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-white/25 text-xs mt-1">neue-mitte.org</p>
        </div>
      </div>
      <button
        onClick={download}
        className="mt-3 flex items-center gap-2 text-sm font-semibold text-nm-blue hover:text-nm-blue/80 transition-colors"
      >
        <Download className="w-4 h-4" />
        Als Bild herunterladen
      </button>
    </div>
  )
}

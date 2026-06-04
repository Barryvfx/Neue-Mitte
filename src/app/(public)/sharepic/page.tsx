'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, Share2, Copy, Check } from 'lucide-react'

const TEMPLATES = [
  { id: 'a', label: 'Deutschland kann mehr.',   sub: 'Neue Mitte – Politik, die funktioniert.' },
  { id: 'b', label: 'Weniger Bürokratie.',       sub: 'Für ein Deutschland, das anpackt.' },
  { id: 'c', label: 'Bildung ist Zukunft.',       sub: 'Die Neue Mitte investiert in Köpfe.' },
  { id: 'd', label: 'Pragmatisch. Ehrlich. Neu.', sub: 'Neue Mitte – Für die schweigende Mehrheit.' },
  { id: 'custom', label: 'Eigener Text',          sub: '' },
]

export default function SharepicPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selected, setSelected] = useState(TEMPLATES[0])
  const [customText, setCustomText] = useState('')
  const [customSub, setCustomSub] = useState('')
  const [copied, setCopied] = useState(false)

  const headline = selected.id === 'custom' ? (customText || 'Ihr Text hier.') : selected.label
  const subline  = selected.id === 'custom' ? (customSub  || 'Neue Mitte – Deutschland kann mehr.') : selected.sub

  useEffect(() => {
    draw()
  }, [headline, subline])

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 1080, H = 1080
    canvas.width = W; canvas.height = H

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0E4795')
    grad.addColorStop(0.6, '#0B3A75')
    grad.addColorStop(1, '#030D1F')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Dot grid
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    for (let x = 32; x < W; x += 48) {
      for (let y = 32; y < H; y += 48) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill()
      }
    }

    // German flag stripe left
    const stripeW = 16
    ctx.fillStyle = '#1A1A1A'; ctx.fillRect(60, 0, stripeW, H)
    ctx.fillStyle = '#CC0000'; ctx.fillRect(80, 0, stripeW, H)
    ctx.fillStyle = '#F0B823'; ctx.fillRect(100, 0, stripeW, H)

    // NM badge top right
    ctx.strokeStyle = 'rgba(240,184,35,0.7)'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(W - 100, 100, 50, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = '#F0B823'
    ctx.font = 'bold 28px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('NM', W - 100, 110)

    // Org name
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = 'bold 22px system-ui'
    ctx.textAlign = 'left'
    ctx.letterSpacing = '0.2em'
    ctx.fillText('NEUE MITTE · DEUTSCHLAND', 150, 120)

    // Gold line
    const lineGrad = ctx.createLinearGradient(150, 0, W * 0.75, 0)
    lineGrad.addColorStop(0, 'rgba(240,184,35,0.9)')
    lineGrad.addColorStop(1, 'rgba(240,184,35,0.05)')
    ctx.fillStyle = lineGrad
    ctx.fillRect(150, 420, W - 200, 3)

    // Headline
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 88px system-ui'
    ctx.textAlign = 'left'
    const maxW = W - 250
    let fontSize = 88
    while (ctx.measureText(headline).width > maxW && fontSize > 40) {
      fontSize -= 4
      ctx.font = `bold ${fontSize}px system-ui`
    }

    // Word wrap headline
    const words = headline.split(' ')
    let line = '', y = 480
    for (const word of words) {
      const test = line ? line + ' ' + word : word
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, 150, y); line = word; y += fontSize * 1.2
      } else { line = test }
    }
    ctx.fillText(line, 150, y)

    // Subline
    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.font = '32px system-ui'
    ctx.fillText(subline, 150, y + 80)

    // Bottom URL
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = 'bold 26px system-ui'
    ctx.textAlign = 'right'
    ctx.fillText('neue-mitte.org', W - 80, H - 80)
  }

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'neue-mitte-sharepic.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function copyToClipboard() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (!blob) return
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => download())
    })
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://neue-mitte.org'

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Mitmachen</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Sharepic-Generator</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Erstellen Sie ein politisches Statement-Bild zum Teilen in sozialen Netzwerken.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Left: controls */}
          <div className="space-y-5">
            <div>
              <label className="nm-label">Vorlage wählen</label>
              <div className="space-y-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t)}
                    className={`w-full text-left px-4 py-3 border-2 rounded-xl transition-all ${selected.id === t.id ? 'border-nm-blue bg-nm-blue/5' : 'border-nm-line hover:border-nm-blue/40'}`}
                  >
                    <p className="font-bold text-nm-blue text-sm">{t.label}</p>
                    {t.sub && <p className="text-xs text-nm-muted mt-0.5">{t.sub}</p>}
                  </button>
                ))}
              </div>
            </div>

            {selected.id === 'custom' && (
              <div className="space-y-3">
                <div>
                  <label className="nm-label">Ihr Statement *</label>
                  <input value={customText} onChange={e => setCustomText(e.target.value)} className="nm-input" placeholder="z. B. Bürokratie abbauen, jetzt!" maxLength={60} />
                </div>
                <div>
                  <label className="nm-label">Unterzeile <span className="font-normal normal-case text-nm-muted">(optional)</span></label>
                  <input value={customSub} onChange={e => setCustomSub(e.target.value)} className="nm-input" placeholder="Neue Mitte – Deutschland kann mehr." maxLength={70} />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={download} className="btn-primary flex-1 justify-center">
                <Download className="h-4 w-4" /> PNG herunterladen
              </button>
              <button onClick={copyToClipboard} className="btn-outline px-4">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(headline + ' – ' + shareUrl + '/sharepic')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold border border-nm-line rounded-xl px-4 py-2.5 hover:border-nm-blue hover:text-nm-blue transition-all"
              >
                <Share2 className="h-4 w-4" /> X / Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(headline + ' – ' + shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold border border-nm-line rounded-xl px-4 py-2.5 hover:border-green-500 hover:text-green-600 transition-all"
              >
                <Share2 className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Right: preview */}
          <div>
            <p className="nm-label mb-2">Vorschau (1080×1080px)</p>
            <canvas ref={canvasRef} className="w-full rounded-xl shadow-lg" style={{ aspectRatio: '1/1' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

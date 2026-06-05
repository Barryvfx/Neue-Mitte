'use client'

import { useState } from 'react'
import { Mail, Copy, Check, RefreshCw } from 'lucide-react'

const TOPICS = [
  'Bildung & Schule',
  'Digitalisierung der Verwaltung',
  'Klimaschutz & Energie',
  'Wirtschaft & Bürokratieabbau',
  'Gesundheitsversorgung',
  'Rente & Altersvorsorge',
  'Migration & Integration',
  'Innere Sicherheit',
  'Wohnungsnot & Mieten',
  'Infrastruktur & Verkehr',
]

const TEMPLATES: Record<string, string> = {
  'Bildung & Schule': `Sehr geehrte Damen und Herren,

ich wende mich an Sie als gewählte Vertreter meines Wahlkreises in einer für mich persönlich sehr wichtigen Angelegenheit: dem Zustand unseres Bildungssystems.

Als Bürgerin/Bürger dieses Landes mache ich mir große Sorgen um die Qualität der schulischen Bildung in Deutschland. Veraltete Infrastruktur, Lehrermangel und eine langsam voranschreitende Digitalisierung hinterlassen Spuren – die Kinder von heute werden die Fachkräfte und Bürger von morgen sein.

Ich bitte Sie daher, sich aktiv für folgende Punkte einzusetzen:
– Verlässliche Finanzierung moderner Schulgebäude und digitaler Ausstattung
– Gezielte Maßnahmen gegen den Lehrermangel, z. B. bessere Vergütung und Arbeitsbedingungen
– Einheitliche Bildungsstandards über alle Bundesländer hinweg

Ich vertraue darauf, dass Sie meine Anliegen in Ihrer Arbeit berücksichtigen.

Mit freundlichen Grüßen`,

  'Digitalisierung der Verwaltung': `Sehr geehrte Damen und Herren,

als Bürger/in erlebe ich täglich, wie aufwendig viele Behördengänge in Deutschland noch immer sind. In der digitalen Gesellschaft des 21. Jahrhunderts sollten Verwaltungsleistungen einfach, schnell und online verfügbar sein.

Ich bitte Sie, folgende Punkte voranzutreiben:
– Vollständige Digitalisierung aller zentralen Verwaltungsleistungen bis 2026
– Vereinheitlichung von Bürgerportalen auf Bundes- und Länderebene
– Abbau unnötiger Papierpflichten für Bürgerinnen und Unternehmen

Deutschland kann hier eine Vorreiterrolle übernehmen – wenn der politische Wille vorhanden ist.

Mit freundlichen Grüßen`,

  'default': `Sehr geehrte Damen und Herren,

als engagierte Bürgerin/engagierter Bürger möchte ich mich zu einem Thema äußern, das mir sehr am Herzen liegt.

[Hier Ihr persönliches Anliegen beschreiben]

Ich bitte Sie, sich in Ihrer parlamentarischen Arbeit für dieses Thema einzusetzen und mir mitzuteilen, welche konkreten Schritte Sie planen.

Als gewählte Vertreterin/gewählter Vertreter tragen Sie Verantwortung für uns alle – ich vertraue auf Ihr Engagement.

Mit freundlichen Grüßen`,
}

export default function BriefPage() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [custom, setCustom] = useState('')
  const [copied, setCopied] = useState(false)

  const template = TEMPLATES[topic] ?? TEMPLATES['default']
  const date = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })

  const letter = `${city ? city + ', ' : ''}${date}

An den/die Bundestagsabgeordneten/in
meines Wahlkreises

Betreff: ${topic}

${template}

${name || '[Ihr Name]'}
${city || '[Ihr Wohnort]'}`

  function copy() {
    navigator.clipboard.writeText(letter).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Engagement</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Mail className="h-8 w-8 opacity-80" /> Brief-Generator
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Erstelle in Sekunden einen professionellen Brief an deinen Bundestagsabgeordneten.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 max-w-5xl">
          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="nm-label">Dein Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="nm-input" placeholder="Max Mustermann" />
            </div>
            <div>
              <label className="nm-label">Dein Wohnort</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="nm-input" placeholder="Berlin" />
            </div>
            <div>
              <label className="nm-label">Thema</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TOPICS.map(t => (
                  <button key={t} type="button" onClick={() => setTopic(t)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${topic === t ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="nm-label">Persönliche Ergänzung (optional)</label>
              <textarea value={custom} onChange={e => setCustom(e.target.value)} rows={3} className="nm-input"
                placeholder="Deine persönliche Geschichte oder konkrete Forderung…" />
            </div>

            <div className="bg-nm-gray border border-nm-line rounded-xl p-4">
              <p className="text-xs font-bold text-nm-blue mb-1">So findest du deinen Abgeordneten</p>
              <p className="text-xs text-nm-muted">Auf <strong>bundestag.de/abgeordnete</strong> kannst du nach Wahlkreis oder PLZ suchen und die E-Mail-Adresse deines Abgeordneten finden.</p>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 lg:mt-0">
            <div className="flex items-center justify-between mb-3">
              <label className="nm-label">Briefvorschau</label>
              <div className="flex gap-2">
                <button onClick={() => { setName(''); setCity(''); setCustom('') }}
                  className="flex items-center gap-1 text-xs text-nm-muted hover:text-nm-blue transition-colors">
                  <RefreshCw className="h-3 w-3" /> Zurücksetzen
                </button>
                <button onClick={copy}
                  className="flex items-center gap-1.5 text-xs font-semibold text-nm-blue hover:underline">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Kopiert!' : 'Kopieren'}
                </button>
              </div>
            </div>
            <div className="border border-nm-line rounded-xl p-5 bg-nm-gray/20 font-mono text-xs text-nm-text leading-relaxed whitespace-pre-wrap min-h-[400px]">
              {letter}
              {custom && `\n\nPersönliche Anmerkung:\n${custom}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ALL_PAGES = [
  // Mitmachen
  { title: 'Bürgerfragen', desc: 'Stell deine Fragen an die Politik', href: '/buergerfragen', cat: 'Mitmachen' },
  { title: 'Ideen einreichen', desc: 'Eigene politische Ideen vorschlagen', href: '/ideen', cat: 'Mitmachen' },
  { title: 'Debattier-Forum', desc: 'Pro & Contra zu politischen Themen', href: '/debatte', cat: 'Mitmachen' },
  { title: 'Bürgervoting', desc: 'Abstimme zu aktuellen politischen Fragen', href: '/abstimmungen', cat: 'Mitmachen' },
  { title: 'Wähler-Kompass', desc: 'Finde deine politische Position', href: '/waehler-kompass', cat: 'Tools' },
  { title: 'Wissenstest', desc: 'Teste dein politisches Wissen', href: '/wissenstest', cat: 'Tools' },
  { title: 'Steuerrechner', desc: 'Berechne deine Einkommensteuer 2024', href: '/steuerrechner', cat: 'Tools' },
  { title: 'Brief-Generator', desc: 'Brief an deinen Bundestagsabgeordneten erstellen', href: '/brief', cat: 'Tools' },
  { title: 'KI-Assistent', desc: 'Stell Fragen zur deutschen Politik', href: '/chatbot', cat: 'Tools' },
  { title: 'Zusammenfassungs-Tool', desc: 'Lange Texte zusammenfassen lassen', href: '/zusammenfassung', cat: 'Tools' },
  { title: 'Civic Score', desc: 'Dein persönlicher Engagement-Score', href: '/civic-score', cat: 'Tools' },
  // Wissen
  { title: 'Faktencheck', desc: 'Politische Aussagen auf den Prüfstand', href: '/faktencheck', cat: 'Wissen' },
  { title: 'Politik erklärt', desc: 'Komplexe Themen verständlich erklärt', href: '/erklaert', cat: 'Wissen' },
  { title: 'Politisches Glossar', desc: 'A-Z der politischen Begriffe', href: '/glossar', cat: 'Wissen' },
  { title: 'Gesetz im Fokus', desc: 'Aktuelle Gesetze verständlich erklärt', href: '/gesetz-fokus', cat: 'Wissen' },
  { title: 'Zitate-Galerie', desc: 'Kluge Worte über Demokratie und Freiheit', href: '/zitate', cat: 'Wissen' },
  { title: 'Politischer Zeitstrahl', desc: '75 Jahre Bundesrepublik auf einen Blick', href: '/zeitstrahl', cat: 'Wissen' },
  // Transparenz
  { title: 'Transparenz-Tagebuch', desc: 'Offene Entscheidungen der Neuen Mitte', href: '/transparenz', cat: 'Transparenz' },
  { title: 'Versprechen-Tracker', desc: 'Forderungen und ihr Status', href: '/versprechen', cat: 'Transparenz' },
  { title: 'Offene Daten', desc: 'Politische Datensätze und Statistiken', href: '/offene-daten', cat: 'Transparenz' },
  { title: 'Statistiken', desc: 'Live-Zahlen der Neuen Mitte', href: '/statistiken', cat: 'Transparenz' },
  // Programm
  { title: 'Programm', desc: 'Das vollständige Programm der Neuen Mitte', href: '/programm', cat: 'Programm' },
  { title: 'Wirtschaft', desc: 'Wirtschaftspolitische Positionen', href: '/wirtschaft', cat: 'Programm' },
  { title: 'Bildung', desc: 'Bildungspolitische Positionen', href: '/bildung', cat: 'Programm' },
  { title: 'Energie', desc: 'Energiepolitische Positionen', href: '/energie', cat: 'Programm' },
  { title: 'Migration', desc: 'Migrationspolitische Positionen', href: '/migration', cat: 'Programm' },
  { title: 'Digitalisierung', desc: 'Digitalpolitische Positionen', href: '/digitalisierung', cat: 'Programm' },
  // Community
  { title: 'Mitglieder-Panel', desc: 'Community, Chat und exklusive Inhalte', href: '/mitglieder', cat: 'Community' },
  { title: 'Newsletter', desc: 'Aktuelle Informationen per E-Mail', href: '/#newsletter', cat: 'Community' },
  { title: 'Unterstützen', desc: 'Unterstütze die Neue Mitte', href: '/unterstuetzen', cat: 'Community' },
  { title: 'Veranstaltungen', desc: 'Termine und Events', href: '/veranstaltungen', cat: 'Community' },
  { title: 'Kontakt', desc: 'Nimm Kontakt auf', href: '/kontakt', cat: 'Community' },
]

const CAT_COLORS: Record<string, string> = {
  'Mitmachen': 'bg-blue-100 text-blue-800',
  'Tools': 'bg-purple-100 text-purple-800',
  'Wissen': 'bg-green-100 text-green-800',
  'Transparenz': 'bg-orange-100 text-orange-800',
  'Programm': 'bg-red-100 text-red-800',
  'Community': 'bg-pink-100 text-pink-800',
}

export default function SuchePage() {
  const [query, setQuery] = useState('')

  const results = query.length >= 2
    ? ALL_PAGES.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.desc.toLowerCase().includes(query.toLowerCase()) ||
        p.cat.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const cats = [...new Set(ALL_PAGES.map(p => p.cat))]

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Neue Mitte</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-6">Suche</h1>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Seiten, Tools, Themen suchen…"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      <div className="nm-container py-10">
        {query.length >= 2 ? (
          <div>
            <p className="text-sm text-nm-muted mb-5">{results.length} Ergebnis{results.length !== 1 ? 'se' : ''} für „{query}"</p>
            {results.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-nm-line mx-auto mb-4" />
                <p className="text-nm-muted">Keine Seite gefunden. Versuch einen anderen Begriff.</p>
              </div>
            ) : (
              <div className="space-y-2 max-w-2xl">
                {results.map(page => (
                  <Link key={page.href} href={page.href}
                    className="flex items-center justify-between gap-4 border border-nm-line rounded-xl px-5 py-4 hover:border-nm-blue/40 hover:bg-nm-blue/5 transition-all group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-nm-text text-sm group-hover:text-nm-blue transition-colors">{page.title}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${CAT_COLORS[page.cat] ?? 'bg-nm-gray text-nm-muted'}`}>{page.cat}</span>
                      </div>
                      <p className="text-xs text-nm-muted">{page.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-nm-muted group-hover:text-nm-blue flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-nm-muted mb-6">Alle Seiten der Neuen Mitte:</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cats.map(cat => (
                <div key={cat}>
                  <p className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-wide rounded-full mb-3 ${CAT_COLORS[cat] ?? 'bg-nm-gray text-nm-muted'}`}>{cat}</p>
                  <ul className="space-y-1">
                    {ALL_PAGES.filter(p => p.cat === cat).map(page => (
                      <li key={page.href}>
                        <Link href={page.href} className="text-sm text-nm-muted hover:text-nm-blue transition-colors hover:underline">
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

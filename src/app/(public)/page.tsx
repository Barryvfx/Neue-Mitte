import { prisma } from '@/lib/db'
import HeroSection from '@/components/sections/HeroSection'
import SupporterBanner from '@/components/sections/SupporterBanner'
import PrioritiesSection from '@/components/sections/PrioritiesSection'
import NewsPreviewSection from '@/components/sections/NewsPreviewSection'
import Link from 'next/link'
import NewsletterSection from '@/components/sections/NewsletterSection'
import EventsPreviewSection from '@/components/sections/EventsPreviewSection'
import SupporterTicker from '@/components/sections/SupporterTicker'
import PollWidget from '@/components/sections/PollWidget'
import QuoteShare from '@/components/sections/QuoteShare'
import ProgramQuiz from '@/components/sections/ProgramQuiz'
import CountdownTimer from '@/components/sections/CountdownTimer'
import WahlTicker from '@/components/sections/WahlTicker'
import TageszitatWidget from '@/components/sections/TageszitatWidget'

export const dynamic = 'force-dynamic'

async function getSupporterCount() {
  try { return await prisma.supporter.count({ where: { confirmed: true } }) } catch { return 0 }
}

async function getBanner() {
  try {
    const [active, text] = await Promise.all([
      prisma.contentBlock.findUnique({ where: { key: 'banner_active' } }),
      prisma.contentBlock.findUnique({ where: { key: 'banner_text' } }),
    ])
    if (active?.value === 'true' && text?.value) return text.value
    return null
  } catch { return null }
}

export default async function Home() {
  const [count, banner] = await Promise.all([getSupporterCount(), getBanner()])

  return (
    <>
      {banner && (
        <div className="bg-nm-blue border-b border-white/20">
          <div className="nm-container py-2.5 text-center">
            <p className="text-white text-sm font-medium">{banner}</p>
          </div>
        </div>
      )}

      <WahlTicker />
      <HeroSection />
      <SupporterBanner count={count} />

      {/* Live ticker + countdown */}
      <div className="nm-container py-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <SupporterTicker />
          <CountdownTimer />
        </div>
      </div>

      <TageszitatWidget />
      <PrioritiesSection />
      <NewsPreviewSection />
      <EventsPreviewSection />

      {/* Interactive section: Quiz + Poll + Quote */}
      <section className="nm-section bg-nm-gray border-t border-nm-line">
        <div className="nm-container">
          <div className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-nm-blue mb-2">Mitmachen</p>
            <h2 className="text-2xl sm:text-3xl font-black text-nm-blue tracking-tight">Ihre Meinung zählt</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProgramQuiz />
            <PollWidget />
            <QuoteShare />
          </div>
        </div>
      </section>

      {/* Feature discovery grid */}
      <section className="nm-section bg-white border-t border-nm-line">
        <div className="nm-container">
          <div className="mb-8">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-nm-blue mb-2">Entdecken</p>
            <h2 className="text-2xl sm:text-3xl font-black text-nm-blue tracking-tight">Alles auf einen Blick</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🗳️', title: 'Bürgervoting', desc: 'Stimme zu 10 aktuellen politischen Fragen ab', href: '/abstimmungen' },
              { emoji: '📚', title: 'Politisches Glossar', desc: 'Über 35 Begriffe einfach erklärt', href: '/glossar' },
              { emoji: '🧮', title: 'Steuerrechner', desc: 'Deine Einkommensteuer 2024 berechnen', href: '/steuerrechner' },
              { emoji: '✉️', title: 'Brief-Generator', desc: 'Brief an den Bundestag in 60 Sekunden', href: '/brief' },
              { emoji: '💬', title: 'Zitate-Galerie', desc: '25 inspirierende politische Zitate', href: '/zitate' },
              { emoji: '📅', title: 'Zeitstrahl', desc: '75 Jahre Bundesrepublik Deutschland', href: '/zeitstrahl' },
              { emoji: '📊', title: 'Statistiken', desc: 'Live-Zahlen der Neuen Mitte', href: '/statistiken' },
              { emoji: '👥', title: 'Mitglieder-Panel', desc: 'Community beitreten & chatten', href: '/mitglieder' },
            ].map(f => (
              <Link key={f.href} href={f.href}
                className="border border-nm-line rounded-xl p-4 hover:border-nm-blue/40 hover:bg-nm-blue/5 transition-all group">
                <div className="text-2xl mb-3">{f.emoji}</div>
                <h3 className="font-black text-nm-text text-sm mb-1 group-hover:text-nm-blue transition-colors">{f.title}</h3>
                <p className="text-xs text-nm-muted leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />

      {/* CTA section */}
      <section className="nm-section-sm bg-nm-blue">
        <div className="nm-container text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">
            Gemeinsam für Deutschland
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Deutschland kann mehr.
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
            Unterstützen Sie die Neue Mitte und zeigen Sie: Es gibt eine politische Mitte in Deutschland,
            die pragmatisch, lösungsorientiert und glaubwürdig ist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/unterstuetzen" className="btn-outline-white text-base px-8 py-3.5">
              Jetzt unterstützen
            </Link>
            <Link href="/programm" className="btn-primary bg-white text-nm-blue hover:bg-white/90 text-base px-8 py-3.5">
              Programm lesen
            </Link>
          </div>
        </div>
      </section>

      {/* Legal note */}
      <div className="bg-nm-gray border-t border-nm-line">
        <div className="nm-container py-3">
          <p className="text-center text-[11px] text-nm-muted">
            Die Neue Mitte ist ein privates Projekt zur Entwicklung politischer Ideen und steht in keiner Verbindung zu bestehenden Parteien oder Organisationen.
          </p>
        </div>
      </div>
    </>
  )
}

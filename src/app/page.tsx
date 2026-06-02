import { prisma } from '@/lib/db'
import HeroSection from '@/components/sections/HeroSection'
import SupporterBanner from '@/components/sections/SupporterBanner'
import PrioritiesSection from '@/components/sections/PrioritiesSection'
import NewsPreviewSection from '@/components/sections/NewsPreviewSection'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getSupporterCount() {
  try { return await prisma.supporter.count() } catch { return 0 }
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

      <HeroSection />
      <SupporterBanner count={count} />
      <PrioritiesSection />
      <NewsPreviewSection />

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

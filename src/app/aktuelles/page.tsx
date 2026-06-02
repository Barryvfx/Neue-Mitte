import { prisma } from '@/lib/db'
import NewsCard from '@/components/news/NewsCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aktuelles – Neue Mitte',
  description: 'Neuigkeiten, Stellungnahmen und Meldungen der Neuen Mitte.',
}

export const dynamic = 'force-dynamic'

async function getAllNews() {
  try {
    return await prisma.newsArticle.findMany({
      where: { OR: [{ published: true }, { scheduledAt: { lte: new Date() } }] },
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true },
    })
  } catch {
    return []
  }
}

export default async function AktuellesPage() {
  const articles = await getAllNews()

  return (
    <div className="bg-white">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
            Neue Mitte
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Aktuelles
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Neuigkeiten, Stellungnahmen und Meldungen aus dem Projekt Neue Mitte.
          </p>
        </div>
      </div>

      <div className="nm-container py-16">
        {articles.length === 0 ? (
          <p className="text-nm-muted text-center py-20">
            Noch keine Meldungen veröffentlicht.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a) => (
              <NewsCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                excerpt={a.excerpt}
                publishedAt={a.publishedAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { prisma } from '@/lib/db'
import NewsCard from '@/components/news/NewsCard'

async function getLatestNews() {
  try {
    return await prisma.newsArticle.findMany({
      where: { OR: [{ published: true }, { scheduledAt: { lte: new Date() } }] },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true },
    })
  } catch {
    return []
  }
}

export default async function NewsPreviewSection() {
  const articles = await getLatestNews()

  if (articles.length === 0) return null

  return (
    <section className="nm-section bg-nm-gray border-t border-nm-line">
      <div className="nm-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label">Neuigkeiten</span>
            <h2 className="section-title mb-0">Aktuelles</h2>
          </div>
          <Link href="/aktuelles" className="btn-ghost hidden sm:flex">
            Alle Meldungen →
          </Link>
        </div>

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

        <div className="mt-8 sm:hidden">
          <Link href="/aktuelles" className="btn-outline">
            Alle Meldungen
          </Link>
        </div>
      </div>
    </section>
  )
}

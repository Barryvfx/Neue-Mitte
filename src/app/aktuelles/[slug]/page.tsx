import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string) {
  try {
    return await prisma.newsArticle.findFirst({
      where: { slug, published: true },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Nicht gefunden – Neue Mitte' }
  return {
    title: `${article.title} – Neue Mitte`,
    description: article.excerpt,
  }
}

function formatDate(d: Date | null) {
  if (!d) return ''
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-nm-line bg-nm-gray">
        <div className="nm-container py-3">
          <nav className="breadcrumb">
            <Link href="/">Startseite</Link>
            <span>›</span>
            <Link href="/aktuelles">Aktuelles</Link>
            <span>›</span>
            <span>{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="nm-container py-16">
        <div className="max-w-2xl">
          <time className="news-date text-sm">
            {formatDate(article.publishedAt)}
          </time>
          <h1 className="text-3xl sm:text-4xl font-black text-nm-blue tracking-tight mt-2 mb-6">
            {article.title}
          </h1>
          <p className="text-nm-muted text-lg leading-relaxed font-medium border-l-4 border-nm-blue pl-5 mb-8">
            {article.excerpt}
          </p>
          <div
            className="editorial-content"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') }}
          />

          <div className="mt-12 pt-8 border-t border-nm-line">
            <Link href="/aktuelles" className="btn-ghost">
              ← Alle Meldungen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

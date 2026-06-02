import Link from 'next/link'

interface NewsCardProps {
  title: string
  slug: string
  excerpt: string
  publishedAt: Date | null
  compact?: boolean
}

function formatDate(d: Date | null) {
  if (!d) return ''
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function NewsCard({ title, slug, excerpt, publishedAt, compact }: NewsCardProps) {
  return (
    <article className="news-card group">
      <time className="news-date">{formatDate(publishedAt)}</time>
      <h3 className={`font-bold text-nm-blue group-hover:underline ${compact ? 'text-base mb-2' : 'text-xl mb-3'}`}>
        <Link href={`/aktuelles/${slug}`}>{title}</Link>
      </h3>
      {!compact && (
        <p className="text-nm-muted text-sm leading-relaxed line-clamp-3">{excerpt}</p>
      )}
      <Link
        href={`/aktuelles/${slug}`}
        className="inline-flex items-center gap-1 text-nm-blue text-xs font-semibold mt-3 hover:underline"
      >
        Weiterlesen →
      </Link>
    </article>
  )
}

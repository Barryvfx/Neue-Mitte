import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import NewsAdminTable from '@/components/admin/NewsAdminTable'

export const dynamic = 'force-dynamic'

export default async function AdminNewsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const articles = await prisma.newsArticle.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, slug: true, published: true, publishedAt: true, createdAt: true },
  })

  return (
    <div className="min-h-screen bg-nm-gray">
      <div className="bg-nm-blue text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-white/70 hover:text-white text-sm">
            ← Dashboard
          </Link>
          <span className="text-white/30">|</span>
          <h1 className="font-bold">Meldungen verwalten</h1>
        </div>
        <Link href="/admin/news/new" className="bg-white text-nm-blue text-sm font-bold px-4 py-1.5 hover:bg-white/90 transition-colors">
          + Neue Meldung
        </Link>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        <NewsAdminTable articles={articles} />
      </div>
    </div>
  )
}

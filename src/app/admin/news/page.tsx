import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import NewsAdminTable from '@/components/admin/NewsAdminTable'
import AdminShell from '@/components/admin/AdminShell'

export const dynamic = 'force-dynamic'

export default async function AdminNewsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const articles = await prisma.newsArticle.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, slug: true, published: true, publishedAt: true, createdAt: true },
  })

  return (
    <AdminShell active="news">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Meldungen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Alle Meldungen verwalten</p>
        </div>
        <Link href="/admin/news/new" className="btn-primary">
          + Neue Meldung
        </Link>
      </div>
      <NewsAdminTable articles={articles} />
    </AdminShell>
  )
}

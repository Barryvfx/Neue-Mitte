import { getAdminSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import NewsForm from '@/components/admin/NewsForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminNewsEditPage({ params }: Props) {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const { id } = await params
  const article = await prisma.newsArticle.findUnique({ where: { id } })
  if (!article) notFound()

  return (
    <div className="min-h-screen bg-nm-gray">
      <div className="bg-nm-blue text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/news" className="text-white/70 hover:text-white text-sm">
          ← Meldungen
        </Link>
        <span className="text-white/30">|</span>
        <h1 className="font-bold">Meldung bearbeiten</h1>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white border border-nm-line p-8">
          <NewsForm
            mode="edit"
            initialData={{
              id: article.id,
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              content: article.content,
              published: article.published,
            }}
          />
        </div>
      </div>
    </div>
  )
}

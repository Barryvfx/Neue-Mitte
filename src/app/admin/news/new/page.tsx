import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NewsForm from '@/components/admin/NewsForm'

export default async function AdminNewsNewPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  return (
    <div className="min-h-screen bg-nm-gray">
      <div className="bg-nm-blue text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/news" className="text-white/70 hover:text-white text-sm">
          ← Meldungen
        </Link>
        <span className="text-white/30">|</span>
        <h1 className="font-bold">Neue Meldung erstellen</h1>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white border border-nm-line p-8">
          <NewsForm mode="create" />
        </div>
      </div>
    </div>
  )
}

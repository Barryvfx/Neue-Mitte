import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
import FAQAdminTable from '@/components/admin/FAQAdminTable'

export const dynamic = 'force-dynamic'

export default async function AdminFAQPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <AdminShell active="faq">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">FAQ</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Häufige Fragen verwalten</p>
        </div>
        <Link href="/admin/faq/new" className="btn-primary">
          + Neue Frage
        </Link>
      </div>
      <FAQAdminTable faqs={faqs} />
    </AdminShell>
  )
}

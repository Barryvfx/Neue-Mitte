import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import NewsletterTable from '@/components/admin/NewsletterTable'
import NewsletterCompose from '@/components/admin/NewsletterCompose'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletterPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const serialized = subscribers.map((s) => ({
    id: s.id,
    email: s.email,
    createdAt: s.createdAt.toISOString(),
  }))

  return (
    <AdminShell active="newsletter">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Newsletter</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subscribers.length} {subscribers.length === 1 ? 'Abonnent' : 'Abonnenten'} insgesamt
        </p>
      </div>

      <div className="space-y-6">
        <NewsletterCompose count={subscribers.length} />
        <NewsletterTable subscribers={serialized} />
      </div>
    </AdminShell>
  )
}

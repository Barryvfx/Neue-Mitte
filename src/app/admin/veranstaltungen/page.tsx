import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
import EventsAdminTable from '@/components/admin/EventsAdminTable'

export const dynamic = 'force-dynamic'

export default async function AdminVeranstaltungenPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
  })

  return (
    <AdminShell active="veranstaltungen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Veranstaltungen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Alle Veranstaltungen verwalten</p>
        </div>
        <Link href="/admin/veranstaltungen/new" className="btn-primary">
          + Neue Veranstaltung
        </Link>
      </div>
      <EventsAdminTable events={events} />
    </AdminShell>
  )
}

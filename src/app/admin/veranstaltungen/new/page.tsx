import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import EventForm from '@/components/admin/EventForm'

export default async function AdminVeranstaltungenNewPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  return (
    <AdminShell active="veranstaltungen">
      <div className="mb-8">
        <div className="breadcrumb">
          <a href="/admin/veranstaltungen">Veranstaltungen</a>
          <span>/</span>
          <span className="text-nm-text">Neue Veranstaltung</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Neue Veranstaltung erstellen</h1>
      </div>
      <div className="bg-white border border-nm-line p-8 max-w-2xl">
        <EventForm mode="create" />
      </div>
    </AdminShell>
  )
}

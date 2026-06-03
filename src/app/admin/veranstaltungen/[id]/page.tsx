import { getAdminSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import EventForm from '@/components/admin/EventForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminVeranstaltungenEditPage({ params }: Props) {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) notFound()

  return (
    <AdminShell active="veranstaltungen">
      <div className="mb-8">
        <div className="breadcrumb">
          <a href="/admin/veranstaltungen">Veranstaltungen</a>
          <span>/</span>
          <span className="text-nm-text">Bearbeiten</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Veranstaltung bearbeiten</h1>
      </div>
      <div className="bg-white border border-nm-line p-8 max-w-2xl">
        <EventForm
          mode="edit"
          initialData={{
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date.toISOString(),
            active: event.active,
          }}
        />
      </div>
    </AdminShell>
  )
}

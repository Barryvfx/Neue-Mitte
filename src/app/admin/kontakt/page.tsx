import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import KontaktTable from '@/components/admin/KontaktTable'

export const dynamic = 'force-dynamic'

export default async function AdminKontaktPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      message: true,
      read: true,
      createdAt: true,
    },
  })

  const serialized = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }))

  const unread = serialized.filter((m) => !m.read).length

  return (
    <AdminShell active="kontakt">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Kontakt</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {serialized.length} Nachrichten gesamt
          {unread > 0 && ` · ${unread} ungelesen`}
        </p>
      </div>
      <KontaktTable initialMessages={serialized} />
    </AdminShell>
  )
}

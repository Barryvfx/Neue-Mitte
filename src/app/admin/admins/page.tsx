import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import AdminsClient from './AdminsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAdminsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, createdAt: true },
  })

  const serialized = admins.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }))

  return (
    <AdminShell active="admins">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admins</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {serialized.length} Admin{serialized.length !== 1 ? 's' : ''} registriert
        </p>
      </div>
      <AdminsClient initialAdmins={serialized} currentEmail={session.email} />
    </AdminShell>
  )
}

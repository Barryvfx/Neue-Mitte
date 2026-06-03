import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import FAQForm from '@/components/admin/FAQForm'

export default async function AdminFAQNewPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  return (
    <AdminShell active="faq">
      <div className="mb-8">
        <div className="breadcrumb">
          <a href="/admin/faq">FAQ</a>
          <span>/</span>
          <span className="text-nm-text">Neue Frage</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Neue Frage erstellen</h1>
      </div>
      <div className="bg-white border border-nm-line p-8 max-w-2xl">
        <FAQForm mode="create" />
      </div>
    </AdminShell>
  )
}

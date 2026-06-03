import { getAdminSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import FAQForm from '@/components/admin/FAQForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminFAQEditPage({ params }: Props) {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  const { id } = await params
  const faq = await prisma.fAQ.findUnique({ where: { id } })
  if (!faq) notFound()

  return (
    <AdminShell active="faq">
      <div className="mb-8">
        <div className="breadcrumb">
          <a href="/admin/faq">FAQ</a>
          <span>/</span>
          <span className="text-nm-text">Bearbeiten</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Frage bearbeiten</h1>
      </div>
      <div className="bg-white border border-nm-line p-8 max-w-2xl">
        <FAQForm
          mode="edit"
          initialData={{
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
            active: faq.active,
          }}
        />
      </div>
    </AdminShell>
  )
}

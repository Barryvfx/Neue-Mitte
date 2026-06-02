'use client'

import AdminShell from '@/components/admin/AdminShell'
import SupporterTable from '@/components/admin/SupporterTable'

export default function AdminSupporters() {
  return (
    <AdminShell active="supporters">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Unterstützer</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Alle Unterstützerinnen und Unterstützer der Neuen Mitte
        </p>
      </div>
      <SupporterTable />
    </AdminShell>
  )
}

import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const supporters = await prisma.supporter.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const headers = ['ID', 'Vorname', 'Nachname', 'E-Mail', 'Wohnort', 'Datum']
  const rows = supporters.map((s) => [
    s.id,
    `"${s.firstName.replace(/"/g, '""')}"`,
    `"${s.lastName.replace(/"/g, '""')}"`,
    `"${s.email.replace(/"/g, '""')}"`,
    `"${(s.city ?? '').replace(/"/g, '""')}"`,
    s.createdAt.toISOString(),
  ])

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="unterstuetzer-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}

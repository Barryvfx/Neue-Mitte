import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const escape = (value: string | null | undefined): string => {
    const str = value ?? ''
    return `"${str.replace(/"/g, '""')}"`
  }

  const header = 'ID,Name,Email,Betreff,Nachricht,Gelesen,Datum'
  const rows = messages.map((m) =>
    [
      escape(m.id),
      escape(m.name),
      escape(m.email),
      escape(m.subject),
      escape(m.message),
      escape(m.read ? 'Ja' : 'Nein'),
      escape(m.createdAt.toISOString()),
    ].join(',')
  )

  const csv = [header, ...rows].join('\n')

  const today = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="kontakt-${today}.csv"`,
    },
  })
}

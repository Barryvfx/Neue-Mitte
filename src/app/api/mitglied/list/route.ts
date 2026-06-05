import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const c = await cookies()
    const session = c.get('nm_member_session')?.value
    if (!session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

    const memberId = session.split(':')[0]
    const me = await prisma.mitglied.findUnique({ where: { id: memberId } })
    if (!me) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 401 })

    const members = await prisma.mitglied.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, city: true, bio: true, interests: true, createdAt: true },
    })
    return NextResponse.json(members)
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

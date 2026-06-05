import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const c = await cookies()
    const session = c.get('nm_member_session')?.value
    if (!session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

    const memberId = session.split(':')[0]
    const member = await prisma.mitglied.findUnique({
      where: { id: memberId },
      select: { id: true, name: true, email: true, city: true, bio: true, interests: true, createdAt: true },
    })
    if (!member) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

    return NextResponse.json(member)
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

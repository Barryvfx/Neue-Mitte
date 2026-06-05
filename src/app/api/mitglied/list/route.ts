import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const c = await cookies()
    const session = c.get('nm_member_session')?.value
    if (!session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

    const myId = session.split(':')[0]
    const me = await prisma.mitglied.findUnique({ where: { id: myId } })
    if (!me) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 401 })

    const members = await prisma.mitglied.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, city: true, bio: true, interests: true,
        avatarColor: true, avatarEmoji: true,
        showName: true, showCity: true, showBio: true, createdAt: true,
      },
    })

    // Apply privacy — own profile always visible in full
    const result = members.map(m => ({
      id: m.id,
      name: (m.id === myId || m.showName) ? m.name : 'Anonym',
      city: (m.id === myId || m.showCity) ? m.city : '',
      bio: (m.id === myId || m.showBio) ? m.bio : '',
      interests: m.interests,
      avatarColor: m.avatarColor,
      avatarEmoji: m.avatarEmoji,
      createdAt: m.createdAt,
      isMe: m.id === myId,
    }))

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

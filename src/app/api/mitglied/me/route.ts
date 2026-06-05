import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

async function getMemberId(): Promise<string | null> {
  const c = await cookies()
  const session = c.get('nm_member_session')?.value
  if (!session) return null
  return session.split(':')[0]
}

export async function GET() {
  try {
    const memberId = await getMemberId()
    if (!memberId) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

    const member = await prisma.mitglied.findUnique({
      where: { id: memberId },
      select: {
        id: true, name: true, email: true, city: true, bio: true,
        interests: true, avatarColor: true, avatarEmoji: true,
        showName: true, showCity: true, showBio: true, createdAt: true,
      },
    })
    if (!member) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    return NextResponse.json(member)
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const memberId = await getMemberId()
    if (!memberId) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

    const body = await req.json()
    const { name, city, bio, interests, avatarColor, avatarEmoji, showName, showCity, showBio } = body

    const updated = await prisma.mitglied.update({
      where: { id: memberId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(city !== undefined && { city: city.trim() }),
        ...(bio !== undefined && { bio: bio.trim() }),
        ...(interests !== undefined && {
          interests: Array.isArray(interests) ? interests.join(',') : interests,
        }),
        ...(avatarColor !== undefined && { avatarColor }),
        ...(avatarEmoji !== undefined && { avatarEmoji }),
        ...(showName !== undefined && { showName }),
        ...(showCity !== undefined && { showCity }),
        ...(showBio !== undefined && { showBio }),
      },
      select: {
        id: true, name: true, email: true, city: true, bio: true,
        interests: true, avatarColor: true, avatarEmoji: true,
        showName: true, showCity: true, showBio: true, createdAt: true,
      },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

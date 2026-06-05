import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

async function getMe() {
  const c = await cookies()
  const session = c.get('nm_member_session')?.value
  if (!session) return null
  const id = session.split(':')[0]
  return prisma.mitglied.findUnique({
    where: { id },
    select: { id: true, name: true, avatarColor: true, avatarEmoji: true, showName: true },
  })
}

export async function GET() {
  try {
    const me = await getMe()
    if (!me) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

    const messages = await prisma.mitgliedMessage.findMany({
      orderBy: { createdAt: 'asc' },
      take: 100,
      include: {
        sender: {
          select: { id: true, name: true, avatarColor: true, avatarEmoji: true, showName: true },
        },
      },
    })

    const result = messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      createdAt: msg.createdAt,
      isMe: msg.senderId === me.id,
      sender: {
        id: msg.sender.id,
        name: (msg.sender.id === me.id || msg.sender.showName) ? msg.sender.name : 'Anonym',
        avatarColor: msg.sender.avatarColor,
        avatarEmoji: msg.sender.avatarEmoji,
      },
    }))

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const me = await getMe()
    if (!me) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

    const { text } = await req.json()
    if (!text?.trim() || text.trim().length > 500) {
      return NextResponse.json({ error: 'Nachricht ungültig.' }, { status: 400 })
    }

    const msg = await prisma.mitgliedMessage.create({
      data: { senderId: me.id, text: text.trim() },
      include: {
        sender: { select: { id: true, name: true, avatarColor: true, avatarEmoji: true, showName: true } },
      },
    })

    return NextResponse.json({
      id: msg.id,
      text: msg.text,
      createdAt: msg.createdAt,
      isMe: true,
      sender: {
        id: msg.sender.id,
        name: msg.sender.showName ? msg.sender.name : 'Anonym',
        avatarColor: msg.sender.avatarColor,
        avatarEmoji: msg.sender.avatarEmoji,
      },
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

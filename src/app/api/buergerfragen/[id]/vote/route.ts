import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const voted = cookieStore.get(`bf_vote_${id}`)?.value

  if (voted) {
    return NextResponse.json({ error: 'Bereits abgestimmt.' }, { status: 409 })
  }

  try {
    const item = await prisma.buergerFrage.update({
      where: { id, published: true },
      data: { votes: { increment: 1 } },
    })
    const res = NextResponse.json({ votes: item.votes })
    res.cookies.set(`bf_vote_${id}`, '1', { maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: 'lax', path: '/' })
    return res
  } catch {
    return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })
  }
}

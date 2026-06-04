import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { argId } = await req.json()
    if (!argId) return NextResponse.json({ error: 'argId fehlt' }, { status: 400 })

    const cookieStore = await cookies()
    const cookieKey = `deb_vote_${argId}`
    if (cookieStore.get(cookieKey)?.value) {
      return NextResponse.json({ error: 'Bereits abgestimmt' }, { status: 409 })
    }

    const updated = await prisma.debatteArg.update({
      where: { id: argId },
      data: { votes: { increment: 1 } },
      select: { votes: true },
    })

    const res = NextResponse.json({ votes: updated.votes })
    res.cookies.set(cookieKey, '1', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

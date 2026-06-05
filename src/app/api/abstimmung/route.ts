import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { seedAbstimmungen } from '@/lib/autoseed'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    await seedAbstimmungen()
    const items = await prisma.abstimmung.findMany({
      where: { active: true },
      include: { votes: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items.map(a => ({
      id: a.id,
      question: a.question,
      context: a.context,
      category: a.category,
      ja: a.votes.filter(v => v.position === 'ja').length,
      nein: a.votes.filter(v => v.position === 'nein').length,
      enthaltung: a.votes.filter(v => v.position === 'enthaltung').length,
      total: a.votes.length,
    })))
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { abstimmungId, position } = await req.json()
    if (!['ja', 'nein', 'enthaltung'].includes(position)) {
      return NextResponse.json({ error: 'Ungültige Position' }, { status: 400 })
    }

    const c = await cookies()
    const voted = c.get(`nm_vote_${abstimmungId}`)?.value
    if (voted) return NextResponse.json({ error: 'Bereits abgestimmt' }, { status: 409 })

    await prisma.abstimmungVote.create({ data: { abstimmungId, position } })

    const response = NextResponse.json({ success: true }, { status: 201 })
    response.cookies.set(`nm_vote_${abstimmungId}`, '1', {
      httpOnly: true, maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

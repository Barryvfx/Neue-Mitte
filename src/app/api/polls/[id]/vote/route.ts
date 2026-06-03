import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { headers, cookies } from 'next/headers'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: pollId } = await params
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed } = rateLimit(`poll:${ip}`, 5, 3600_000)
  if (!allowed) return NextResponse.json({ error: 'Bereits abgestimmt.' }, { status: 429 })

  // Cookie-based double-vote prevention
  const cookieStore = await cookies()
  if (cookieStore.get(`voted_${pollId}`)?.value) {
    return NextResponse.json({ error: 'Sie haben bereits abgestimmt.' }, { status: 409 })
  }

  let body: { optionId?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 }) }
  if (!body.optionId) return NextResponse.json({ error: 'Option fehlt.' }, { status: 422 })

  const option = await prisma.pollOption.findFirst({ where: { id: body.optionId, pollId } })
  if (!option) return NextResponse.json({ error: 'Option nicht gefunden.' }, { status: 404 })

  await prisma.pollOption.update({ where: { id: option.id }, data: { votes: { increment: 1 } } })

  const updatedOptions = await prisma.pollOption.findMany({
    where: { pollId },
    orderBy: { id: 'asc' },
  })
  const total = updatedOptions.reduce((s, o) => s + o.votes, 0)

  const res = NextResponse.json({ options: updatedOptions, total })
  res.cookies.set(`voted_${pollId}`, '1', { maxAge: 60 * 60 * 24 * 30, path: '/', httpOnly: true, sameSite: 'lax' })
  return res
}

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (id) {
      const q = await prisma.wissenstest.findUnique({
        where: { id },
        select: { id: true, question: true, optionA: true, optionB: true, optionC: true, optionD: true, category: true },
      })
      if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(q)
    }
    const count = await prisma.wissenstest.count({ where: { active: true } })
    if (count === 0) return NextResponse.json({ error: 'No questions available' }, { status: 404 })
    const skip = Math.floor(Math.random() * count)
    const q = await prisma.wissenstest.findFirst({
      where: { active: true },
      skip,
      select: { id: true, question: true, optionA: true, optionB: true, optionC: true, optionD: true, category: true },
    })
    return NextResponse.json(q)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { questionId, answer } = await req.json()
    if (!questionId || !answer) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const cookieKey = `wt_answered_${questionId}`
    const alreadyAnswered = cookieStore.get(cookieKey)?.value

    const q = await prisma.wissenstest.findUnique({ where: { id: questionId } })
    if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const correct = answer === q.correct

    const res = NextResponse.json({
      correct,
      correctAnswer: q.correct,
      stats: { A: 0, B: 0, C: 0, D: 0 },
    })

    if (!alreadyAnswered) {
      res.cookies.set(cookieKey, answer, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
      })
    }

    return res
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

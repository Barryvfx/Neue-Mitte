import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { seedWissenstest } from '@/lib/autoseed'

const LETTER_TO_IDX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }
const COUNT_FIELDS = ['countA', 'countB', 'countC', 'countD'] as const

export async function GET(req: NextRequest) {
  try {
    await seedWissenstest()
    const id = req.nextUrl.searchParams.get('id')
    if (id) {
      const q = await prisma.wissenstest.findUnique({ where: { id } })
      if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ id: q.id, text: q.question, options: [q.optionA, q.optionB, q.optionC, q.optionD], category: q.category })
    }
    const count = await prisma.wissenstest.count({ where: { active: true } })
    if (count === 0) return NextResponse.json({ error: 'No questions available' }, { status: 404 })
    const skip = Math.floor(Math.random() * count)
    const q = await prisma.wissenstest.findFirst({ where: { active: true }, skip })
    if (!q) return NextResponse.json({ error: 'No questions available' }, { status: 404 })
    return NextResponse.json({ id: q.id, text: q.question, options: [q.optionA, q.optionB, q.optionC, q.optionD], category: q.category })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { questionId, answer } = await req.json()
    if (!questionId || answer === undefined) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const q = await prisma.wissenstest.findUnique({ where: { id: questionId } })
    if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const options = [q.optionA, q.optionB, q.optionC, q.optionD]
    const correctText = options[LETTER_TO_IDX[q.correct] ?? 0]
    const correct = answer === correctText

    const cookieStore = await cookies()
    const cookieKey = `wt_answered_${questionId}`
    const alreadyAnswered = cookieStore.get(cookieKey)?.value

    // Count this answer once per visitor (cookie dedup)
    let counts = { countA: q.countA, countB: q.countB, countC: q.countC, countD: q.countD }
    const chosenIdx = options.indexOf(answer)
    if (!alreadyAnswered && chosenIdx >= 0) {
      const field = COUNT_FIELDS[chosenIdx]
      const updated = await prisma.wissenstest.update({
        where: { id: questionId },
        data: { [field]: { increment: 1 } },
      })
      counts = { countA: updated.countA, countB: updated.countB, countC: updated.countC, countD: updated.countD }
    }

    const stats: Record<string, number> = {
      [q.optionA]: counts.countA,
      [q.optionB]: counts.countB,
      [q.optionC]: counts.countC,
      [q.optionD]: counts.countD,
    }

    const res = NextResponse.json({ correct, correctAnswer: correctText, stats })
    if (!alreadyAnswered) {
      res.cookies.set(cookieKey, String(answer), { httpOnly: true, maxAge: 60 * 60 * 24, path: '/', sameSite: 'lax' })
    }
    return res
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

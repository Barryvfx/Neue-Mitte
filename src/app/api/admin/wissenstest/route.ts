import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

async function isAdmin() {
  const c = await cookies()
  return c.get('nm_admin')?.value === process.env.ADMIN_SECRET
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const questions = await prisma.wissenstest.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(questions)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { question, optionA, optionB, optionC, optionD, correct, category } = await req.json()
    if (!question || !optionA || !optionB || !optionC || !optionD || !correct) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }
    const q = await prisma.wissenstest.create({
      data: { question, optionA, optionB, optionC, optionD, correct, category: category ?? 'Allgemein' },
    })
    return NextResponse.json(q, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

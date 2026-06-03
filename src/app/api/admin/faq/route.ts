import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(faqs)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const body = await req.json()
  const { question, answer, order, active } = body

  if (!question || !answer) {
    return NextResponse.json(
      { error: 'Frage und Antwort sind erforderlich.' },
      { status: 400 }
    )
  }

  const faq = await prisma.fAQ.create({
    data: {
      question,
      answer,
      order: order ?? 0,
      active: active ?? true,
    },
  })

  return NextResponse.json(faq, { status: 201 })
}

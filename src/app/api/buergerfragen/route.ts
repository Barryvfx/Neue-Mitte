import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  question: z.string().min(10).max(500),
  authorName: z.string().min(2).max(80),
})

export async function GET() {
  try {
    const items = await prisma.buergerFrage.findMany({
      where: { published: true },
      orderBy: [{ votes: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0]?.message ?? 'Validierungsfehler.' }, { status: 422 })
  }
  try {
    const item = await prisma.buergerFrage.create({
      data: { question: result.data.question.trim(), authorName: result.data.authorName.trim() },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}

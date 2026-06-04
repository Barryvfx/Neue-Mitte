import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(5).max(150),
  description: z.string().min(10).max(1000),
  authorName: z.string().max(80).optional(),
})

export async function GET() {
  try {
    const items = await prisma.idee.findMany({
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
    const item = await prisma.idee.create({
      data: {
        title: result.data.title.trim(),
        description: result.data.description.trim(),
        authorName: result.data.authorName?.trim() ?? null,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}

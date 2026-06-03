import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  city: z.string().max(100).optional(),
})

export async function GET() {
  try {
    const [count, goal] = await Promise.all([
      prisma.petitionSignature.count(),
      prisma.contentBlock.findUnique({ where: { key: 'petition_goal' } }),
    ])
    return NextResponse.json({ count, goal: parseInt(goal?.value ?? '10000') })
  } catch {
    return NextResponse.json({ count: 0, goal: 10000 })
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

  const { name, email, city } = result.data

  try {
    await prisma.petitionSignature.create({ data: { name, email, city: city ?? null } })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Diese E-Mail-Adresse hat bereits unterzeichnet.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}

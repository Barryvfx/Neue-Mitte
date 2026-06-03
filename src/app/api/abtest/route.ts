import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { variant, action } = await req.json()
    if (!['A', 'B'].includes(variant)) return NextResponse.json({ ok: false })
    await prisma.abTestClick.create({ data: { variant, action: action ?? 'cta_click' } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}

export async function GET() {
  try {
    const [a, b] = await Promise.all([
      prisma.abTestClick.count({ where: { variant: 'A' } }),
      prisma.abTestClick.count({ where: { variant: 'B' } }),
    ])
    return NextResponse.json({ A: a, B: b })
  } catch {
    return NextResponse.json({ A: 0, B: 0 })
  }
}

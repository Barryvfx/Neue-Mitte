import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (id) {
      const debatte = await prisma.debatte.findUnique({
        where: { id },
        include: {
          argumente: { orderBy: { votes: 'desc' } },
        },
      })
      if (!debatte) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(debatte)
    }
    const debatten = await prisma.debatte.findMany({
      where: { status: { not: 'archiv' } },
      include: {
        argumente: { orderBy: { votes: 'desc' } },
      },
    })
    return NextResponse.json(debatten)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { debatteId, text, seite } = await req.json()
    if (!debatteId || !text || !seite) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }
    if (!['pro', 'contra'].includes(seite)) {
      return NextResponse.json({ error: 'seite muss pro oder contra sein' }, { status: 400 })
    }
    const arg = await prisma.debatteArg.create({
      data: { debatteId, text, seite },
    })
    return NextResponse.json(arg, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id } = await params

  const faq = await prisma.fAQ.findUnique({ where: { id } })
  if (!faq) {
    return NextResponse.json({ error: 'FAQ nicht gefunden.' }, { status: 404 })
  }

  return NextResponse.json(faq)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { question, answer, order, active } = body

  try {
    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    })
    return NextResponse.json(faq)
  } catch {
    return NextResponse.json({ error: 'FAQ nicht gefunden.' }, { status: 404 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.fAQ.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'FAQ nicht gefunden.' }, { status: 404 })
  }
}

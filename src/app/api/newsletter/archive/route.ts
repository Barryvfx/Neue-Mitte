import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const items = await prisma.newsletterSent.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, subject: true, previewText: true, recipientCount: true, createdAt: true },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}

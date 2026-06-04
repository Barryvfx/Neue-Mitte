import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { seedVersprechen } from '@/lib/autoseed'

export async function GET() {
  try {
    await seedVersprechen()
    const items = await prisma.versprechen.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}

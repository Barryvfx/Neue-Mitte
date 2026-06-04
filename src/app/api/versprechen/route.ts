import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const items = await prisma.versprechen.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}

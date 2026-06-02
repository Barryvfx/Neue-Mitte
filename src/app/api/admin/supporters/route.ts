import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const search = searchParams.get('q') ?? ''
  const sort = searchParams.get('sort') ?? 'createdAt'
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'

  const validSort = ['firstName', 'lastName', 'email', 'city', 'createdAt']
  const sortField = validSort.includes(sort) ? sort : 'createdAt'

  const where = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { city: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [supporters, total] = await Promise.all([
    prisma.supporter.findMany({
      where,
      orderBy: { [sortField]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.supporter.count({ where }),
  ])

  return NextResponse.json({
    supporters,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

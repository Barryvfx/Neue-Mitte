import { redirect } from 'next/navigation'

export default async function BestaetigenPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  if (!token) redirect('/?confirm=invalid')
  redirect(`/api/confirm?token=${token}`)
}

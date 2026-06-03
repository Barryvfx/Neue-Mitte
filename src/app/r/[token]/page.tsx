import { redirect } from 'next/navigation'

export default async function ReferralRedirect({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  redirect(`/api/referral/${token}`)
}

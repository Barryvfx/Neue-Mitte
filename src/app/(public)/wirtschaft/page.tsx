import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wirtschaft & Wettbewerb – Neue Mitte',
  description: 'Für eine Wirtschaft, die Menschen und Unternehmen gleichermaßen trägt.',
}

export default function WirtschaftPage() {
  const area = getProgramArea('wirtschaft')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

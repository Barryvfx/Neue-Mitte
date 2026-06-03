import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Innere Sicherheit – Neue Mitte',
  description: 'Ein Staat, der seine Bürger schützt und Recht durchsetzt.',
}

export default function SicherheitPage() {
  const area = getProgramArea('sicherheit')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wohnen & Stadtentwicklung – Neue Mitte',
  description: 'Mehr Wohnraum, faire Mieten, Eigentum für die Mittelschicht.',
}

export default function WohnenPage() {
  const area = getProgramArea('wohnen')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

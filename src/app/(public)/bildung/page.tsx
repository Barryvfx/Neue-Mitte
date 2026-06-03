import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bildung & Chancen – Neue Mitte',
  description: 'Gleiche Chancen, praxisnahe Inhalte, einheitliche Standards.',
}

export default function BildungPage() {
  const area = getProgramArea('bildung')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

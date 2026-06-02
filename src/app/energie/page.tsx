import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Energie & Klima – Neue Mitte',
  description: 'Klimaschutz mit Vernunft, Technologie und Versorgungssicherheit.',
}

export default function EnergiePage() {
  const area = getProgramArea('energie')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

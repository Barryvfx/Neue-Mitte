import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gesundheit & Pflege – Neue Mitte',
  description: 'Ein Gesundheitssystem, das für alle funktioniert.',
}

export default function GesundheitPage() {
  const area = getProgramArea('gesundheit')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

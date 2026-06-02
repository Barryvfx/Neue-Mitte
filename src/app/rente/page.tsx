import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rente & Altersvorsorge – Neue Mitte',
  description: 'Verlässliche Altersvorsorge ohne Generationenkonflikt.',
}

export default function RentePage() {
  const area = getProgramArea('rente')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

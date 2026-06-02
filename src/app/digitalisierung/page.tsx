import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digitalisierung & Verwaltung – Neue Mitte',
  description: 'Ein Staat, der das 21. Jahrhundert erreicht hat.',
}

export default function DigitalisierungPage() {
  const area = getProgramArea('digitalisierung')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

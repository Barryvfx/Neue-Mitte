import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Steuerpolitik – Neue Mitte',
  description: 'Einfache Steuern, gerechte Lasten, transparente Ausgaben.',
}

export default function SteuernPage() {
  const area = getProgramArea('steuern')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

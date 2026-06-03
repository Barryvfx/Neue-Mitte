import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Migration & Integration – Neue Mitte',
  description: 'Klare Regeln, faire Verfahren, konsequente Integration.',
}

export default function MigrationPage() {
  const area = getProgramArea('migration')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

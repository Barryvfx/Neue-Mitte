import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Europa & Außenpolitik – Neue Mitte',
  description: 'Ein starkes Europa aus starken Staaten.',
}

export default function EuropaPage() {
  const area = getProgramArea('europa')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

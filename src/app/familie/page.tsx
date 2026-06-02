import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Familie & Gesellschaft – Neue Mitte',
  description: 'Familien stärken, Kindern Chancen geben.',
}

export default function FamiliePage() {
  const area = getProgramArea('familie')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

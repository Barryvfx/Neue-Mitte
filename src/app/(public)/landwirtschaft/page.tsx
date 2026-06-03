import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Landwirtschaft & Ernährung – Neue Mitte',
  description: 'Heimische Landwirtschaft stärken, Bürokratie abbauen.',
}

export default function LandwirtschaftPage() {
  const area = getProgramArea('landwirtschaft')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

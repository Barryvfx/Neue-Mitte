import { getProgramArea } from '@/lib/programData'
import ProgramLayout from '@/components/program/ProgramLayout'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Außen- & Sicherheitspolitik – Neue Mitte',
  description: 'Deutschland trägt internationale Verantwortung – und muss dafür gerüstet sein.',
}

export default function AussenpolitikPage() {
  const area = getProgramArea('aussenpolitik')
  if (!area) notFound()
  return <ProgramLayout area={area} />
}

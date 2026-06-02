import { prisma } from '@/lib/db'
import Hero from '@/components/sections/Hero'
import Mission from '@/components/sections/Mission'
import Programm from '@/components/sections/Programm'
import Themen from '@/components/sections/Themen'
import Goals from '@/components/sections/Goals'
import Unterstuetzen from '@/components/sections/Unterstuetzen'
import Kontakt from '@/components/sections/Kontakt'

export const revalidate = 60

async function getSupporterCount(): Promise<number> {
  try {
    return await prisma.supporter.count()
  } catch {
    return 0
  }
}

export default async function Home() {
  const supporterCount = await getSupporterCount()

  return (
    <>
      <Hero supporterCount={supporterCount} />
      <Mission />
      <Programm />
      <Themen />
      <Goals count={supporterCount} />
      <Unterstuetzen count={supporterCount} />
      <Kontakt />

      {/* Legal notice */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 max-w-3xl mx-auto px-4">
          Die Neue Mitte ist ein privates Projekt zur Entwicklung politischer Ideen
          und steht in keiner Verbindung zu bestehenden Parteien oder Organisationen.
        </p>
      </div>
    </>
  )
}

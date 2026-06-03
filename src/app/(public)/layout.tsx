import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getMaintenanceMode(): Promise<boolean> {
  try {
    const block = await prisma.contentBlock.findUnique({ where: { key: 'maintenance_mode' } })
    return block?.value === 'true'
  } catch { return false }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const maintenanceMode = await getMaintenanceMode()

  if (maintenanceMode) {
    return (
      <>
        <Navbar />
        <main>
          <div className="min-h-[70vh] flex items-center justify-center bg-nm-gray">
            <div className="nm-container py-20 text-center">
              <div className="w-16 h-16 bg-nm-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-black text-xl">NM</span>
              </div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-nm-muted mb-3">
                Wartungsmodus
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-nm-blue mb-4 tracking-tight">
                Wir sind gleich zurück.
              </h1>
              <p className="text-nm-muted max-w-md mx-auto leading-relaxed">
                Die Website wird gerade aktualisiert. Bitte besuchen Sie uns in Kürze wieder.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MaintenancePage from '@/components/sections/MaintenancePage'
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
        <main><MaintenancePage /></main>
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

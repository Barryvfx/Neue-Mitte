import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcryptjs.hash('NeueMitte2025!', 12)

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@neue-mitte.org' },
    update: {},
    create: {
      email: 'admin@neue-mitte.org',
      password: hashedPassword,
    },
  })

  console.log('✅ Admin-Benutzer erstellt:')
  console.log(`   E-Mail:   ${admin.email}`)
  console.log('   Passwort: NeueMitte2025!')
  console.log('   ⚠️  Passwort nach erstem Login ändern!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

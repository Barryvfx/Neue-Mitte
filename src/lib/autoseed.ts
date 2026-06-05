// Self-seeding: when a content table is empty, fill it from the built-in pools.
// Each seeder runs at most once per process (lock) and only inserts when empty,
// so admin-created content is never overwritten or duplicated.

import { prisma } from '@/lib/db'
import {
  WISSENSTEST_POOL, FAKTENCHECK_POOL, VERSPRECHEN_POOL, BILDUNG_POOL,
  GESETZ_POOL, TRANSPARENZ_POOL, DEBATTE_POOL, GLOSSAR_POOL, ZITAT_POOL, ABSTIMMUNG_POOL,
} from '@/lib/seed-content'

const locks: Record<string, Promise<void> | undefined> = {}

function once(key: string, fn: () => Promise<void>): Promise<void> {
  if (!locks[key]) {
    locks[key] = fn().catch(() => { /* ignore seed errors, will retry next boot */ })
  }
  return locks[key]!
}

export function seedWissenstest() {
  return once('wissenstest', async () => {
    const count = await prisma.wissenstest.count()
    if (count > 0) return
    for (const q of WISSENSTEST_POOL) {
      await prisma.wissenstest.create({ data: q })
    }
  })
}

export function seedFaktencheck() {
  return once('faktencheck', async () => {
    const count = await prisma.faktencheck.count()
    if (count > 0) return
    for (const f of FAKTENCHECK_POOL) {
      await prisma.faktencheck.create({ data: f })
    }
  })
}

export function seedVersprechen() {
  return once('versprechen', async () => {
    const count = await prisma.versprechen.count()
    if (count > 0) return
    for (const v of VERSPRECHEN_POOL) {
      await prisma.versprechen.create({ data: v })
    }
  })
}

export function seedBildung() {
  return once('bildung', async () => {
    const count = await prisma.bildungArtikel.count()
    if (count > 0) return
    for (const a of BILDUNG_POOL) {
      await prisma.bildungArtikel.create({ data: a })
    }
  })
}

export function seedGesetz() {
  return once('gesetz', async () => {
    const count = await prisma.gesetzFokus.count()
    if (count > 0) return
    for (const g of GESETZ_POOL) {
      await prisma.gesetzFokus.create({ data: g })
    }
  })
}

export function seedTransparenz() {
  return once('transparenz', async () => {
    const count = await prisma.transparenzEintrag.count()
    if (count > 0) return
    for (const t of TRANSPARENZ_POOL) {
      await prisma.transparenzEintrag.create({ data: t })
    }
  })
}

export function seedDebatte() {
  return once('debatte', async () => {
    const count = await prisma.debatte.count()
    if (count > 0) return
    for (const d of DEBATTE_POOL) {
      await prisma.debatte.create({
        data: {
          title: d.title,
          topic: d.topic,
          argumente: { create: d.args.map(a => ({ text: a.text, seite: a.seite })) },
        },
      })
    }
  })
}

export function seedGlossar() {
  return once('glossar', async () => {
    const count = await prisma.glossarEintrag.count()
    if (count > 0) return
    for (const g of GLOSSAR_POOL) {
      await prisma.glossarEintrag.create({ data: g })
    }
  })
}

export function seedZitate() {
  return once('zitate', async () => {
    const count = await prisma.zitat.count()
    if (count > 0) return
    for (const z of ZITAT_POOL) {
      await prisma.zitat.create({ data: z })
    }
  })
}

export function seedAbstimmungen() {
  return once('abstimmungen', async () => {
    const count = await prisma.abstimmung.count()
    if (count > 0) return
    for (const a of ABSTIMMUNG_POOL) {
      await prisma.abstimmung.create({ data: a })
    }
  })
}

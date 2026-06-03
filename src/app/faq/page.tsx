import { prisma } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ – Neue Mitte',
  description: 'Häufig gestellte Fragen zur Neuen Mitte.',
}

export const dynamic = 'force-dynamic'

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })

  return (
    <div className="bg-white">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
            Neue Mitte
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Häufige Fragen
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Antworten auf die häufigsten Fragen rund um die Neue Mitte.
          </p>
        </div>
      </div>

      <div className="nm-container py-16">
        {faqs.length === 0 ? (
          <p className="text-nm-muted text-center py-20">Noch keine FAQ vorhanden.</p>
        ) : (
          <div className="max-w-3xl mx-auto divide-y divide-nm-line">
            {faqs.map((faq) => (
              <details key={faq.id} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="font-semibold text-nm-blue text-base leading-snug">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 text-nm-muted group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-nm-muted leading-relaxed text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

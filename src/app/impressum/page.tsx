import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false },
}

export default function Impressum() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-nm-blue dark:text-nm-sky hover:underline mb-4 inline-flex items-center gap-1"
          >
            ← Zurück zur Startseite
          </Link>
          <div className="german-bar mb-4 mt-4">
            <span /><span /><span />
          </div>
          <h1 className="text-4xl font-black text-nm-blue dark:text-white">Impressum</h1>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <div className="card-base p-6">
              <p className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Nico Waitkus</p>
              <p className="text-gray-600 dark:text-gray-400">Pestalozzistr. 17</p>
              <p className="text-gray-600 dark:text-gray-400">34260 Kaufungen</p>
              <p className="text-gray-600 dark:text-gray-400">Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Kontakt</h2>
            <div className="card-base p-6 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Telefon:</span>{' '}
                <a href="tel:+4915252990491" className="text-nm-blue dark:text-nm-sky hover:underline">
                  +49 152 52990491
                </a>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">E-Mail:</span>{' '}
                <a href="mailto:info@neue-mitte.org" className="text-nm-blue dark:text-nm-sky hover:underline">
                  info@neue-mitte.org
                </a>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Website:</span>{' '}
                <span className="text-nm-blue dark:text-nm-sky">www.neue-mitte.org</span>
              </p>
            </div>
          </section>

          <section className="p-5 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 rounded-2xl">
            <h2 className="text-base font-bold text-yellow-800 dark:text-yellow-300 mb-2">
              Wichtiger Hinweis
            </h2>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-relaxed">
              Die Neue Mitte ist ein privates Projekt zur Entwicklung politischer Ideen und
              steht in keiner Verbindung zu bestehenden Parteien oder Organisationen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)
            </h2>
            <div className="card-base p-6">
              <p className="text-gray-700 dark:text-gray-300">Nico Waitkus</p>
              <p className="text-gray-600 dark:text-gray-400">Pestalozzistr. 17, 34260 Kaufungen</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Haftungsausschluss
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Haftung für Inhalte</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Die Inhalte dieser Webseite wurden mit größtmöglicher Sorgfalt erstellt. Für die
                  Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr
                  übernommen werden. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
                  Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Haftung für Links</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
                  keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
                  Gewähr übernehmen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Urheberrecht</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                  unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                  Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
                  bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

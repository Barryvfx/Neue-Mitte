import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  robots: { index: false },
}

export default function Datenschutz() {
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
          <h1 className="text-4xl font-black text-nm-blue dark:text-white">Datenschutzerklärung</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Stand: Juni 2025</p>
        </div>

        <div className="space-y-8">
          <section className="p-5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Diese
              Datenschutzerklärung informiert Sie über die Art, den Umfang und den Zweck der
              Verarbeitung personenbezogener Daten auf dieser Website.
            </p>
          </section>

          {[
            {
              title: '1. Verantwortlicher',
              content: (
                <div className="card-base p-5 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">Nico Waitkus</p>
                  <p>Pestalozzistr. 17, 34260 Kaufungen</p>
                  <p>E-Mail: <a href="mailto:info@neue-mitte.org" className="text-nm-blue dark:text-nm-sky hover:underline">info@neue-mitte.org</a></p>
                  <p>Tel.: <a href="tel:+4915252990491" className="text-nm-blue dark:text-nm-sky hover:underline">+49 152 52990491</a></p>
                </div>
              ),
            },
            {
              title: '2. Erhobene Daten und Zweck der Verarbeitung',
              content: (
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">a) Unterstützer-Formular</h3>
                    <p className="leading-relaxed">
                      Wenn Sie das Unterstützer-Formular ausfüllen, erheben wir folgende Daten:
                      Vorname, Nachname, E-Mail-Adresse, Wohnort und das Datum der Eintragung.
                    </p>
                    <p className="mt-2 leading-relaxed">
                      <strong className="text-gray-800 dark:text-gray-200">Zweck:</strong> Erfassung
                      von Unterstützerinnen und Unterstützern der Neuen Mitte.{' '}
                      <strong className="text-gray-800 dark:text-gray-200">Rechtsgrundlage:</strong>{' '}
                      Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">b) Kontaktformular</h3>
                    <p className="leading-relaxed">
                      Bei Nutzung des Kontaktformulars erheben wir: Name, E-Mail-Adresse und
                      Nachrichtentext. Diese Daten werden ausschließlich zur Bearbeitung Ihrer
                      Anfrage verwendet.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">c) Server-Logs</h3>
                    <p className="leading-relaxed">
                      Beim Besuch der Website werden automatisch technische Daten übertragen
                      (IP-Adresse, Browsertyp, Datum/Uhrzeit). Diese werden für maximal 7 Tage
                      gespeichert und dienen ausschließlich der Sicherheit.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              title: '3. Datenweitergabe',
              content: (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Ihre Daten werden nicht an Dritte weitergegeben, verkauft oder vermietet.
                  Eine Übermittlung an Behörden erfolgt nur auf gesetzliche Grundlage.
                  Datenbankserver befinden sich in Deutschland.
                </p>
              ),
            },
            {
              title: '4. Datenspeicherung und Löschung',
              content: (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Unterstützerdaten werden so lange gespeichert, wie das Projekt besteht oder
                  Sie Ihre Einwilligung widerrufen. Kontaktanfragen werden nach 6 Monaten gelöscht.
                  Sie können jederzeit die Löschung Ihrer Daten per E-Mail an{' '}
                  <a href="mailto:info@neue-mitte.org" className="text-nm-blue dark:text-nm-sky hover:underline">
                    info@neue-mitte.org
                  </a>{' '}
                  beantragen.
                </p>
              ),
            },
            {
              title: '5. Ihre Rechte (DSGVO)',
              content: (
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {[
                    ['Auskunft (Art. 15)', 'Welche Daten wir über Sie gespeichert haben'],
                    ['Berichtigung (Art. 16)', 'Korrektur unrichtiger Daten'],
                    ['Löschung (Art. 17)', 'Löschen Ihrer gespeicherten Daten'],
                    ['Einschränkung (Art. 18)', 'Einschränkung der Verarbeitung'],
                    ['Widerspruch (Art. 21)', 'Widerspruch gegen die Verarbeitung'],
                    ['Datenübertragbarkeit (Art. 20)', 'Übertragung Ihrer Daten'],
                  ].map(([right, desc]) => (
                    <div key={right} className="flex gap-2">
                      <span className="text-nm-sky mt-0.5 flex-shrink-0">→</span>
                      <span><strong className="text-gray-800 dark:text-gray-200">{right}:</strong> {desc}</span>
                    </div>
                  ))}
                  <p className="mt-3 leading-relaxed">
                    Zur Ausübung Ihrer Rechte wenden Sie sich an:{' '}
                    <a href="mailto:info@neue-mitte.org" className="text-nm-blue dark:text-nm-sky hover:underline">
                      info@neue-mitte.org
                    </a>
                  </p>
                  <p className="mt-2">
                    Sie haben das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde
                    zu beschweren (Art. 77 DSGVO).
                  </p>
                </div>
              ),
            },
            {
              title: '6. Cookies und technische Speicherung',
              content: (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Diese Website verwendet lediglich technisch notwendige Cookies für die
                  Authentifizierung im Admin-Bereich (httpOnly, SameSite=Lax). Tracking-Cookies
                  oder Analyse-Tools werden nicht eingesetzt. Die Theme-Präferenz (Hell/Dunkel)
                  wird im localStorage des Browsers gespeichert, nicht auf unseren Servern.
                </p>
              ),
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
              {content}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

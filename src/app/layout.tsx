import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/providers/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Neue Mitte',
    default: 'Neue Mitte – Politik, die funktioniert.',
  },
  description:
    'Deutschland braucht keinen größeren oder kleineren Staat. Deutschland braucht einen Staat, der funktioniert. Die Neue Mitte steht für pragmatische Politik, weniger Bürokratie und eine starke Zukunft.',
  keywords: [
    'Neue Mitte',
    'Politik',
    'Deutschland',
    'Bürokratieabbau',
    'Digitalisierung',
    'Bildung',
    'Wirtschaft',
    'pragmatisch',
  ],
  authors: [{ name: 'Neue Mitte' }],
  openGraph: {
    title: 'Neue Mitte – Politik, die funktioniert.',
    description:
      'Deutschland braucht einen Staat, der funktioniert. Für Pragmatismus, Transparenz und Verantwortung.',
    url: 'https://neue-mitte.org',
    siteName: 'Neue Mitte',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neue Mitte – Politik, die funktioniert.',
    description: 'Deutschland braucht einen Staat, der funktioniert.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://neue-mitte.org'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('nm-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

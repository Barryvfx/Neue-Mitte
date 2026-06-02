'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Anmeldung fehlgeschlagen.')
        setStatus('error')
        return
      }
      router.push('/admin/dashboard')
    } catch {
      setError('Verbindungsfehler.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-nm-blue dark:bg-nm-sky rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">NM</span>
          </div>
          <span className="font-black text-sm text-nm-blue dark:text-white tracking-wider">NEUE MITTE</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-nm-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-black text-lg">NM</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin-Login</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Neue Mitte Verwaltung</p>
          </div>

          <div className="card-base p-8">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label className="form-label" htmlFor="email">E-Mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@neue-mitte.org"
                  className="form-input"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="form-label" htmlFor="password">Passwort</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  autoComplete="current-password"
                  required
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl mb-4">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={status === 'loading'}
                className="w-full"
              >
                Anmelden
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

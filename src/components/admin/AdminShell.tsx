'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Newspaper, Mail, FileText, Shield, Settings, LogOut,
} from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { label: 'Dashboard',    href: '/admin/dashboard',  icon: LayoutDashboard, key: 'dashboard' },
  { label: 'Unterstützer', href: '/admin/supporters', icon: Users,            key: 'supporters' },
  { label: 'Meldungen',    href: '/admin/news',       icon: Newspaper,        key: 'news' },
  { label: 'Kontakt',      href: '/admin/kontakt',    icon: Mail,             key: 'kontakt' },
  { label: 'Inhalte',      href: '/admin/content',    icon: FileText,         key: 'content' },
  { label: 'Admins',       href: '/admin/admins',     icon: Shield,           key: 'admins' },
  { label: 'Einstellungen',href: '/admin/settings',   icon: Settings,         key: 'settings' },
]

interface Props {
  children: React.ReactNode
  active: string
}

export default function AdminShell({ children, active }: Props) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 min-w-0">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 bg-nm-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">NM</span>
                </div>
                <span className="font-black text-sm text-nm-blue dark:text-white hidden sm:block">Admin</span>
              </Link>
              <nav className="flex items-center gap-0.5 overflow-x-auto">
                {NAV_LINKS.map(({ label, href, icon: Icon, key }) => (
                  <Link
                    key={key}
                    href={href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                      active === key
                        ? 'bg-nm-blue/10 text-nm-blue dark:bg-nm-blue/20 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden lg:block">{label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}

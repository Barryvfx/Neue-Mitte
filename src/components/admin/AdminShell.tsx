'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, Newspaper, Mail, FileText, Shield, Settings, LogOut,
  HelpCircle, Calendar, Activity, Bell, Menu, X, ChevronRight,
} from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import QuickSearch from '@/components/admin/QuickSearch'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { label: 'Dashboard',       href: '/admin/dashboard',       icon: LayoutDashboard, key: 'dashboard' },
  { label: 'Unterstützer',    href: '/admin/supporters',      icon: Users,            key: 'supporters' },
  { label: 'Meldungen',       href: '/admin/news',            icon: Newspaper,        key: 'news' },
  { label: 'Kontakt',         href: '/admin/kontakt',         icon: Mail,             key: 'kontakt' },
  { label: 'Inhalte',         href: '/admin/content',         icon: FileText,         key: 'content' },
  { label: 'FAQ',             href: '/admin/faq',             icon: HelpCircle,       key: 'faq' },
  { label: 'Veranstaltungen', href: '/admin/veranstaltungen', icon: Calendar,         key: 'veranstaltungen' },
  { label: 'Newsletter',      href: '/admin/newsletter',      icon: Bell,             key: 'newsletter' },
  { label: 'Login-Log',       href: '/admin/login-log',       icon: Activity,         key: 'login-log' },
  { label: 'Admins',          href: '/admin/admins',          icon: Shield,           key: 'admins' },
  { label: 'Einstellungen',   href: '/admin/settings',        icon: Settings,         key: 'settings' },
]

interface Props {
  children: React.ReactNode
  active: string
}

export default function AdminShell({ children, active }: Props) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const activeLink = NAV_LINKS.find((l) => l.key === active)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 bg-nm-blue rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">NM</span>
        </div>
        <div>
          <p className="font-black text-sm text-gray-900 dark:text-white leading-none">Neue Mitte</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_LINKS.map(({ label, href, icon: Icon, key }) => {
          const isActive = active === key
          return (
            <Link
              key={key}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-nm-blue text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: theme + logout */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Darstellung</span>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Abmelden</span>
        </button>
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <span className="h-4 w-4 flex-shrink-0 text-center text-xs">↗</span>
          <span>Zur Website</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar (mobile only shows menu button + page title) */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              <span className="text-gray-400 dark:text-gray-500 hidden sm:block">Admin</span>
              {activeLink && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 hidden sm:block flex-shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-white truncate">
                    {activeLink.label}
                  </span>
                </>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Ctrl+K hint */}
              <button
                onClick={() => {
                  const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true })
                  document.dispatchEvent(e)
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 hover:border-nm-blue hover:text-nm-blue dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>Suchen…</span>
                <kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">⌃K</kbd>
              </button>
            </div>
          </div>
        </header>

        <QuickSearch />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

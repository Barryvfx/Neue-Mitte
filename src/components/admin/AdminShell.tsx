'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Users, Newspaper, Mail, FileText, Shield, Settings, LogOut,
  HelpCircle, Calendar, Bell, Menu, X, ChevronRight,
  ClipboardList, Megaphone, Link2, BarChart2,
  MessageSquare, Lightbulb, CheckSquare, Radio, BookOpen,
  Swords, GraduationCap, Scale, Eye, Briefcase, MapPin, Lock,
  Activity, Search, ChevronDown,
} from 'lucide-react'
import QuickSearch from '@/components/admin/QuickSearch'
import { cn } from '@/lib/cn'

const NAV_GROUPS = [
  {
    label: 'Inhalte',
    links: [
      { label: 'Dashboard',       href: '/admin/dashboard',           icon: LayoutDashboard, key: 'dashboard' },
      { label: 'Meldungen',       href: '/admin/news',                icon: Newspaper,        key: 'news' },
      { label: 'Inhalte',         href: '/admin/content',             icon: FileText,         key: 'content' },
      { label: 'FAQ',             href: '/admin/faq',                 icon: HelpCircle,       key: 'faq' },
      { label: 'Veranstaltungen', href: '/admin/veranstaltungen',     icon: Calendar,         key: 'veranstaltungen' },
    ],
  },
  {
    label: 'Kommunikation',
    links: [
      { label: 'Newsletter',      href: '/admin/newsletter',          icon: Bell,             key: 'newsletter' },
      { label: 'Kontakt',         href: '/admin/kontakt',             icon: Mail,             key: 'kontakt' },
      { label: 'Petition',        href: '/admin/petition',            icon: ClipboardList,    key: 'petition' },
      { label: 'Presse',          href: '/admin/presse',              icon: Megaphone,        key: 'presse' },
      { label: 'Referral-Links',  href: '/admin/referral',            icon: Link2,            key: 'referral' },
      { label: 'A/B-Test',        href: '/admin/abtest',              icon: BarChart2,        key: 'abtest' },
    ],
  },
  {
    label: 'Mitmachen',
    links: [
      { label: 'Bürgerfragen',    href: '/admin/buergerfragen',       icon: MessageSquare,    key: 'buergerfragen' },
      { label: 'Ideen',           href: '/admin/ideen',               icon: Lightbulb,        key: 'ideen' },
      { label: 'Versprechen',     href: '/admin/versprechen',         icon: CheckSquare,      key: 'versprechen' },
      { label: 'Debatte',         href: '/admin/debatte',             icon: Swords,           key: 'debatte' },
      { label: 'Live-Ticker',     href: '/admin/wahl-ticker',         icon: Radio,            key: 'wahl-ticker' },
    ],
  },
  {
    label: 'Wissen & Bildung',
    links: [
      { label: 'Politik erklärt', href: '/admin/erklaert',            icon: BookOpen,         key: 'erklaert' },
      { label: 'Faktencheck',     href: '/admin/faktencheck',         icon: Scale,            key: 'faktencheck' },
      { label: 'Gesetz im Fokus', href: '/admin/gesetz-fokus',        icon: GraduationCap,    key: 'gesetz-fokus' },
      { label: 'Transparenz',     href: '/admin/transparenz',         icon: Eye,              key: 'transparenz' },
      { label: 'Wissenstest',     href: '/admin/wissenstest',         icon: HelpCircle,       key: 'wissenstest' },
    ],
  },
  {
    label: 'Community',
    links: [
      { label: 'Ehrenamt',        href: '/admin/ehrenamt',            icon: Briefcase,        key: 'ehrenamt' },
      { label: 'Wahlhelfer',      href: '/admin/wahlhelfer',          icon: MapPin,           key: 'wahlhelfer' },
      { label: 'Mitglieder',      href: '/admin/mitglieder',          icon: Lock,             key: 'mitglieder' },
    ],
  },
  {
    label: 'System',
    links: [
      { label: 'Unterstützer',    href: '/admin/supporters',          icon: Users,            key: 'supporters' },
      { label: 'Login-Log',       href: '/admin/login-log',           icon: Activity,         key: 'login-log' },
      { label: 'Admins',          href: '/admin/admins',              icon: Shield,           key: 'admins' },
      { label: 'Einstellungen',   href: '/admin/settings',            icon: Settings,         key: 'settings' },
    ],
  },
]

const ALL_LINKS = NAV_GROUPS.flatMap(g => g.links)

interface Props {
  children: React.ReactNode
  active: string
}

export default function AdminShell({ children, active }: Props) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => {
      const stored = localStorage.getItem('nm-theme')
      if (stored !== 'dark') document.documentElement.classList.remove('dark')
    }
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const activeLink = ALL_LINKS.find((l) => l.key === active)

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  const filtered = search.trim()
    ? ALL_LINKS.filter(l => l.label.toLowerCase().includes(search.toLowerCase()))
    : null

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 bg-nm-blue rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-nm-blue/30">
          <span className="text-white font-black text-sm">NM</span>
        </div>
        <div>
          <p className="font-black text-sm text-white leading-none">Neue Mitte</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Menü durchsuchen…"
            className="w-full pl-8 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-nm-blue/50 focus:border-nm-blue/50"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {filtered ? (
          <div className="space-y-0.5">
            {filtered.map(({ label, href, icon: Icon, key }) => (
              <NavLink key={key} label={label} href={href} Icon={Icon} isActive={active === key} onClick={() => setSidebarOpen(false)} />
            ))}
            {filtered.length === 0 && <p className="text-xs text-gray-600 px-3 py-2">Keine Treffer</p>}
          </div>
        ) : (
          NAV_GROUPS.map(group => {
            const isCollapsed = collapsedGroups.has(group.label)
            return (
              <div key={group.label} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-gray-400 transition-colors"
                >
                  {group.label}
                  <ChevronDown className={cn('h-3 w-3 transition-transform', isCollapsed && '-rotate-90')} />
                </button>
                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.links.map(({ label, href, icon: Icon, key }) => (
                      <NavLink key={key} label={label} href={href} Icon={Icon} isActive={active === key} onClick={() => setSidebarOpen(false)} />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-950/50 hover:text-red-400 transition-all"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Abmelden</span>
        </button>
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all"
        >
          <span className="h-4 w-4 flex-shrink-0 text-center text-xs">↗</span>
          <span>Zur Website</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-gray-950 border-r border-white/5 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={cn('fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transition-transform duration-300 lg:hidden', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1.5 text-sm min-w-0">
              <span className="text-gray-600 hidden sm:block">Admin</span>
              {activeLink && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-700 hidden sm:block flex-shrink-0" />
                  <span className="font-semibold text-white truncate">{activeLink.label}</span>
                </>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => { const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }); document.dispatchEvent(e) }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-500 hover:border-nm-blue/50 hover:text-nm-blue transition-colors cursor-pointer"
              >
                <span>Suchen…</span>
                <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] font-mono">⌃K</kbd>
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

function NavLink({ label, href, Icon, isActive, onClick }: { label: string; href: string; Icon: React.ElementType; isActive: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all',
        isActive
          ? 'bg-nm-blue text-white shadow-sm shadow-nm-blue/30'
          : 'text-gray-400 hover:bg-white/5 hover:text-white',
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
    </Link>
  )
}

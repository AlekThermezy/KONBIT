'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const navItems = [
  { href: '/feed', label: 'Activity', icon: '🔥' },
  { href: '/deals', label: 'Portfolio', icon: '💰' },
  { href: '/growth', label: 'Campaigns', icon: '📈' },
  { href: '/learn', label: 'Courses', icon: '🎓' },
  { href: '/resources', label: 'Library', icon: '📚' },
  { href: '/jobs', label: 'Opportunities', icon: '💼' },
  { href: '/refer', label: 'Referrals', icon: '👥' },
]

const bottomNavItems = [
  { href: '/inspector', label: 'Inspector Hub', icon: '🔍' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function LeftSidebar() {
  const [user, setUser] = useState<any>(null)
  const [checking, setChecking] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setChecking(false)
    })
  }, [])

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'
  const firstInitial = userName.charAt(0).toUpperCase()
  const userRole = user?.user_metadata?.role || 'member'

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    router.push('/')
  }

  const isActive = (href: string) => {
    if (href === '/feed') return pathname === '/feed'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Fixed Left Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black/95 backdrop-blur-md border-r border-white/10 z-40 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-black text-black text-sm transition-transform group-hover:scale-110">
              K
            </div>
            <span className="text-xl font-black">
              <span className="text-green-500">KON</span>
              <span className="text-white">BIT</span>
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive(item.href)
                  ? 'bg-green-600/20 text-green-400 border-l-2 border-green-500 pl-[10px]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-white/10 my-3" />

          {bottomNavItems.map((item) => {
            // Hide Inspector Hub for non-inspectors
            if (item.href === '/inspector' && userRole !== 'inspector') return null
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive(item.href)
                    ? 'bg-green-600/20 text-green-400 border-l-2 border-green-500 pl-[10px]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section */}
        {!checking && (
          <div className="px-3 py-4 border-t border-white/10">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {firstInitial}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-white text-sm font-medium truncate">{userName}</div>
                    <div className="text-gray-500 text-xs capitalize">{userRole}</div>
                  </div>
                  <span className={`text-gray-400 text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>👤</span> Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>⚙️</span> Settings
                    </Link>
                    <div className="border-t border-white/10" />
                    <button
                      onClick={() => { setDropdownOpen(false); handleSignOut() }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/signin"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-sm font-bold text-black transition-all"
                >
                  Get Started →
                </Link>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  )
}

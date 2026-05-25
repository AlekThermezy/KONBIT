'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [checking, setChecking] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setChecking(false)
    })
  }, [])

  useEffect(() => {
    setDropdownOpen(false)
    setNotifOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    router.push('/')
  }

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'
  const firstInitial = userName.charAt(0).toUpperCase()

  return (
    <nav className="fixed top-0 left-64 right-0 z-30 h-16 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Page Title / Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="text-gray-600">/</span>
          <span className="text-white font-medium capitalize">
            {pathname.split('/')[1] || 'home'}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          {!checking && user && (
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false) }}
                className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
              >
                <span className="text-lg">🔔</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <h3 className="text-white font-bold text-sm">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-gray-400 text-sm">
                    <div className="text-2xl mb-2">🔔</div>
                    No new notifications
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Avatar */}
          {!checking && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false) }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-sm font-bold">
                      {firstInitial}
                    </div>
                    <span className="hidden md:block text-white text-sm font-medium max-w-[120px] truncate">
                      {userName}
                    </span>
                    <span className={`hidden md:block text-gray-400 text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-gray-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="text-white text-sm font-medium truncate">{userName}</div>
                        <div className="text-gray-500 text-xs truncate">{user?.email}</div>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>📊</span> Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>⚙️</span> Settings
                        </Link>
                        <div className="border-t border-white/10 my-1" />
                        <button
                          onClick={() => { setDropdownOpen(false); handleSignOut() }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition"
                        >
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signin"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-sm font-bold text-black transition-all shadow-lg shadow-green-500/25"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

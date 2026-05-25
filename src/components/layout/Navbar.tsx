'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'

interface NavContextType {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

const NavContext = createContext<NavContextType>({ isOpen: false, setIsOpen: () => {} })

export function useNav() {
  return useContext(NavContext)
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [checking, setChecking] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setChecking(false)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    router.push('/')
  }

  const navLinks = [
    { href: '/feed', label: 'Feed', icon: '🔥' },
    { href: '/growth', label: 'Growth', icon: '📈' },
    { href: '/learn', label: 'Learn', icon: '🎓' },
    { href: '/nature', label: 'Nature', icon: '🌿' },
    { href: '/deals', label: 'Deals', icon: '💰' },
    { href: '/jobs', label: 'Jobs', icon: '💼' },
    { href: '/refer', label: 'Refer', icon: '👥' },
  ]

  return (
    <NavContext.Provider value={{ isOpen, setIsOpen }}>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-xl shadow-lg shadow-green-500/5' : 'bg-black/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-black text-black text-lg transition-transform group-hover:scale-110">
                K
              </div>
              <span className="text-2xl font-black">
                <span className="text-green-500">KON</span>
                <span className="text-white">BIT</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    pathname === link.href
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {!checking && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="hidden sm:flex px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="hidden sm:flex px-4 py-2.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded-xl text-sm font-medium text-red-400 transition"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="hidden sm:flex px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/waitlist"
                        className="hidden sm:flex px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-sm font-bold text-black transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <div className="relative w-5 h-4">
                  <span className={`absolute left-0 top-0 w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 top-2' : ''}`} />
                  <span className={`absolute left-0 top-2 w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                  <span className={`absolute left-0 top-4 w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 top-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-in Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-6 pt-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Options */}
            {!checking && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white/5 rounded-xl text-base font-medium text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 px-4 py-3.5 bg-red-900/30 border border-red-500/30 rounded-xl text-base font-medium text-red-400 w-full"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white/5 rounded-xl text-base font-medium text-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/waitlist"
                      className="flex items-center justify-center gap-2 px-4 py-3.5 mt-2 bg-gradient-to-r from-green-600 to-green-500 rounded-xl text-base font-bold text-black"
                    >
                      Get Started →
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </NavContext.Provider>
  )
}
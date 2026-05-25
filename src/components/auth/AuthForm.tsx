'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, getCurrentUser, UserRole } from '@/lib/auth'

type AuthMode = 'email' | 'whatsapp'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

const countryCodes = [
  { code: '+509', name: 'Haiti' },
  { code: '+1', name: 'USA/Canada' },
  { code: '+44', name: 'UK' },
  { code: '+33', name: 'France' },
  { code: '+971', name: 'UAE' },
  { code: '+34', name: 'Spain' },
  { code: '+44', name: 'Dominican Rep.' },
]

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<AuthMode>('email')

  // Email state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('both')

  // WhatsApp state
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+509')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpStep, setOtpStep] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) router.push('/dashboard')
    })
  }, [router])

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  // ===== EMAIL AUTH =====
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        const { signUp } = await import('@/lib/auth')
        await signUp(email, password, fullName, role)
        router.push('/dashboard')
      } else {
        await signIn(email, password)
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // ===== WHATSAPP AUTH =====
  const handleWhatsAppSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Antre non ou') ; return }
    if (phone.length < 8) { setError('Nimewo telefòn ou pa valid') ; return }

    setLoading(true)
    setError('')
    try {
      const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`
      const res = await fetch('/api/auth/whatsapp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP')

      setOtpSent(true)
      setOtpStep(true)
      setResendTimer(60)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) { setError('OTP se 6 chif') ; return }

    setLoading(true)
    setError('')
    try {
      const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`
      const res = await fetch('/api/auth/whatsapp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, otp, name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-black">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-black text-black text-xl">K</div>
          <span className="text-3xl font-black">
            <span className="text-green-500">KON</span><span className="text-white">BIT</span>
          </span>
        </Link>

        {/* Auth Mode Toggle */}
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setAuthMode('email'); setError(''); setOtpStep(false); setOtpSent(false) }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${authMode === 'email' ? 'bg-green-600 text-white' : 'text-gray-400'}`}
          >
            📧 Email
          </button>
          <button
            onClick={() => { setAuthMode('whatsapp'); setError(''); setOtpStep(false); setOtpSent(false) }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${authMode === 'whatsapp' ? 'bg-green-600 text-white' : 'text-gray-400'}`}
          >
            💬 WhatsApp
          </button>
        </div>

        {/* Card */}
        <div className="bg-white/[3%] border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1 text-center">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            {authMode === 'whatsapp'
              ? 'Verify with WhatsApp — fastest for Haiti'
              : 'Sign in to access your KONBIT dashboard'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* ===== EMAIL FORM ===== */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                      placeholder="Jean Baptiste" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">I want to...</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['investor', 'learner', 'both'] as const).map((r) => (
                        <button key={r} type="button" onClick={() => setRole(r)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium border transition ${role === r ? 'bg-green-600 border-green-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                          {r === 'both' ? 'Both' : r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                  placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-base font-bold text-black transition-all shadow-lg shadow-green-500/25 disabled:opacity-50">
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          )}

          {/* ===== WHATSAPP FORM ===== */}
          {authMode === 'whatsapp' && (
            <>
              {!otpStep ? (
                <form onSubmit={handleWhatsAppSendOTP} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Non Ou (First Name)</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                      placeholder="Jean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                    <div className="flex gap-2">
                      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                        className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.code} {c.name}</option>
                        ))}
                      </select>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required minLength={8}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                        placeholder="4712 3456" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">You'll receive a verification code via WhatsApp</p>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-base font-bold text-black transition-all shadow-lg shadow-green-500/25 disabled:opacity-50">
                    {loading ? 'Sending...' : 'Send Code via WhatsApp'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleWhatsAppVerify} className="space-y-5">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="text-sm text-gray-400">
                      Bokou 6-chif la voye ba ou sou WhatsApp
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Kòd Verifikasyon (6 chif)</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} required maxLength={6}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                      placeholder="000000" />
                  </div>
                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-base font-bold text-black transition-all shadow-lg shadow-green-500/25 disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                  <div className="text-center">
                    <button type="button" onClick={() => { setOtpStep(false); setOtp(''); setOtpSent(false) }}
                      className="text-sm text-gray-500 hover:text-gray-300">
                      ← Change number
                    </button>
                    {resendTimer > 0 ? (
                      <p className="text-xs text-gray-500 mt-2">Resend in {resendTimer}s</p>
                    ) : (
                      <button type="button" onClick={handleWhatsAppSendOTP}
                        className="text-xs text-green-500 hover:text-green-400 mt-2">
                        Resend code
                      </button>
                    )}
                  </div>
                </form>
              )}
            </>
          )}

          <div className="mt-6 text-center text-gray-400 text-sm">
            {mode === 'signin' ? (
              <>Don't have an account? <Link href="/signup" className="text-green-500 hover:text-green-400">Sign up</Link></>
            ) : (
              <>Already have an account? <Link href="/signin" className="text-green-500 hover:text-green-400">Sign in</Link></>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          {authMode === 'whatsapp'
            ? '💬 WhatsApp-first signup — recommended for Haiti'
            : 'Demo mode: Configure Supabase environment variables for production'}
        </p>
      </div>
    </div>
  )
}

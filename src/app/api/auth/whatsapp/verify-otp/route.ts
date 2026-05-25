import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyOTP, getOrCreateWhatsAppUser } from '@/lib/whatsapp-auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 })
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`

    // Verify OTP
    const valid = await verifyOTP(formattedPhone, otp)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
    }

    // Get or create user
    const user = await getOrCreateWhatsAppUser(formattedPhone, name || 'KONBIT Member')

    // Sign in the user via phone OTP
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    })

    return NextResponse.json({ 
      success: true, 
      user,
      needsVerification: !sessionData.user,
      message: sessionError ? 'Account created. OTP sent to WhatsApp.' : 'Login link sent to WhatsApp.'
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
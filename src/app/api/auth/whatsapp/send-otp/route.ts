import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateOTP, sendWhatsAppOTP } from '@/lib/whatsapp-auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json()

    if (!phone || !name) {
      return NextResponse.json({ error: 'Phone and name required' }, { status: 400 })
    }

    // Format phone (ensure + prefix)
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`

    // Generate OTP
    const otp = generateOTP()

    // Store OTP in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

    await supabase.from('whatsapp_otp').insert({
      phone: formattedPhone,
      otp,
      expires_at: expiresAt,
      verified: false,
    })

    // Send via WhatsApp
    const result = await sendWhatsAppOTP(`whatsapp:${formattedPhone}`, otp, name)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send OTP' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'OTP sent via WhatsApp' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
// WhatsApp OTP via Twilio
// Haiti is WhatsApp-dominant — this is the primary auth channel

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID!
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN!
const twilioWhatsAppFrom = process.env.TWILIO_WHATSAPP_FROM! // e.g. whatsapp:+14155238886

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via Twilio WhatsApp
async function sendWhatsAppOTP(phone: string, otp: string, name: string): Promise<{ success: boolean; error?: string }> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
  
  const body = new URLSearchParams({
    From: twilioWhatsAppFrom,
    To: phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`,
    ContentBody: `KONBIT — Bokou ${otp} pou verifye kont ou. Kòd sa a expire nan 10 minit. Si ou pa fè demann sa a, ignore mesaj la.`,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const err = await response.text()
    return { success: false, error: err }
  }
  return { success: true }
}

// Verify OTP
async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const { data, error } = await supabase
    .from('whatsapp_otp')
    .select('*')
    .eq('phone', phone)
    .eq('otp', otp)
    .eq('verified', false)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)

  if (error || !data || data.length === 0) return false

  // Mark as verified
  await supabase
    .from('whatsapp_otp')
    .update({ verified: true })
    .eq('id', data[0].id)

  return true
}

// Create or get user by phone
async function getOrCreateWhatsAppUser(phone: string, name: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single()

  if (existing) return existing

  // Create new user
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    phone,
    user_metadata: { name, phone, source: 'whatsapp' }
  })

  if (authError || !authUser.user) {
    throw new Error(authError?.message || 'Failed to create user')
  }

  // Create profile
  const { data: profile } = await supabase
    .from('users')
    .insert({
      id: authUser.user.id,
      email: `${phone.replace(/[^0-9]/g, '')}@whatsapp.konbit.io`,
      name,
      phone,
      user_role: 'user',
      whatsapp_verified: true,
    })
    .select()
    .single()

  return profile
}

export { generateOTP, sendWhatsAppOTP, verifyOTP, getOrCreateWhatsAppUser }

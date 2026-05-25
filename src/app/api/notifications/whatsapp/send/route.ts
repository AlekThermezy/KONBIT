// Send WhatsApp notification to a user
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID!
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN!
const twilioWhatsAppFrom = process.env.TWILIO_WHATSAPP_FROM!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

type NotificationType = 
  | 'inspection_assigned'    // Inspector: new inspection task
  | 'inspection_due'          // Inspector: reminder 24h before
  | 'inspection_complete'    // Business: report ready
  | 'investment_received'     // Backer: campaign funded
  | 'campaign_live'          // Backer: new campaign in sector
  | 'verification_needed'    // Business: action required
  | 'welcome'                // New user welcome

const templates: Record<NotificationType, { kreyol: string; english: string }> = {
  inspection_assigned: {
    kreyol: 'Nouvo kontra enspeksyon pare! Tanpri ale sou KONBIT la pou w wè detay yo.',
    english: 'New inspection contract ready! Please visit KONBIT to view details.'
  },
  inspection_due: {
    kreyol: 'Rappel: Ou gen yon enspeksyon demen. Asire w ou pare.',
    english: 'Reminder: You have an inspection tomorrow. Make sure you\'re ready.'
  },
  inspection_complete: {
    kreyol: 'Rapò enspeksyon ou a pare. Klike la a pou wè rezilta yo.',
    english: 'Your inspection report is ready. Click to view results.'
  },
  investment_received: {
    kreyol: 'Yon nouvo envestisman te resevwa sou kanpay ou! Ale wè kantite la.',
    english: 'A new investment was received on your campaign! Tap to see the amount.'
  },
  campaign_live: {
    kreyol: 'Nouvo kanpay KONBIT ap viv kounye a nan sectè w an. Verifye li kounye a!',
    english: 'A new KONBIT campaign is now live in your sector. Check it out!'
  },
  verification_needed: {
    kreyol: 'KONBIT bezwen verifikasyon ou. Tanpri konplte proses la nan pafoul la.',
    english: 'KONBIT needs your verification. Please complete the process in your dashboard.'
  },
  welcome: {
    kreyol: 'Byenveni sou KONBIT! Konekte. Tèt ansanm. Pou nou vanse.',
    english: 'Welcome to KONBIT! Connect. Stand together. To move forward.'
  }
}

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`

  const formData = new URLSearchParams({
    From: twilioWhatsAppFrom,
    To: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
    ContentBody: body,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })

  return response.ok
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, customMessage, language } = await request.json()

    if (!userId || !type) {
      return NextResponse.json({ error: 'userId and type required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user's phone
    const { data: user } = await supabase
      .from('users')
      .select('phone, name, whatsapp_notifications')
      .eq('id', userId)
      .single()

    if (!user?.phone || !user?.whatsapp_notifications) {
      return NextResponse.json({ skipped: true, reason: 'No WhatsApp or notifications disabled' })
    }

    const template = templates[type as NotificationType]
    if (!template) {
      return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 })
    }

    const message = customMessage || (language === 'kreyol' ? template.kreyol : template.english)
    const sent = await sendWhatsAppMessage(user.phone, message)

    if (!sent) {
      return NextResponse.json({ error: 'Failed to send WhatsApp' }, { status: 500 })
    }

    // Log notification
    await supabase.from('whatsapp_notifications').insert({
      user_id: userId,
      notification_type: type,
      sent_via: 'whatsapp',
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

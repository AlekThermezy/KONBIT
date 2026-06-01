import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _supabaseAdmin
}

async function getSession(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  const supabaseAdmin = getSupabaseAdmin()
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user
}

// GET /api/admin/scheduler
export async function GET(request: NextRequest) {
  const user = await getSession(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = getSupabaseAdmin()

  const { data: businesses, count } = await supabaseAdmin
    .from('businesses')
    .select(`
      id,
      business_name,
      tier,
      city,
      country,
      verification_schedules (
        id,
        tier,
        last_inspection_at,
        next_inspection_at,
        inspection_window_start,
        inspection_window_end,
        status
      ),
      verification_badges (
        inspection_streak,
        avg_rating,
        total_inspections
      )
    `,
      { count: 'exact' }
    )
    .not('verification_schedules', 'is', null)

  const now = new Date()

  const mapped = (businesses || []).map((b: any) => {
    const schedule = Array.isArray(b.verification_schedules) ? b.verification_schedules[0] : b.verification_schedules
    const badge = Array.isArray(b.verification_badges) ? b.verification_badges[0] : b.verification_badges

    const nextDue = schedule?.next_inspection_at ? new Date(schedule.next_inspection_at) : null
    const windowStart = schedule?.inspection_window_start ? new Date(schedule.inspection_window_start) : null
    const windowEnd = schedule?.inspection_window_end ? new Date(schedule.inspection_window_end) : null

    const isOverdue = nextDue && nextDue < now
    const daysUntilDue = nextDue ? Math.floor((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
    const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 5

    return {
      id: b.id,
      name: b.business_name,
      tier: b.tier || schedule?.tier || 'free',
      city: b.city || '',
      country: b.country || '',
      lastInspection: schedule?.last_inspection_at
        ? new Date(schedule.last_inspection_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Never',
      nextDue: nextDue
        ? nextDue.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Not scheduled',
      windowStart: windowStart
        ? windowStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '',
      windowEnd: windowEnd
        ? windowEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '',
      overdue: isOverdue,
      dueSoon: isDueSoon,
      pendingJobs: 0,
      avgRating: badge?.avg_rating || 0,
      streak: badge?.inspection_streak || 0,
      scheduleId: schedule?.id || null,
    }
  })

  return NextResponse.json({
    businesses: mapped,
    total: count || 0,
    stats: {
      total: count || 0,
      overdue: mapped.filter((b: any) => b.overdue).length,
      dueSoon: mapped.filter((b: any) => b.dueSoon).length,
      verified: mapped.filter((b: any) => b.tier === 'verified').length,
      growth: mapped.filter((b: any) => b.tier === 'growth').length,
      anchor: mapped.filter((b: any) => b.tier === 'anchor').length,
    }
  })
}

// POST /api/admin/scheduler
export async function POST(request: NextRequest) {
  const user = await getSession(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = getSupabaseAdmin()
  const body = await request.json()
  const { action, scheduleId, inspectorId, jobId } = body

  if (action === 'assign') {
    if (!scheduleId || !inspectorId) {
      return NextResponse.json({ error: 'Missing scheduleId or inspectorId' }, { status: 400 })
    }

    const { error } = await (supabaseAdmin as any)
      .from('scheduled_inspections')
      .update({
        inspector_id: inspectorId,
        inspector_assigned_at: new Date().toISOString(),
        status: 'assigned'
      })
      .eq('id', scheduleId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (jobId) {
      await (supabaseAdmin as any)
        .from('inspection_jobs')
        .update({ status: 'assigned' })
        .eq('id', jobId)
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
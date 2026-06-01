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

// GET /api/admin/inspections
export async function GET(request: NextRequest) {
  const user = await getSession(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = getSupabaseAdmin()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const { data: reports, count } = await supabaseAdmin
    .from('inspection_reports')
    .select(`
      id,
      assignment_id,
      video_url,
      video_thumbnail_url,
      report_text,
      rating,
      findings,
      admin_notes,
      reviewed_by,
      reviewed_at,
      created_at,
      inspection_assignments (
        id,
        inspector_id,
        started_at,
        completed_at,
        status,
        inspectors (
          id,
          name,
          city,
          rating
        )
      ),
      inspection_jobs (
        id,
        job_type,
        business_id,
        businesses (
          id,
          business_name,
          city
        )
      )
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const reportIds = (reports || []).map((r: any) => r.id)
  let payoutMap: Record<string, string> = {}
  if (reportIds.length > 0) {
    const { data: payouts } = await supabaseAdmin
      .from('inspector_payouts')
      .select('report_id, status')
      .in('report_id', reportIds)
    payouts?.forEach((p: any) => { payoutMap[p.report_id] = p.status })
  }

  const mapped = (reports || []).map((r: any) => {
    let reportStatus = 'pending'
    if (r.reviewed_by) reportStatus = 'approved'
    if (r.admin_notes?.startsWith('[REJECTED]')) reportStatus = 'rejected'
    if (payoutMap[r.id] === 'completed') reportStatus = 'paid'

    return {
      id: r.id,
      status: reportStatus,
      rating: r.rating,
      summary: r.report_text,
      findings: r.findings || {},
      videoUrl: r.video_url,
      videoThumbnailUrl: r.video_thumbnail_url,
      submittedAt: new Date(r.created_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
      }),
      inspector: r.inspection_assignments?.inspectors?.name || 'Unknown',
      inspectorRating: r.inspection_assignments?.inspectors?.rating || 0,
      inspectorId: r.inspection_assignments?.inspector_id,
      inspectorCity: r.inspection_assignments?.inspectors?.city || '',
      inspectorBalance: 0,
      business: r.inspection_jobs?.businesses?.business_name || 'Unknown',
      location: r.inspection_assignments?.inspectors?.city || r.inspection_jobs?.businesses?.city || '',
      jobType: r.inspection_jobs?.job_type || 'verification_visit',
      payoutAmount: 2500,
      payoutStatus: payoutMap[r.id] || null,
    }
  })

  const { count: pendingCount } = await supabaseAdmin
    .from('inspection_reports')
    .select('id', { count: 'exact', head: true })
    .is('reviewed_by', null)

  const { count: approvedCount } = await supabaseAdmin
    .from('inspection_reports')
    .select('id', { count: 'exact', head: true })
    .not('reviewed_by', 'is', null)

  return NextResponse.json({
    reports: mapped,
    total: count || 0,
    stats: {
      pending: pendingCount || 0,
      approved: approvedCount || 0,
      rejected: 0,
      paid: Object.values(payoutMap).filter(s => s === 'completed').length,
    }
  })
}

// POST /api/admin/inspections
export async function POST(request: NextRequest) {
  const user = await getSession(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = getSupabaseAdmin()
  const body = await request.json()
  const { action, reportId } = body

  if (!['approve', 'reject', 'pay'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (action === 'approve') {
    await supabaseAdmin
      .from('inspection_reports')
      .update({ reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', reportId)

    await supabaseAdmin
      .from('admin_job_reviews')
      .insert({ report_id: reportId, reviewer_id: user.id, decision: 'approved' })

    return NextResponse.json({ success: true, status: 'approved' })
  }

  if (action === 'reject') {
    await supabaseAdmin
      .from('inspection_reports')
      .update({
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: '[REJECTED] ' + (body.reason || 'No reason provided')
      })
      .eq('id', reportId)

    await supabaseAdmin
      .from('admin_job_reviews')
      .insert({ report_id: reportId, reviewer_id: user.id, decision: 'rejected', decision_notes: body.reason })

    return NextResponse.json({ success: true, status: 'rejected' })
  }

  if (action === 'pay') {
    const { data: report } = await supabaseAdmin
      .from('inspection_reports')
      .select('assignment_id')
      .eq('id', reportId)
      .single()

    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

    // Get inspector from assignment
    const { data: assignment } = await supabaseAdmin
      .from('inspection_assignments')
      .select('inspector_id')
      .eq('id', report.assignment_id)
      .single()

    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })

    await supabaseAdmin
      .from('inspector_payouts')
      .insert({
        inspector_id: assignment.inspector_id,
        assignment_id: report.assignment_id,
        amount_cents: 2500,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })

    await supabaseAdmin
      .from('admin_job_reviews')
      .update({ inspector_paid: true })
      .eq('report_id', reportId)

    return NextResponse.json({ success: true, status: 'paid' })
  }

  return NextResponse.json({ error: 'Unhandled' }, { status: 400 })
}
import { supabase } from '@/lib/supabase'

export interface Invite {
  id: string
  inviter_id: string
  invitee_email: string
  invitee_name?: string
  referral_code: string
  status: 'pending' | 'accepted' | 'expired'
  created_at: string
  expires_at: string
}

export interface ReferralStats {
  totalInvites: number
  acceptedInvites: number
  pendingInvites: number
  rewardsEarned: string
}

export function generateReferralCode(userId: string): string {
  const timestamp = Date.now().toString(36)
  const userSnippet = userId.slice(0, 4).toUpperCase()
  return `KONBIT-${userSnippet}-${timestamp}`
}

export async function createInvite(inviterId: string, inviteeEmail: string, inviteeName?: string): Promise<Invite | null> {
  const referralCode = generateReferralCode(inviterId)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days to accept

  const { data, error } = await supabase
    .from('invites')
    .insert([
      {
        inviter_id: inviterId,
        invitee_email: inviteeEmail,
        invitee_name: inviteeName,
        referral_code: referralCode,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating invite:', error)
    return null
  }
  return data as Invite
}

export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const { data: invites, count } = await supabase
    .from('invites')
    .select('*', { count: 'exact' })
    .eq('inviter_id', userId)

  const accepted = invites?.filter((i) => i.status === 'accepted').length || 0
  const pending = invites?.filter((i) => i.status === 'pending').length || 0

  return {
    totalInvites: count || 0,
    acceptedInvites: accepted,
    pendingInvites: pending,
    rewardsEarned: `$${(accepted * 25).toFixed(0)}`, // $25 per successful referral
  }
}

export async function getUserInvites(userId: string): Promise<Invite[]> {
  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('inviter_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data as Invite[]
}

export async function acceptInvite(referralCode: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('invites')
    .update({ status: 'accepted' })
    .eq('referral_code', referralCode)
    .eq('status', 'pending')

  if (error) return false

  // TODO: Award referral bonus to inviter
  return true
}

export function getInviteLink(referralCode: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "https://konbit.io"}/invite/${referralCode}`
}

export function getShareText(referralCode: string): string {
  const link = getInviteLink(referralCode)
  return `Join me on KONBIT — Invest in Haitian businesses, learn from experts, build the future together. Use my referral code: ${referralCode} ${link}`
}
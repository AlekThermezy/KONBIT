-- =====================================================
-- KONBIT Database Fixes — Run on Supabase SQL Editor
-- https://supabase.com/dashboard → SQL Editor → New Query
-- =====================================================

-- =====================================================
-- FIX 1: whatsapp_notifications table (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    sent_via TEXT DEFAULT 'whatsapp',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.whatsapp_notifications TO authenticated;
GRANT SELECT ON public.whatsapp_notifications TO anon;

-- Idempotent: drop then recreate each policy
DROP POLICY IF EXISTS "Service role full access" ON public.whatsapp_notifications;
CREATE POLICY "Service role full access" ON public.whatsapp_notifications FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own notifications" ON public.whatsapp_notifications;
CREATE POLICY "Users can view own notifications" ON public.whatsapp_notifications FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FIX 2: RLS on invites table
-- =====================================================
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Idempotent: drop then recreate each policy
DROP POLICY IF EXISTS "Anyone can view invites" ON public.invites;
CREATE POLICY "Anyone can view invites" ON public.invites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create invites" ON public.invites;
CREATE POLICY "Authenticated users can create invites" ON public.invites FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own invites" ON public.invites;
CREATE POLICY "Users can update own invites" ON public.invites FOR UPDATE USING (auth.uid() = inviter_id);

GRANT SELECT, INSERT, UPDATE ON public.invites TO authenticated;
GRANT SELECT ON public.invites TO anon;
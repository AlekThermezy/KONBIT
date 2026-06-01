-- =====================================================
-- KONBIT Database Fixes — Run on Supabase SQL Editor
-- https://supabase.com/dashboard → SQL Editor → New Query
-- =====================================================

-- =====================================================
-- FIX 1: Create whatsapp_notifications table
-- =====================================================
-- Referenced in src/app/api/notifications/whatsapp/send/route.ts
-- Inserts: user_id, notification_type, sent_via

CREATE TABLE IF NOT EXISTS public.whatsapp_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    sent_via TEXT DEFAULT 'whatsapp',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can insert (service role logs via API)
GRANT SELECT, INSERT ON public.whatsapp_notifications TO authenticated;
GRANT SELECT ON public.whatsapp_notifications TO anon;

CREATE POLICY "Service role full access" ON public.whatsapp_notifications
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own notifications" ON public.whatsapp_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FIX 2: Add RLS to invites table
-- =====================================================
-- invites table was created without RLS enabled
-- Found in migrations: 002b_safe_campaigns.sql, 003_safe_fixes.sql, 003_schema_fixes.sql

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view invites" ON public.invites
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create invites" ON public.invites
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own invites" ON public.invites
    FOR UPDATE USING (auth.uid() = inviter_id);

GRANT SELECT, INSERT, UPDATE ON public.invites TO authenticated;
GRANT SELECT ON public.invites TO anon;

-- =====================================================
-- VERIFY: Check table names match code
-- =====================================================
-- ✓ inspection_jobs (NOT inspector_jobs) — already in schema
-- ✓ businesses — already in schema
-- ✓ users.name (NOT full_name) — already in schema
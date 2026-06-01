-- =====================================================
-- KONBIT Database Fixes
-- Run this on Supabase SQL editor: https://supabase.com/dashboard
-- =====================================================

-- =====================================================
-- FIX 1: whatsapp_notifications table (missing)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    via TEXT[] DEFAULT '{}',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.whatsapp_notifications TO authenticated;
GRANT SELECT ON public.whatsapp_notifications TO anon;

CREATE POLICY "Users can view own notifications" ON public.whatsapp_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage notifications" ON public.whatsapp_notifications
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- FIX 2: RLS on invites table (was missing)
-- =====================================================
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invites" ON public.invites
    FOR SELECT USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

CREATE POLICY "Anyone can create invites" ON public.invites
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own invites" ON public.invites
    FOR UPDATE USING (auth.uid() = inviter_id);

GRANT SELECT, INSERT, UPDATE ON public.invites TO authenticated;
GRANT SELECT ON public.invites TO anon;

-- =====================================================
-- FIX 3: RLS policies on lita_responses
-- =====================================================
ALTER TABLE public.lita_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages lita_responses" ON public.lita_responses
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can read lita_responses" ON public.lita_responses
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert lita_responses" ON public.lita_responses
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- FIX 4: Add missing columns to users table
-- Note: user_role is not in schema - code should not insert it
-- The signup flow already updated to only use: id, email, name
-- =====================================================

-- =====================================================
-- FIX 5: Dictionary words table RLS (if not set)
-- =====================================================
ALTER TABLE public.dictionary_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read dictionary words" ON public.dictionary_words
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add words" ON public.dictionary_words
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- VERIFY: Check tables exist with expected names
-- =====================================================
-- inspection_jobs ✓ (not inspector_jobs)
-- businesses ✓
-- campaigns ✓
-- courses ✓
-- users ✓ (has: name, NOT full_name)
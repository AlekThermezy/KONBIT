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

-- Add policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access whatsapp_notifications' AND tablename = 'whatsapp_notifications') THEN
    CREATE POLICY "Service role full access" ON public.whatsapp_notifications FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own notifications whatsapp_notifications' AND tablename = 'whatsapp_notifications') THEN
    CREATE POLICY "Users can view own notifications" ON public.whatsapp_notifications FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- =====================================================
-- FIX 2: RLS on invites table
-- =====================================================
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view invites' AND tablename = 'invites') THEN
    CREATE POLICY "Anyone can view invites" ON public.invites FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can create invites' AND tablename = 'invites') THEN
    CREATE POLICY "Authenticated users can create invites" ON public.invites FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own invites' AND tablename = 'invites') THEN
    CREATE POLICY "Users can update own invites" ON public.invites FOR UPDATE USING (auth.uid() = inviter_id);
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE ON public.invites TO authenticated;
GRANT SELECT ON public.invites TO anon;
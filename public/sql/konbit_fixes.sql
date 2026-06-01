-- =====================================================
-- KONBIT Database Fixes (June 2026)
-- Run in Supabase SQL Editor → New Query
-- =====================================================

-- FIX: RLS on invites table
-- Uses IF NOT EXISTS to prevent duplicate policy errors
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE policyname = 'Anyone can view invites'
    AND tablename = 'invites'
  ) THEN
    CREATE POLICY "Anyone can view invites" ON public.invites
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE policyname = 'Authenticated users can create invites'
    AND tablename = 'invites'
  ) THEN
    CREATE POLICY "Authenticated users can create invites" ON public.invites
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE policyname = 'Users can update own invites'
    AND tablename = 'invites'
  ) THEN
    CREATE POLICY "Users can update own invites" ON public.invites
      FOR UPDATE USING (auth.uid() = inviter_id);
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE ON public.invites TO authenticated;
GRANT SELECT ON public.invites TO anon;
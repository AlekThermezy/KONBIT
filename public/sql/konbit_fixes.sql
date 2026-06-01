-- =====================================================
-- KONBIT Database Fixes (June 2026)
-- Run in Supabase SQL Editor → New Query
-- =====================================================

-- These policies were already created in prior runs.
-- This file just cleans up any duplicates.

-- FIX: RLS on invites table (already has policies from prior runs)
-- Recreate them idempotently to fix any broken state
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view invites" ON public.invites;
CREATE POLICY "Anyone can view invites" ON public.invites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create invites" ON public.invites;
CREATE POLICY "Authenticated users can create invites" ON public.invites FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own invites" ON public.invites;
CREATE POLICY "Users can update own invites" ON public.invites FOR UPDATE USING (auth.uid() = inviter_id);

GRANT SELECT, INSERT, UPDATE ON public.invites TO authenticated;
GRANT SELECT ON public.invites TO anon;
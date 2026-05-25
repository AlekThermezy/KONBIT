-- =====================================================
-- KONBIT SCHEMA FIXES — Migration 003
-- =====================================================
-- Fixes: missing invites table, role column, full_name mismatch, hardcoded URLs
-- Run this AFTER 001_schema.sql and 002_product_campaigns.sql
-- =====================================================

BEGIN;

-- =====================================================
-- FIX 1: Add role column to users table
-- =====================================================
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'business'));

-- =====================================================
-- FIX 2: Add invites table (referral system)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inviter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    invitee_name TEXT,
    referral_code TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invites_inviter ON public.invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invites_code ON public.invites(referral_code);
CREATE INDEX IF NOT EXISTS idx_invites_email ON public.invites(invitee_email);
CREATE INDEX IF NOT EXISTS idx_invites_status ON public.invites(status);

-- =====================================================
-- FIX 3: Fix admin RLS policy (uses role column now)
-- =====================================================
DROP POLICY IF EXISTS "Admins can manage all campaigns" ON public.product_campaigns;
DROP POLICY IF EXISTS "Admins can manage all campaign_backings" ON public.campaign_backings;
DROP POLICY IF EXISTS "Admins can manage all campaign_updates" ON public.campaign_updates;

CREATE POLICY "Admins can manage all campaigns"
    ON public.product_campaigns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all campaign_backings"
    ON public.campaign_backings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all campaign_updates"
    ON public.campaign_updates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- =====================================================
-- FIX 4: Update profiles trigger to include role
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        'user'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FIX 5: Ensure waitlist has proper created_at default
-- =====================================================
ALTER TABLE public.waitlist
ALTER COLUMN created_at SET DEFAULT NOW();

-- =====================================================
-- COMMIT
-- =====================================================
COMMIT;

-- =====================================================
-- VERIFICATION QUERIES (run these to confirm)
-- =====================================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invites';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
-- SELECT role, COUNT(*) FROM users GROUP BY role;
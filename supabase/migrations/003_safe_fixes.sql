-- =====================================================
-- KONBIT SCHEMA FIXES — SAFE EDITION
-- Run this ONLY if 003 gave you "already exists" errors
-- Handles ALL duplicates gracefully
-- =====================================================

BEGIN;

-- =====================================================
-- 1. Add role column to users (if not exists)
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'business'));
    END IF;
END $$;

-- =====================================================
-- 2. Create invites table (if not exists)
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

CREATE INDEX IF NOT EXISTS idx_invites_inviter ON public.invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invites_code ON public.invites(referral_code);
CREATE INDEX IF NOT EXISTS idx_invites_email ON public.invites(invitee_email);
CREATE INDEX IF NOT EXISTS idx_invites_status ON public.invites(status);

-- =====================================================
-- 3. Update trigger for new users (drop old first, recreate)
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
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            split_part(new.email, '@', 1)
        ),
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. Create indexes (if not exists)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published) WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_business ON public.campaigns(business_id);

CREATE INDEX IF NOT EXISTS idx_investments_user ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_campaign ON public.investments(campaign_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);

CREATE INDEX IF NOT EXISTS idx_businesses_sector ON public.businesses(sector);
CREATE INDEX IF NOT EXISTS idx_businesses_country ON public.businesses(country);

-- =====================================================
-- 5. Create RLS policies (if not exist — drop first for clean slate)
-- =====================================================

-- Product campaigns policies (supabase rlsc)
DROP POLICY IF EXISTS "Anyone can view active campaigns" ON public.product_campaigns;
DROP POLICY IF EXISTS "Authenticated users can back campaigns" ON public.product_campaigns;
DROP POLICY IF EXISTS "Businesses can manage own campaigns" ON public.product_campaigns;
DROP POLICY IF EXISTS "Admins can manage all campaigns" ON public.product_campaigns;

CREATE POLICY "Anyone can view active campaigns"
    ON public.product_campaigns FOR SELECT
    USING (status IN ('live', 'funded'));

CREATE POLICY "Authenticated users can back campaigns"
    ON public.product_campaigns FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Businesses can manage own campaigns"
    ON public.product_campaigns FOR ALL
    USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all campaigns"
    ON public.product_campaigns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- campaign_backings policies
DROP POLICY IF EXISTS "Users can view own backings" ON public.campaign_backings;
DROP POLICY IF EXISTS "Admins can manage all backings" ON public.campaign_backings;

CREATE POLICY "Users can view own backings"
    ON public.campaign_backings FOR SELECT
    USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can manage all backings"
    ON public.campaign_backings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- campaign_updates policies
DROP POLICY IF EXISTS "Anyone can view campaign updates" ON public.campaign_updates;
DROP POLICY IF EXISTS "Admins can post updates" ON public.campaign_updates;

CREATE POLICY "Anyone can view campaign updates"
    ON public.campaign_updates FOR SELECT USING (true);

CREATE POLICY "Admins can post updates"
    ON public.campaign_updates FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

COMMIT;

-- =====================================================
-- VERIFY: Run these to confirm
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role';
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'invites';
-- =====================================================
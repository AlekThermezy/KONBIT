-- =====================================================
-- KONBIT SAFE MIGRATION — FINAL
-- Creates product_campaigns tables + applies ALL fixes
-- Removes CHECK constraint that conflicts with PostgreSQL role type
-- =====================================================

BEGIN;

-- =====================================================
-- PART A: Create product_campaigns tables
-- =====================================================
CREATE TABLE IF NOT EXISTS public.product_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    business_name TEXT NOT NULL,
    business_sector TEXT NOT NULL,
    business_location TEXT,
    business_description TEXT,
    business_size TEXT,
    funding_stage TEXT,
    website TEXT,
    
    product_name TEXT NOT NULL,
    product_description TEXT,
    retail_price NUMERIC NOT NULL,
    production_cost NUMERIC,
    quantity_available INTEGER NOT NULL,
    quantity_sold INTEGER DEFAULT 0,
    shipping_estimate NUMERIC,
    delivery_timeline TEXT,
    
    status TEXT DEFAULT 'pending',
    goal_type TEXT DEFAULT 'quantity',
    funding_goal NUMERIC,
    
    pricing_tiers JSONB DEFAULT '[
      {"tier": 1, "name": "Pioneer", "range": "0-25", "discount": 0.40},
      {"tier": 2, "name": "Growth", "range": "25-50", "discount": 0.25},
      {"tier": 3, "name": "Acceleration", "range": "50-75", "discount": 0.15},
      {"tier": 4, "name": "Final Push", "range": "75-100", "discount": 0.10}
    ]'::jsonb,
    
    accreditation_doc_url TEXT,
    vetting_notes TEXT,
    vetted_by UUID REFERENCES public.users(id),
    vetted_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    launched_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.campaign_backings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.product_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 4),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    shipping_price NUMERIC DEFAULT 0,
    total_price NUMERIC NOT NULL,
    
    status TEXT DEFAULT 'pending',
    
    shipping_name TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_zip TEXT,
    shipping_country TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.campaign_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.product_campaigns(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    update_type TEXT DEFAULT 'general',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_campaigns_status ON public.product_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_product_campaigns_sector ON public.product_campaigns(business_sector);
CREATE INDEX IF NOT EXISTS idx_product_campaigns_user ON public.product_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_product_campaigns_created ON public.product_campaigns(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_backings_campaign ON public.campaign_backings(campaign_id);
CREATE INDEX IF NOT EXISTS idx_backings_user ON public.campaign_backings(user_id);
CREATE INDEX IF NOT EXISTS idx_backings_status ON public.campaign_backings(status);

CREATE INDEX IF NOT EXISTS idx_updates_campaign ON public.campaign_updates(campaign_id);

-- =====================================================
-- PART B: Add user_role column (renamed to avoid PostgreSQL conflict)
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'user_role'
    ) THEN
        ALTER TABLE public.users ADD COLUMN user_role TEXT DEFAULT 'user';
    END IF;
END $$;

-- =====================================================
-- PART C: Create invites table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inviter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    invitee_name TEXT,
    referral_code TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_invites_inviter ON public.invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invites_code ON public.invites(referral_code);
CREATE INDEX IF NOT EXISTS idx_invites_email ON public.invites(invitee_email);
CREATE INDEX IF NOT EXISTS idx_invites_status ON public.invites(status);

-- =====================================================
-- PART D: Update auth trigger to set user_role
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_role_val TEXT;
BEGIN
    user_role_val := COALESCE(
        new.raw_user_meta_data->>'role',
        'user'
    );
    
    INSERT INTO public.users (id, email, name, user_role)
    VALUES (
        new.id,
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            split_part(new.email, '@', 1)
        ),
        user_role_val
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        user_role = EXCLUDED.user_role,
        updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PART E: RLS Policies
-- =====================================================
ALTER TABLE public.product_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_backings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active campaigns" ON public.product_campaigns;
DROP POLICY IF EXISTS "Businesses can manage own campaigns" ON public.product_campaigns;
DROP POLICY IF EXISTS "Admins can manage all campaigns" ON public.product_campaigns;

CREATE POLICY "Anyone can view active campaigns"
    ON public.product_campaigns FOR SELECT
    USING (status IN ('live', 'funded', 'delivered'));

CREATE POLICY "Businesses can manage own campaigns"
    ON public.product_campaigns FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all campaigns"
    ON public.product_campaigns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.user_role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can view own backings" ON public.campaign_backings;
DROP POLICY IF EXISTS "Admins can manage all backings" ON public.campaign_backings;

CREATE POLICY "Users can view own backings"
    ON public.campaign_backings FOR SELECT
    USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_role = 'admin'));

CREATE POLICY "Admins can manage all backings"
    ON public.campaign_backings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.user_role = 'admin'
        )
    );

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
            AND users.user_role = 'admin'
        )
    );

-- =====================================================
-- PART F: Grants
-- =====================================================
GRANT ALL ON public.product_campaigns TO anon;
GRANT ALL ON public.product_campaigns TO authenticated;
GRANT ALL ON public.campaign_backings TO anon;
GRANT ALL ON public.campaign_backings TO authenticated;
GRANT ALL ON public.campaign_updates TO anon;
GRANT ALL ON public.campaign_updates TO authenticated;

COMMIT;

-- =====================================================
-- VERIFY:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'users';
-- =====================================================
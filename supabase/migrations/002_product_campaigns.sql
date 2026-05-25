-- =====================================================
-- PRODUCT CAMPAIGNS (Pre-Fab Rewards System)
-- =====================================================
CREATE TABLE public.product_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Business Info
    business_name TEXT NOT NULL,
    business_sector TEXT NOT NULL,
    business_location TEXT,
    business_description TEXT,
    business_size TEXT,
    funding_stage TEXT,
    website TEXT,
    
    -- Product Info
    product_name TEXT NOT NULL,
    product_description TEXT,
    retail_price NUMERIC NOT NULL,
    production_cost NUMERIC,
    quantity_available INTEGER NOT NULL,
    quantity_sold INTEGER DEFAULT 0,
    shipping_estimate NUMERIC,
    delivery_timeline TEXT,
    
    -- Campaign Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'live', 'funded', 'failed', 'delivered')),
    goal_type TEXT DEFAULT 'quantity' CHECK (goal_type IN ('quantity', 'revenue')),
    funding_goal NUMERIC, -- if revenue-based
    
    -- Pricing Tiers (stored as JSON for flexibility)
    pricing_tiers JSONB DEFAULT '[
      {"tier": 1, "name": "Pioneer", "range": "0-25", "discount": 0.40},
      {"tier": 2, "name": "Growth", "range": "25-50", "discount": 0.25},
      {"tier": 3, "name": "Acceleration", "range": "50-75", "discount": 0.15},
      {"tier": 4, "name": "Final Push", "range": "75-100", "discount": 0.10}
    ]'::jsonb,
    
    -- Vetting
    accreditation_doc_url TEXT,
    vetting_notes TEXT,
    vetted_by UUID REFERENCES public.users(id),
    vetted_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    launched_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_campaigns_status ON public.product_campaigns(status);
CREATE INDEX idx_campaigns_sector ON public.product_campaigns(business_sector);
CREATE INDEX idx_campaigns_user ON public.product_campaigns(user_id);
CREATE INDEX idx_campaigns_created ON public.product_campaigns(created_at DESC);

-- =====================================================
-- CAMPAIGN BACKINGS (Pre-Orders)
-- =====================================================
CREATE TABLE public.campaign_backings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.product_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Backing Details
    tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 4),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    shipping_price NUMERIC DEFAULT 0,
    total_price NUMERIC NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'refunded', 'cancelled')),
    
    -- Shipping Info (cached at time of backing)
    shipping_name TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_zip TEXT,
    shipping_country TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_backings_campaign ON public.campaign_backings(campaign_id);
CREATE INDEX idx_backings_user ON public.campaign_backings(user_id);
CREATE INDEX idx_backings_status ON public.campaign_backings(status);

-- =====================================================
-- CAMPAIGN UPDATES (For Backers)
-- =====================================================
CREATE TABLE public.campaign_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.product_campaigns(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    update_type TEXT DEFAULT 'general' CHECK (update_type IN ('general', 'milestone', 'shipping', 'delay', 'complete')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_updates_campaign ON public.campaign_updates(campaign_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Campaigns: Anyone can view approved campaigns
CREATE POLICY "Anyone can view approved campaigns"
    ON public.product_campaigns
    FOR SELECT
    USING (status IN ('approved', 'live', 'funded', 'delivered'));

-- Businesses can CRUD their own campaigns
CREATE POLICY "Businesses can manage own campaigns"
    ON public.product_campaigns
    FOR ALL
    USING (auth.uid() = user_id);

-- Admin can manage all campaigns
CREATE POLICY "Admins can manage all campaigns"
    ON public.product_campaigns
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Backings: Users can view their own
CREATE POLICY "Users can view own backings"
    ON public.campaign_backings
    FOR SELECT
    USING (auth.uid() = user_id);

-- Backings: Businesses can view backings on their campaigns
CREATE POLICY "Businesses can view backings on own campaigns"
    ON public.campaign_backings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.product_campaigns
            WHERE id = campaign_id
            AND user_id = auth.uid()
        )
    );

-- Backings: Users can create backings
CREATE POLICY "Users can create backings"
    ON public.campaign_backings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Backings: Update status for shipping/delivery
CREATE POLICY "Admins can update backings status"
    ON public.campaign_backings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Campaign updates: Anyone can view
CREATE POLICY "Anyone can view campaign updates"
    ON public.campaign_updates
    FOR SELECT
    USING (true);

-- Campaign updates: Businesses can create for their campaigns
CREATE POLICY "Businesses can create updates for own campaigns"
    ON public.campaign_updates
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.product_campaigns
            WHERE id = campaign_id
            AND user_id = auth.uid()
        )
    );

-- Grants
GRANT ALL ON public.product_campaigns TO anon;
GRANT ALL ON public.product_campaigns TO authenticated;
GRANT ALL ON public.campaign_backings TO anon;
GRANT ALL ON public.campaign_backings TO authenticated;
GRANT ALL ON public.campaign_updates TO anon;
GRANT ALL ON public.campaign_updates TO authenticated;
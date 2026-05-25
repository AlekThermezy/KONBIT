-- =====================================================
-- KONBIT VERIFICATION SCHEDULING ENGINE
-- Scheduled inspections by tier cadence
-- Businesses don't request — KONBIT schedules proactively
-- =====================================================

-- =====================================================
-- VERIFICATION SCHEDULE TRACKER
-- Tracks next inspection date per business by tier
-- =====================================================
CREATE TABLE public.verification_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) UNIQUE,
    tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'verified', 'growth', 'anchor'
    inspection_frequency_days INTEGER DEFAULT 0, -- 0=never, 30=monthly, 15=twice monthly, 7=weekly
    inspections_per_month INTEGER DEFAULT 0,
    last_inspection_at TIMESTAMP WITH TIME ZONE,
    next_inspection_at TIMESTAMP WITH TIME ZONE,
    inspection_window_start TIMESTAMP WITH TIME ZONE, -- "we'll come within this window"
    inspection_window_end TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active', -- 'active', 'paused', 'cancelled'
    auto_schedule BOOLEAN DEFAULT true, -- true = KONBIT schedules automatically
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SCHEDULED INSPECTION JOBS (auto-generated)
-- =====================================================
CREATE TABLE public.scheduled_inspections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id),
    schedule_id UUID REFERENCES public.verification_schedules(id),
    inspector_id UUID REFERENCES public.inspectors(id),
    job_id UUID REFERENCES public.inspection_jobs(id), -- links to actual inspection job
    scheduled_date DATE NOT NULL, -- the target inspection date
    window_start TIMESTAMP WITH TIME ZONE, -- business told: "we'll visit between X and Y"
    window_end TIMESTAMP WITH TIME ZONE,
    notified_at TIMESTAMP WITH TIME ZONE, -- when business was notified
    notified_via TEXT[], -- ['email', 'whatsapp', 'sms']
    inspector_assigned_at TIMESTAMP WITH TIME ZONE,
    actual_inspection_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending', -- 'pending', 'notified', 'assigned', 'completed', 'missed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VERIFICATION BADGES (public-facing trust signal)
-- =====================================================
CREATE TABLE public.verification_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) UNIQUE,
    badge_level TEXT DEFAULT 'none', -- 'none', 'verified', 'growth', 'anchor', 'accredited'
    first_verified_at TIMESTAMP WITH TIME ZONE,
    last_verified_at TIMESTAMP WITH TIME ZONE,
    total_inspections INTEGER DEFAULT 0,
    inspection_streak INTEGER DEFAULT 0, -- consecutive on-time inspections
    avg_rating DECIMAL(3,2) DEFAULT 0, -- average inspection rating
    reports_count INTEGER DEFAULT 0,
    is_current BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS (business-facing alerts)
-- =====================================================
CREATE TABLE public.business_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id),
    notification_type TEXT NOT NULL, -- 'inspection_scheduled', 'inspection_tomorrow', 'inspection_today', 'report_ready', 'badge_updated'
    title TEXT NOT NULL,
    message TEXT,
    via TEXT[], -- ['email', 'whatsapp', 'sms', 'in_app']
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}', -- extra data (inspector name, date, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TIER CONFIGURATION (settings per tier)
-- =====================================================
CREATE TABLE public.inspection_tiers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tier_name TEXT UNIQUE NOT NULL, -- 'free', 'verified', 'growth', 'anchor'
    display_name TEXT NOT NULL,
    inspections_per_month INTEGER NOT NULL,
    inspection_frequency_days INTEGER NOT NULL, -- derived from inspections_per_month
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.verification_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_tiers ENABLE ROW LEVEL SECURITY;

-- Businesses can view their own schedule and notifications
CREATE POLICY "Businesses view own schedules" ON public.verification_schedules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = verification_schedules.business_id
            AND businesses.owner_id = auth.uid()
        )
    );

CREATE POLICY "Businesses update own schedules" ON public.verification_schedules
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = verification_schedules.business_id
            AND businesses.owner_id = auth.uid()
        )
    );

CREATE POLICY "Businesses view own scheduled inspections" ON public.scheduled_inspections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = scheduled_inspections.business_id
            AND businesses.owner_id = auth.uid()
        )
    );

CREATE POLICY "Businesses view own badges" ON public.verification_badges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = verification_badges.business_id
            AND businesses.owner_id = auth.uid()
        )
    );

CREATE POLICY "Businesses view own notifications" ON public.business_notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_notifications.business_id
            AND businesses.owner_id = auth.uid()
        )
    );

-- Public can view verified badges (for trust display)
CREATE POLICY "Anyone can view current badge" ON public.verification_badges
    FOR SELECT USING (is_current = true);

-- Admin manages everything
CREATE POLICY "Admins manage verification system" ON public.verification_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_role = 'admin'
        )
    );

CREATE POLICY "Admins manage scheduled inspections" ON public.scheduled_inspections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_role = 'admin'
        )
    );

CREATE POLICY "Admins manage badges" ON public.verification_badges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_role = 'admin'
        )
    );

CREATE POLICY "Admins manage notifications" ON public.business_notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_role = 'admin'
        )
    );

-- Inspectors can view their assigned inspections
CREATE POLICY "Inspectors view own jobs" ON public.scheduled_inspections
    FOR SELECT USING (auth.uid() = inspector_id);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_schedules_business ON public.verification_schedules(business_id);
CREATE INDEX idx_schedules_next_inspection ON public.verification_schedules(next_inspection_at) WHERE status = 'active';
CREATE INDEX idx_schedules_tier ON public.verification_schedules(tier);

CREATE INDEX idx_scheduled_date ON public.scheduled_inspections(scheduled_date);
CREATE INDEX idx_scheduled_business ON public.scheduled_inspections(business_id);
CREATE INDEX idx_scheduled_status ON public.scheduled_inspections(status);
CREATE INDEX idx_scheduled_inspector ON public.scheduled_inspections(inspector_id);

CREATE INDEX idx_badges_business ON public.verification_badges(business_id);
CREATE INDEX idx_badges_level ON public.verification_badges(badge_level) WHERE is_current = true;

CREATE INDEX idx_notifications_business ON public.business_notifications(business_id);
CREATE INDEX idx_notifications_type ON public.business_notifications(notification_type);
CREATE INDEX idx_notifications_unread ON public.business_notifications(created_at) WHERE read_at IS NULL;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-calculate next inspection date based on tier cadence
CREATE OR REPLACE FUNCTION calculate_next_inspection()
RETURNS TRIGGER AS $$
DECLARE
    cadence_days INTEGER;
BEGIN
    SELECT inspections_per_month INTO cadence_days
    FROM public.inspection_tiers
    WHERE tier_name = NEW.tier;
    
    IF cadence_days > 0 THEN
        NEW.next_inspection_at = NOW() + (cadence_days || ' days')::INTERVAL;
        NEW.inspection_window_start = NEW.next_inspection_at - INTERVAL '2 days';
        NEW.inspection_window_end = NEW.next_inspection_at + INTERVAL '2 days';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_next_inspection_trigger
    BEFORE INSERT OR UPDATE ON public.verification_schedules
    FOR EACH ROW EXECUTE FUNCTION calculate_next_inspection();

-- Create scheduled inspection job when schedule is created/updated
CREATE OR REPLACE FUNCTION create_scheduled_inspection_job()
RETURNS TRIGGER AS $$
DECLARE
    new_job_id UUID;
    window_start TIMESTAMP;
    window_end TIMESTAMP;
BEGIN
    IF NEW.auto_schedule = true AND NEW.tier != 'free' AND NEW.next_inspection_at IS NOT NULL THEN
        window_start = NEW.next_inspection_at - INTERVAL '2 days';
        window_end = NEW.next_inspection_at + INTERVAL '2 days';
        
        INSERT INTO public.inspection_jobs (
            business_id,
            job_type,
            description,
            instructions,
            payment_cents,
            location_name,
            status,
            expires_at
        ) VALUES (
            NEW.business_id,
            'verification_visit',
            'Unannounced KONBIT verification visit',
            '["Arrive unannounced", "Video walkthrough of business", "Rate condition 1-5", "Take photos", "Submit report same day"]',
            2500,
            (SELECT city FROM public.businesses WHERE id = NEW.business_id),
            'open',
            window_end
        ) RETURNING id INTO new_job_id;
        
        INSERT INTO public.scheduled_inspections (
            business_id,
            schedule_id,
            job_id,
            scheduled_date,
            window_start,
            window_end,
            status
        ) VALUES (
            NEW.business_id,
            NEW.id,
            new_job_id,
            NEW.next_inspection_at::DATE,
            window_start,
            window_end,
            'pending'
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_create_inspection_job
    AFTER INSERT ON public.verification_schedules
    FOR EACH ROW EXECUTE FUNCTION create_scheduled_inspection_job();

-- Update badge when inspection is completed
CREATE OR REPLACE FUNCTION update_badge_on_inspection_complete()
RETURNS TRIGGER AS $$
DECLARE
    inspection_rating INTEGER;
BEGIN
    -- Get the rating from the report
    SELECT rating INTO inspection_rating
    FROM public.inspection_reports
    WHERE assignment_id = NEW.id;
    
    -- Upsert the badge
    INSERT INTO public.verification_badges (business_id, badge_level, first_verified_at, last_verified_at, total_inspections, avg_rating, reports_count, is_current)
    VALUES (
        (SELECT business_id FROM public.inspection_jobs WHERE id = NEW.job_id),
        (SELECT tier FROM public.verification_schedules WHERE business_id = (SELECT business_id FROM public.inspection_jobs WHERE id = NEW.job_id)),
        NOW(),
        NOW(),
        1,
        inspection_rating::DECIMAL,
        1,
        true
    )
    ON CONFLICT (business_id) DO UPDATE SET
        last_verified_at = NOW(),
        total_inspections = verification_badges.total_inspections + 1,
        avg_rating = (verification_badges.avg_rating * verification_badges.total_inspections + inspection_rating) / (verification_badges.total_inspections + 1),
        reports_count = verification_badges.reports_count + 1,
        is_current = true;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER badge_update_on_complete
    AFTER UPDATE OF status ON public.inspection_assignments
    FOR EACH ROW
    WHEN (NEW.status = 'approved')
    EXECUTE FUNCTION update_badge_on_inspection_complete();

-- =====================================================
-- SEED TIER CONFIGURATION
-- =====================================================

INSERT INTO public.inspection_tiers (tier_name, display_name, inspections_per_month, inspection_frequency_days) VALUES
    ('free', 'Free', 0, 0),
    ('verified', 'Verified', 1, 30),
    ('growth', 'Growth', 2, 15),
    ('anchor', 'Anchor', 4, 7);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.verification_badges TO anon;
GRANT SELECT ON public.inspection_tiers TO anon;

GRANT ALL ON public.verification_schedules TO authenticated;
GRANT ALL ON public.scheduled_inspections TO authenticated;
GRANT ALL ON public.verification_badges TO authenticated;
GRANT ALL ON public.business_notifications TO authenticated;
GRANT ALL ON public.inspection_tiers TO authenticated;

GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- =====================================================
-- Done!
-- =====================================================
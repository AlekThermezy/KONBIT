-- =====================================================
-- KONBIT INSPECTOR / ACCREDITOR SYSTEM
-- Trust Infrastructure — Video Verification + Payments
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- INSPECTORS (Community Verifiers)
-- =====================================================
CREATE TABLE public.inspectors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    full_name TEXT NOT NULL,
    phone TEXT,
    location_city TEXT,
    location_department TEXT, -- Haiti departments: Ouest, Nord, Sud, etc.
    expertise TEXT[] DEFAULT '{}', -- 'food', 'real_estate', 'music', 'art', 'business', 'logistics'
    proximity_radius_km INTEGER DEFAULT 25, -- how far they'll travel
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    total_inspections INTEGER DEFAULT 0,
    earnings_balance_cents INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT false, -- approved by admin
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSPECTION JOBS (Tasks sent to inspectors)
-- =====================================================
CREATE TABLE public.inspection_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id),
    job_type TEXT NOT NULL, -- 'food_review', 'company_visit', 'delivery_verify', 'quality_check', 'compliance'
    description TEXT NOT NULL,
    instructions TEXT, -- what inspector must verify
    payment_cents INTEGER NOT NULL, -- what inspector earns
    business_lat DECIMAL(10,8),
    business_lng DECIMAL(11,8),
    location_name TEXT,
    expires_at TIMESTAMP WITH TIME ZONE, -- deadline to complete
    priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    status TEXT DEFAULT 'open', -- 'open', 'assigned', 'in_progress', 'submitted', 'approved', 'rejected', 'paid', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSPECTION ASSIGNMENTS (Inspector → Job)
-- =====================================================
CREATE TABLE public.inspection_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.inspection_jobs(id),
    inspector_id UUID REFERENCES public.inspectors(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'assigned', -- 'assigned', 'in_progress', 'submitted', 'approved', 'rejected'
    notes TEXT,
    -- Payment tracking
    payout_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'failed'
    payout_amount_cents INTEGER,
    paid_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(job_id, inspector_id)
);

-- =====================================================
-- INSPECTION REPORTS (Video + Evidence)
-- =====================================================
CREATE TABLE public.inspection_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id UUID REFERENCES public.inspection_assignments(id),
    video_url TEXT, -- uploaded video file URL
    video_thumbnail_url TEXT,
    video_duration_seconds INTEGER,
    report_text TEXT, -- inspector's written summary
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- business rating 1-5
    findings JSONB DEFAULT '{}', -- structured findings: {food_quality, cleanliness, staff, etc.}
    photos TEXT[], -- additional photo URLs
    is_ai_processed BOOLEAN DEFAULT false,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BUSINESS SUBMISSIONS (Receipts/Docs from businesses)
-- =====================================================
CREATE TABLE public.business_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.inspection_jobs(id),
    business_id UUID REFERENCES public.businesses(id),
    submission_type TEXT NOT NULL, -- 'receipt', 'invoice', 'photo', 'document', 'update'
    file_url TEXT,
    file_name TEXT,
    description TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PAYMENT DISBURSEMENTS (Tracker — payout method TBD)
-- =====================================================
CREATE TABLE public.inspector_payouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inspector_id UUID REFERENCES public.inspectors(id),
    assignment_id UUID REFERENCES public.inspection_assignments(id),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    payout_method TEXT, -- 'mobile_money', 'bank_transfer', 'crypto', 'payapp', NULL (TBD)
    payout_address TEXT, -- phone number, account, wallet
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    external_ref TEXT -- payment processor reference
);

-- =====================================================
-- INSPECTOR RATINGS (Post-job ratings)
-- =====================================================
CREATE TABLE public.inspector_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inspector_id UUID REFERENCES public.inspectors(id),
    assignment_id UUID REFERENCES public.inspection_assignments(id),
    job_id UUID REFERENCES public.inspection_jobs(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5), -- video quality
    timeliness_score INTEGER CHECK (timeliness_score >= 1 AND timeliness_score <= 5), -- on-time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assignment_id)
);

-- =====================================================
-- ADMIN JOB REVIEWS
-- =====================================================
CREATE TABLE public.admin_job_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.inspection_reports(id),
    reviewer_id UUID REFERENCES public.users(id),
    decision TEXT NOT NULL, -- 'approved', 'rejected', 'request_resubmit'
    decision_notes TEXT,
    inspector_paid BOOLEAN DEFAULT false,
    payment_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.inspectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspector_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspector_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_job_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view open jobs (for inspectors to browse)
CREATE POLICY "Anyone can view open inspection jobs" ON public.inspection_jobs
    FOR SELECT USING (status = 'open');

-- Inspectors can view and update their own assignments
CREATE POLICY "Inspectors manage own assignments" ON public.inspection_assignments
    FOR ALL USING (auth.uid() = inspector_id);

-- Inspectors can create reports for their assignments
CREATE POLICY "Inspectors create own reports" ON public.inspection_reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.inspection_assignments
            WHERE inspection_assignments.id = inspection_reports.assignment_id
            AND inspection_assignments.inspector_id = auth.uid()
        )
    );

-- Businesses can manage their own submissions
CREATE POLICY "Businesses manage own submissions" ON public.business_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE businesses.id = business_submissions.business_id
            AND businesses.owner_id = auth.uid()
        )
    );

-- Admin only policies (service_role bypasses RLS)
CREATE POLICY "Admins manage inspectors" ON public.inspectors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_role = 'admin'
        )
    );

CREATE POLICY "Admins manage jobs" ON public.inspection_jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_role = 'admin'
        )
    );

CREATE POLICY "Admins review reports" ON public.inspection_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_role = 'admin'
        )
    );

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_inspectors_location ON public.inspectors(location_department);
CREATE INDEX idx_inspectors_available ON public.inspectors(is_available, is_active) WHERE is_available = true AND is_active = true;
CREATE INDEX idx_inspectors_expertise ON public.inspectors USING GIN(expertise);

CREATE INDEX idx_jobs_status ON public.inspection_jobs(status);
CREATE INDEX idx_jobs_business ON public.inspection_jobs(business_id);
CREATE INDEX idx_jobs_type ON public.inspection_jobs(job_type);
CREATE INDEX idx_jobs_priority ON public.inspection_jobs(priority) WHERE status = 'open';

CREATE INDEX idx_assignments_inspector ON public.inspection_assignments(inspector_id);
CREATE INDEX idx_assignments_job ON public.inspection_assignments(job_id);
CREATE INDEX idx_assignments_status ON public.inspection_assignments(status);

CREATE INDEX idx_reports_assignment ON public.inspection_reports(assignment_id);

CREATE INDEX idx_payouts_inspector ON public.inspector_payouts(inspector_id);
CREATE INDEX idx_payouts_status ON public.inspector_payouts(status);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update inspector rating when new rating comes in
CREATE OR REPLACE FUNCTION update_inspector_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.inspectors
    SET 
        rating_avg = (
            SELECT AVG(rating::DECIMAL) 
            FROM public.inspector_ratings 
            WHERE inspector_id = NEW.inspector_id
        ),
        rating_count = (
            SELECT COUNT(*) 
            FROM public.inspector_ratings 
            WHERE inspector_id = NEW.inspector_id
        ),
        total_inspections = (
            SELECT COUNT(*) 
            FROM public.inspection_assignments 
            WHERE inspector_id = NEW.inspector_id AND status = 'approved'
        )
    WHERE id = NEW.inspector_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inspector_rating_trigger
    AFTER INSERT ON public.inspector_ratings
    FOR EACH ROW EXECUTE FUNCTION update_inspector_rating();

-- Mark job as assigned when inspector accepts
CREATE OR REPLACE FUNCTION on_assignment_accepted()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'in_progress' THEN
        UPDATE public.inspection_jobs
        SET status = 'assigned'
        WHERE id = NEW.job_id;
        UPDATE public.inspection_assignments
        SET started_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER assignment_accepted_trigger
    AFTER UPDATE OF status ON public.inspection_assignments
    FOR EACH ROW EXECUTE FUNCTION on_assignment_accepted();

-- =====================================================
-- SAMPLE SEED DATA
-- =====================================================

-- Sample inspection jobs
INSERT INTO public.inspection_jobs (business_id, job_type, description, instructions, payment_cents, location_name, priority, status)
VALUES 
    ((SELECT id FROM public.businesses WHERE name = 'Sejour Haven' LIMIT 1),
     'company_visit',
     'Verify property condition and construction progress for Jacmel vacation rental',
     'Take video of property exterior/interior, verify construction status, check amenities, rate overall condition',
     3500,
     'Jacmel, Haiti',
     'high',
     'open'),
    ('00000000-0000-0000-0000-000000000001', -- placeholder
     'food_review',
     'Mystery diner review at Port-au-Prince restaurant — verify food quality, service, cleanliness',
     'Order and rate food quality (1-5), measure service speed, rate restaurant cleanliness, take video of dining experience',
     2500,
     'Port-au-Prince, Haiti',
     'normal',
     'open'),
    ('00000000-0000-0000-0000-000000000001',
     'delivery_verify',
     'Verify artisan batch delivery — count items, check condition, confirm receipt',
     'Count delivered items, check for damage, photograph packaging, confirm delivery completion',
     2000,
     'Delmas, Port-au-Prince',
     'urgent',
     'open');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON public.inspection_jobs TO anon;
GRANT INSERT ON public.inspection_assignments TO anon;
GRANT INSERT ON public.inspection_reports TO anon;
GRANT INSERT ON public.business_submissions TO anon;

GRANT ALL ON public.inspectors TO authenticated;
GRANT ALL ON public.inspection_jobs TO authenticated;
GRANT ALL ON public.inspection_assignments TO authenticated;
GRANT ALL ON public.inspection_reports TO authenticated;
GRANT ALL ON public.business_submissions TO authenticated;
GRANT ALL ON public.inspector_payouts TO authenticated;
GRANT ALL ON public.inspector_ratings TO authenticated;
GRANT ALL ON public.admin_job_reviews TO authenticated;

GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- =====================================================
-- Done!
-- =====================================================
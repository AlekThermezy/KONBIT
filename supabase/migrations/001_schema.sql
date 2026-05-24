-- =====================================================
-- KONBIT Database Schema
-- Haitian Diaspora Investment + Education Platform
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    country TEXT,
    city TEXT,
    is_instructor BOOLEAN DEFAULT false,
    instructor_tier TEXT DEFAULT 'new', -- 'new', 'active', 'top_rated', 'master'
    is_investor BOOLEAN DEFAULT false,
    investor_tier TEXT DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'anchor'
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WAITLIST
-- =====================================================
CREATE TABLE public.waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    interests TEXT[] DEFAULT '{}', -- 'invest', 'teach', 'learn', 'explore'
    country TEXT,
    source TEXT,
    newsletter BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COURSES (KONBIT LEARN)
-- =====================================================
CREATE TABLE public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    instructor_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'real_estate', 'music', 'art', 'food', 'tech', 'business', 'language', 'other'
    subcategory TEXT,
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    thumbnail_url TEXT,
    trailer_url TEXT,
    duration_minutes INTEGER,
    lessons_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LESSONS
-- =====================================================
CREATE TABLE public.lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    duration_minutes INTEGER,
    position INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENROLLMENTS
-- =====================================================
CREATE TABLE public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    course_id UUID REFERENCES public.courses(id),
    gifted_by UUID REFERENCES public.users(id),
    progress_percent INTEGER DEFAULT 0,
    last_lesson_id UUID,
    last_position_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- =====================================================
-- FLASHCARDS (Smart Learning)
-- =====================================================
CREATE TABLE public.flashcards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    course_id UUID REFERENCES public.courses(id),
    lesson_id UUID REFERENCES public.lessons(id),
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    next_review TIMESTAMP WITH TIME ZONE,
    ease_factor DECIMAL(3,2) DEFAULT 2.5,
    interval_days INTEGER DEFAULT 1,
    repetitions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CERTIFICATES
-- =====================================================
CREATE TABLE public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    course_id UUID REFERENCES public.courses(id),
    certificate_id TEXT UNIQUE NOT NULL, -- 'KONBIT-2026-XXXXX'
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- =====================================================
-- STREAKS
-- =====================================================
CREATE TABLE public.streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BUSINESSES (KONBIT GROWTH)
-- =====================================================
CREATE TABLE public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id),
    name TEXT NOT NULL,
    sector TEXT NOT NULL, -- 'real_estate', 'music', 'art', 'food'
    subsector TEXT,
    city TEXT,
    country TEXT DEFAULT 'HT',
    description TEXT,
    website TEXT,
    logo_url TEXT,
    photos TEXT[], -- Array of image URLs
    founded_year INTEGER,
    employee_count INTEGER,
    annual_revenue_usd INTEGER,
    stage TEXT DEFAULT 'startup', -- 'startup', 'growth', 'established', 'scale'
    is_verified BOOLEAN DEFAULT false,
    is_diaspora_connected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CAMPAIGNS (Investment Opportunities)
-- =====================================================
CREATE TABLE public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id),
    title TEXT NOT NULL,
    description TEXT,
    raise_goal_cents INTEGER NOT NULL,
    raised_cents INTEGER DEFAULT 0,
    token_price_cents INTEGER NOT NULL,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    token_type TEXT NOT NULL, -- 'revenue_share', 'equity', 'appreciation'
    revenue_share_pct INTEGER,
    equity_pct INTEGER,
    min_investment_cents INTEGER DEFAULT 2500,
    max_investment_cents INTEGER,
    investor_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'upcoming', -- 'upcoming', 'live', 'funded', 'closed'
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    contract_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INVESTMENTS
-- =====================================================
CREATE TABLE public.investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    campaign_id UUID REFERENCES public.campaigns(id),
    amount_cents INTEGER NOT NULL,
    token_amount INTEGER NOT NULL,
    tx_hash TEXT,
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, campaign_id)
);

-- =====================================================
-- GIFTS (Gift Model)
-- =====================================================
CREATE TABLE public.gifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    giver_id UUID REFERENCES public.users(id),
    recipient_email TEXT,
    recipient_name TEXT,
    course_id UUID REFERENCES public.courses(id),
    amount_cents INTEGER,
    message TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'redeemed'
    redeemed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DIASPORA CONNECTIONS (Networking)
-- =====================================================
CREATE TABLE public.connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    requester_id UUID REFERENCES public.users(id),
    recipient_id UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(requester_id, recipient_id)
);

-- =====================================================
-- SECTOR INSIGHTS (Business Intelligence)
-- =====================================================
CREATE TABLE public.sector_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sector TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value TEXT,
    metric_number INTEGER,
    source TEXT,
    year INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_insights ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published campaigns" ON public.campaigns
    FOR SELECT USING (status IN ('live', 'funded'));

CREATE POLICY "Anyone can view verified businesses" ON public.businesses
    FOR SELECT USING (is_verified = true);

CREATE POLICY "Anyone can join waitlist" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- Users can manage their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own enrollments" ON public.enrollments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own flashcards" ON public.flashcards
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own investments" ON public.investments
    FOR SELECT USING (auth.uid() = user_id);

-- Instructors can manage their courses
CREATE POLICY "Instructors can manage own courses" ON public.courses
    FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can manage own lessons" ON public.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = lessons.course_id
            AND courses.instructor_id = auth.uid()
        )
    );

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_published ON public.courses(is_published) WHERE is_published = true;

CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_business ON public.campaigns(business_id);

CREATE INDEX idx_investments_user ON public.investments(user_id);
CREATE INDEX idx_investments_campaign ON public.investments(campaign_id);

CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);

CREATE INDEX idx_businesses_sector ON public.businesses(sector);
CREATE INDEX idx_businesses_country ON public.businesses(country);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON public.businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate certificate ID
CREATE OR REPLACE FUNCTION generate_certificate_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.certificate_id = 'KONBIT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEW.id::TEXT, 5, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_certificate_id_trigger
    BEFORE INSERT ON public.certificates
    FOR EACH ROW EXECUTE FUNCTION generate_certificate_id();

-- =====================================================
-- SEED DATA (Sample)
-- =====================================================

-- Sample waitlist entry
INSERT INTO public.waitlist (email, name, interests, country, source)
VALUES 
    ('waitlist@konbit.com', 'Test User', ARRAY['invest', 'learn'], 'US', 'direct');

-- Sample instructor
INSERT INTO public.users (email, name, bio, country, city, is_instructor, instructor_tier)
VALUES 
    ('instructor@konbit.com', 'Marie D.', 'Professional stylist with 10+ years experience in Haitian fashion.', 'HT', 'Port-au-Prince', true, 'active');

-- Sample course
INSERT INTO public.courses (instructor_id, title, description, category, price_cents, duration_minutes, lessons_count, is_published)
VALUES 
    ((SELECT id FROM public.users WHERE email = 'instructor@konbit.com'), 
     'Professional Styling Masterclass', 
     'Learn professional styling techniques from Marie. Build your skills and your confidence.',
     'fashion', 
     4900, 
     480, 
     8, 
     true);

-- Sample business
INSERT INTO public.businesses (name, sector, city, country, description, stage, is_verified)
VALUES 
    ('Sejour Haven', 'real_estate', 'Jacmel', 'HT', 'Vacation rental property in the beautiful coastal town of Jacmel. Investment opportunity with 8% revenue share.', 'startup', true);

-- Sample campaign
INSERT INTO public.campaigns (business_id, title, description, raise_goal_cents, raised_cents, token_price_cents, token_name, token_symbol, token_type, revenue_share_pct, min_investment_cents, status, starts_at, ends_at)
VALUES 
    ((SELECT id FROM public.businesses WHERE name = 'Sejour Haven'),
     'Build Your Vacation Rental in Jacmel',
     'Fund the construction of our dream vacation property. Earn 8% revenue share on every booking.',
     7500000,
     4875000,
     2500,
     'Sejour Haven Revenue',
     'SJH',
     'revenue_share',
     8,
     2500,
     'live',
     NOW(),
     NOW() + INTERVAL '30 days');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON public.waitlist TO anon;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.courses TO anon;
GRANT ALL ON public.lessons TO anon;
GRANT ALL ON public.enrollments TO anon;
GRANT ALL ON public.flashcards TO anon;
GRANT ALL ON public.certificates TO anon;
GRANT ALL ON public.streaks TO anon;
GRANT ALL ON public.businesses TO anon;
GRANT ALL ON public.campaigns TO anon;
GRANT ALL ON public.investments TO anon;
GRANT ALL ON public.gifts TO anon;
GRANT ALL ON public.connections TO anon;
GRANT ALL ON public.sector_insights TO anon;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- =====================================================
-- Done!
-- =====================================================
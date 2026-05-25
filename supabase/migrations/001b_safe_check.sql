-- =====================================================
-- KONBIT MIGRATION 001b — Safe Table Checker
-- Creates only tables that don't exist yet
-- Run AFTER 001_schema.sql partially failed
-- =====================================================

BEGIN;

-- Check and create USERS (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    country TEXT,
    city TEXT,
    is_instructor BOOLEAN DEFAULT false,
    instructor_tier TEXT DEFAULT 'new',
    is_investor BOOLEAN DEFAULT false,
    investor_tier TEXT DEFAULT 'bronze',
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check and create WAITLIST
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    interests TEXT[] DEFAULT '{}',
    country TEXT,
    source TEXT,
    newsletter BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check and create COURSES
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    instructor_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
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

-- Check and create LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
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

-- Check and create ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
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

-- Check and create FLASHCARDS
CREATE TABLE IF NOT EXISTS public.flashcards (
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

-- Check and create CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    course_id UUID REFERENCES public.courses(id),
    certificate_id TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Check and create STREAKS
CREATE TABLE IF NOT EXISTS public.streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check and create BUSINESSES
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id),
    name TEXT NOT NULL,
    sector TEXT NOT NULL,
    subsector TEXT,
    city TEXT,
    country TEXT DEFAULT 'HT',
    description TEXT,
    website TEXT,
    logo_url TEXT,
    photos TEXT[],
    founded_year INTEGER,
    employee_count INTEGER,
    annual_revenue_usd INTEGER,
    stage TEXT DEFAULT 'startup',
    is_verified BOOLEAN DEFAULT false,
    is_diaspora_connected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check and create CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id),
    title TEXT NOT NULL,
    description TEXT,
    raise_goal_cents INTEGER NOT NULL,
    raised_cents INTEGER DEFAULT 0,
    token_price_cents INTEGER NOT NULL,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    token_type TEXT NOT NULL,
    revenue_share_pct INTEGER,
    equity_pct INTEGER,
    min_investment_cents INTEGER DEFAULT 2500,
    max_investment_cents INTEGER,
    investor_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'upcoming',
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    contract_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check and create INVESTMENTS
CREATE TABLE IF NOT EXISTS public.investments (
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

-- Check and create GIFTS
CREATE TABLE IF NOT EXISTS public.gifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    giver_id UUID REFERENCES public.users(id),
    recipient_email TEXT,
    recipient_name TEXT,
    course_id UUID REFERENCES public.courses(id),
    amount_cents INTEGER,
    message TEXT,
    status TEXT DEFAULT 'pending',
    redeemed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check and create CONNECTIONS
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    requester_id UUID REFERENCES public.users(id),
    recipient_id UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'pending',
    connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(requester_id, recipient_id)
);

-- Check and create SECTOR_INSIGHTS
CREATE TABLE IF NOT EXISTS public.sector_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sector TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value TEXT,
    metric_number INTEGER,
    source TEXT,
    year INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (will fail gracefully if already enabled)
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

COMMIT;

-- =====================================================
-- VERIFY: Run this to check which tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- =====================================================
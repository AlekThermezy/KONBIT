-- =====================================================
-- KREYÒL DICTIONARY — Migration 004
-- =====================================================

BEGIN;

-- =====================================================
-- Dictionary words table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.dictionary_words (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- The word itself
    word TEXT NOT NULL,
    word_creole TEXT NOT NULL,  -- in Haitian Creole (may differ from 'word' if French-based)
    pronunciation TEXT,         -- phonetic guide
    
    -- Translations
    translation_english TEXT NOT NULL,
    translation_french TEXT,
    translation_spanish TEXT,
    
    -- Grammar & context
    part_of_speech TEXT CHECK (part_of_speech IN (
        'noun', 'verb', 'adj', 'adverb', 'pronoun', 
        'preposition', 'conjunction', 'interjection', 
        'phrase', 'expression', 'idiom'
    )),
    gender TEXT CHECK (gender IN ('m', 'f', 'mf')),  -- masculine/feminine
    
    -- Usage
    example_sentence TEXT,
    example_translation TEXT,
    synonyms TEXT[],
    antonyms TEXT[],
    
    -- Categorization
    category TEXT CHECK (category IN (
        'everyday', 'food', 'business', 'travel', 
        'family', 'health', 'education', 'nature',
        'numbers', 'time', 'colors', 'emotions',
        'greetings', 'questions', 'commands', 'slang'
    )),
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN (
        'beginner', 'intermediate', 'advanced'
    )),
    tags TEXT[],
    
    -- Audio (future)
    audio_url TEXT,
    
    -- Meta
    day_added INTEGER DEFAULT 1,  -- which day batch (1=first 50, 2=second 50, etc.)
    added_by TEXT DEFAULT 'konbit',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dict_word ON public.dictionary_words(LOWER(word));
CREATE INDEX IF NOT EXISTS idx_dict_category ON public.dictionary_words(category);
CREATE INDEX IF NOT EXISTS idx_dict_difficulty ON public.dictionary_words(difficulty);
CREATE INDEX IF NOT EXISTS idx_dict_pos ON public.dictionary_words(part_of_speech);
CREATE INDEX IF NOT EXISTS idx_dict_day ON public.dictionary_words(day_added);

-- Full text search
CREATE INDEX IF NOT EXISTS idx_dict_fts ON public.dictionary_words
    USING gin(to_tsvector('french', word || ' ' || COALESCE(translation_english, '') || ' ' || COALESCE(example_sentence, '')));

-- =====================================================
-- User dictionary (saved words per user)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_dictionary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    word_id UUID REFERENCES public.dictionary_words(id) ON DELETE CASCADE,
    
    -- User's personal data
    personal_note TEXT,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),  -- 0=new, 5=mastered
    
    -- Spaced repetition fields
    last_reviewed TIMESTAMP WITH TIME ZONE,
    next_review TIMESTAMP WITH TIME ZONE,
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_user_dict_user ON public.user_dictionary(user_id);
CREATE INDEX IF NOT EXISTS idx_user_dict_next_review ON public.user_dictionary(next_review)
    WHERE next_review IS NOT NULL;

-- =====================================================
-- Daily word streak (user engagement)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.dictionary_streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    words_learned_today INTEGER DEFAULT 0,
    words_learned_total INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_streak_user ON public.dictionary_streaks(user_id);

-- =====================================================
-- RLS Policies
-- =====================================================
ALTER TABLE public.dictionary_words ENABLE ROW LEVEL SECURITY;

-- Anyone can read dictionary
CREATE POLICY "Anyone can read dictionary"
    ON public.dictionary_words FOR SELECT USING (true);

-- Only admins can insert/update
CREATE POLICY "Admins can manage dictionary"
    ON public.dictionary_words FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.user_role = 'admin'
        )
    );

ALTER TABLE public.user_dictionary ENABLE ROW LEVEL SECURITY;

-- Users manage own saved words
CREATE POLICY "Users manage own dictionary"
    ON public.user_dictionary FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.dictionary_streaks ENABLE ROW LEVEL SECURITY;

-- Users manage own streak
CREATE POLICY "Users manage own streak"
    ON public.dictionary_streaks FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- Grants
-- =====================================================
GRANT SELECT ON public.dictionary_words TO anon;
GRANT SELECT ON public.dictionary_words TO authenticated;
GRANT ALL ON public.user_dictionary TO authenticated;
GRANT ALL ON public.dictionary_streaks TO authenticated;

COMMIT;

-- =====================================================
-- VERIFY:
-- SELECT count(*) from dictionary_words;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'dictionary_words';
-- =====================================================
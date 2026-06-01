-- =====================================================
-- ASK HAITI — Document Intelligence System
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── DOCUMENTS ─────────────────────────────────────────
-- Source documents: PDFs, web pages, official reports
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    source_name TEXT NOT NULL,  -- 'World Bank', 'PAHO', 'Gouv HT', etc.
    source_type TEXT NOT NULL,  -- 'government', 'institution', 'ngo', 'archive'
    category TEXT NOT NULL,     -- 'legal', 'health', 'business', 'cultural', 'constitution'
    subcategory TEXT,
    language TEXT DEFAULT 'fr', -- 'fr', 'en', 'ht', 'es'
    file_url TEXT,               -- direct download link for PDFs
    file_type TEXT,              -- 'pdf', 'html', 'doc', 'url'
    file_size_kb INTEGER,
    is_indexed BOOLEAN DEFAULT false,
    is_parsed BOOLEAN DEFAULT false,
    trust_tier TEXT DEFAULT 'medium', -- 'high', 'medium', 'low'
    publication_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.documents TO anon;
GRANT ALL ON public.documents TO authenticated;

-- Full-text search on documents
CREATE INDEX IF NOT EXISTS idx_documents_fts ON public.documents
    USING gin(to_tsvector('french', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(source_name, '')));
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_source ON public.documents(source_name);

-- ── DOCUMENT CHUNKS ───────────────────────────────────
-- Parsed + chunked content from documents
-- For RAG: we embed chunks, not whole documents
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,     -- order within document
    char_start INTEGER,
    char_end INTEGER,
    page_number INTEGER,
    source_segment TEXT,              -- original text snippet for citation
    embedding_status TEXT DEFAULT 'pending', -- 'pending', 'embedded', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.document_chunks TO anon;
GRANT ALL ON public.document_chunks TO authenticated;

CREATE INDEX IF NOT EXISTS idx_chunks_doc ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding_status ON public.document_chunks(embedding_status);

-- ── CHAT SESSIONS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    title TEXT DEFAULT 'New conversation',
    category TEXT,                    -- filter sessions by topic
    message_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.chat_sessions TO authenticated;
GRANT SELECT ON public.chat_sessions TO anon;

-- ── CHAT MESSAGES ─────────────────────────────────────
-- Each message stores its retrieved context for citation
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,              -- 'user', 'assistant'
    content TEXT NOT NULL,
    -- RAG context: which chunks were used to answer
    context_doc_ids UUID[] DEFAULT '{}',  -- document IDs used
    context_chunk_ids UUID[] DEFAULT '{}', -- chunk IDs used
    context_excerpts TEXT[] DEFAULT '{}',  -- quoted text for citations
    citations TEXT[],                 -- formatted citation strings
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT SELECT ON public.chat_messages TO anon;

CREATE INDEX IF NOT EXISTS idx_messages_session ON public.chat_messages(session_id);

-- ── INGESTION LOG ─────────────────────────────────────
-- Track what's been ingested and what failed
CREATE TABLE IF NOT EXISTS public.ingestion_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id),
    status TEXT NOT NULL,            -- 'downloading', 'parsing', 'chunking', 'embedding', 'done', 'failed'
    error_message TEXT,
    chunks_created INTEGER DEFAULT 0,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ingestion_log ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.ingestion_log TO authenticated;
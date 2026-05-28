-- lita_responses: tracks Lita card responses
CREATE TABLE IF NOT EXISTS lita_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Lita',
  choice TEXT NOT NULL,
  city TEXT,
  country TEXT,
  responded_at TIMESTAMPTZ DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE
);

-- Auto-delete after 45 minutes via cron
-- Run: SELECT cron.schedule('lita_delete', '*/45 * * * *', $$DELETE FROM lita_responses WHERE responded_at < NOW() - INTERVAL '45 minutes'$$);

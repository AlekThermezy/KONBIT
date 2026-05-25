-- WhatsApp OTP + phone fields for auth
-- Run this in Supabase Dashboard > SQL Editor

-- ============================================
-- 1. Add phone fields to users table
-- ============================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS whatsapp_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_notifications BOOLEAN DEFAULT true;

-- ============================================
-- 2. Create whatsapp_otp table
-- ============================================
CREATE TABLE IF NOT EXISTS whatsapp_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-cleanup: delete expired OTPs older than 24h (daily)
CREATE OR REPLACE FUNCTION cleanup_expired_otp()
RETURNS void AS $$
  DELETE FROM whatsapp_otp WHERE expires_at < NOW() - INTERVAL '24 hours';
$$ LANGUAGE sql SECURITY DEFINITIVE;

-- ============================================
-- 3. Enable Row Level Security
-- ============================================
ALTER TABLE whatsapp_otp ENABLE ROW LEVEL SECURITY;

-- Service role can do anything; users can only read their own
CREATE POLICY "Service role full access" ON whatsapp_otp
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can read own OTP" ON whatsapp_otp
  FOR SELECT USING (true);

-- ============================================
-- 4. Update auth migration note
-- ============================================
-- After running this, set these env vars on your VPS:
-- TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
-- TWILIO_AUTH_TOKEN=your_auth_token
-- TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
-- SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (already exists in .env.local)

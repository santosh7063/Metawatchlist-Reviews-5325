import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wfkltebrytkklnxjgosd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma2x0ZWJyeXRra2xueGpnb3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Mzc5MDEsImV4cCI6MjA2NzMxMzkwMX0.TA_s9LBwz0bhojlWe6Iy3ST2z_TWSLYuM8h-Wmqwm80'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'meta-watchlist'
    }
  }
})

export default supabase
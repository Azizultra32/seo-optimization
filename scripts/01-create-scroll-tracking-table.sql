-- ============================================
-- CREATE SCROLL TRACKING TABLE
-- Run this script in Supabase SQL Editor
-- ============================================

-- Create scroll tracking table
CREATE TABLE IF NOT EXISTS public.scroll_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  page_url TEXT NOT NULL,
  max_scroll_percentage INT,
  time_on_page INT, -- seconds
  session_id UUID
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scroll_tracking_url ON public.scroll_tracking(page_url);
CREATE INDEX IF NOT EXISTS idx_scroll_tracking_created ON public.scroll_tracking(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.scroll_tracking ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT scroll tracking data
DROP POLICY IF EXISTS "anon can insert scroll" ON public.scroll_tracking;
CREATE POLICY "anon can insert scroll"
  ON public.scroll_tracking
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Service role has full access
DROP POLICY IF EXISTS "service role full access scroll" ON public.scroll_tracking;
CREATE POLICY "service role full access scroll"
  ON public.scroll_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Force PostgREST to reload schema
SELECT pg_notify('pgrst', 'reload schema');

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE '✅ Scroll tracking table created successfully!';
  RAISE NOTICE '📊 Table: scroll_tracking with proper RLS policies';
END $$;

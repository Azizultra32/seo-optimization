-- ============================================
-- HARVEST STUDIO DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- ANALYTICS TABLES (Step 3)
-- ============================================

-- Using optimized analytics_events table with proper RLS
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id UUID,
  path TEXT NOT NULL,
  referrer TEXT,
  event TEXT NOT NULL,         -- e.g. 'page_view', 'cta_click'
  meta JSONB DEFAULT '{}'::jsonb, -- flexible payload (utm, etc.)
  user_agent TEXT,
  ip INET
);

-- Helpful indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_path ON public.analytics_events (path);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON public.analytics_events (event);

-- Lightweight sessions table
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_path TEXT,
  last_path TEXT,
  referrer TEXT,
  ua_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.analytics_sessions (created_at DESC);

-- Page performance metrics
CREATE TABLE IF NOT EXISTS public.page_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  page_url TEXT NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10, 2),
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_page_performance_url ON public.page_performance(page_url);
CREATE INDEX IF NOT EXISTS idx_page_performance_metric ON public.page_performance(metric_name);
CREATE INDEX IF NOT EXISTS idx_page_performance_created ON public.page_performance(created_at DESC);

-- Scroll depth tracking
CREATE TABLE IF NOT EXISTS public.scroll_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  page_url TEXT NOT NULL,
  max_scroll_percentage INT,
  time_on_page INT, -- seconds
  session_id UUID
);

CREATE INDEX IF NOT EXISTS idx_scroll_tracking_url ON public.scroll_tracking(page_url);
CREATE INDEX IF NOT EXISTS idx_scroll_tracking_created ON public.scroll_tracking(created_at DESC);

-- ============================================
-- CONTENT GENERATION TABLES (Step 2)
-- ============================================

CREATE TABLE IF NOT EXISTS public.generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_type VARCHAR(50) NOT NULL, -- 'blog', 'case_study', 'product_update', 'press_release'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  keywords TEXT[],
  internal_links JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'review', 'published', 'archived'
  published_at TIMESTAMPTZ,
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_generated_content_type ON public.generated_content(content_type);
CREATE INDEX IF NOT EXISTS idx_generated_content_status ON public.generated_content(status);
CREATE INDEX IF NOT EXISTS idx_generated_content_published ON public.generated_content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_content_created ON public.generated_content(created_at DESC);

-- ============================================
-- IMPROVE EXISTING TABLES (if they exist)
-- ============================================

-- Add audit columns to ai_recommendations if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='ai_recommendations') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='ai_recommendations' AND column_name='updated_at') THEN
      ALTER TABLE public.ai_recommendations ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='ai_recommendations' AND column_name='approved_by') THEN
      ALTER TABLE public.ai_recommendations ADD COLUMN approved_by VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='ai_recommendations' AND column_name='status') THEN
      ALTER TABLE public.ai_recommendations ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
    END IF;
  END IF;
END $$;

-- ============================================
-- ROW LEVEL SECURITY (P0 Fix)
-- ============================================

-- Enable RLS on analytics tables with anon insert-only policy
ALTER TABLE IF EXISTS public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.page_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scroll_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.generated_content ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT analytics data only (no read/update/delete)
DROP POLICY IF EXISTS "anon can insert events" ON public.analytics_events;
CREATE POLICY "anon can insert events"
  ON public.analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon can insert sessions" ON public.analytics_sessions;
CREATE POLICY "anon can insert sessions"
  ON public.analytics_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon can insert performance" ON public.page_performance;
CREATE POLICY "anon can insert performance"
  ON public.page_performance
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon can insert scroll" ON public.scroll_tracking;
CREATE POLICY "anon can insert scroll"
  ON public.scroll_tracking
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Service role has full access to everything
DROP POLICY IF EXISTS "service role full access events" ON public.analytics_events;
CREATE POLICY "service role full access events"
  ON public.analytics_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access sessions" ON public.analytics_sessions;
CREATE POLICY "service role full access sessions"
  ON public.analytics_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access performance" ON public.page_performance;
CREATE POLICY "service role full access performance"
  ON public.page_performance
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access scroll" ON public.scroll_tracking;
CREATE POLICY "service role full access scroll"
  ON public.scroll_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access content" ON public.generated_content;
CREATE POLICY "service role full access content"
  ON public.generated_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Enable RLS on existing SEO tables if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='ai_recommendations') THEN
    ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "service role full access recommendations" ON public.ai_recommendations;
    CREATE POLICY "service role full access recommendations"
      ON public.ai_recommendations
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='page_metrics') THEN
    ALTER TABLE public.page_metrics ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "service role full access metrics" ON public.page_metrics;
    CREATE POLICY "service role full access metrics"
      ON public.page_metrics
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================
-- RELOAD SCHEMA CACHE
-- ============================================

-- Force PostgREST to reload schema immediately
SELECT pg_notify('pgrst', 'reload schema');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete! All tables created successfully.';
  RAISE NOTICE '📊 Analytics tables: analytics_events, analytics_sessions, page_performance, scroll_tracking';
  RAISE NOTICE '📝 Content tables: generated_content';
  RAISE NOTICE '🔒 RLS policies: Anonymous users can insert analytics, service role has full access';
END $$;

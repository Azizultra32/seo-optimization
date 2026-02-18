-- ============================================
-- HARVEST STUDIO DATABASE SETUP (ONE-PASS)
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- ANALYTICS TABLES
-- ============================================

-- Canonical analytics event schema used by API routes
DO $$
DECLARE
  relkind "char";
  legacy_name TEXT := 'analytics_events_legacy_' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISS');
BEGIN
  SELECT c.relkind INTO relkind
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname = 'analytics_events'
  LIMIT 1;

  IF relkind IS NULL THEN
    EXECUTE '
      CREATE TABLE public.analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        session_id UUID,
        event_type TEXT,
        event_name TEXT,
        page_url TEXT,
        referrer TEXT,
        metadata JSONB DEFAULT ''{}''::jsonb,
        user_agent TEXT
      )
    ';
  ELSIF relkind NOT IN ('r', 'p') THEN
    IF relkind = 'v' THEN
      EXECUTE format('ALTER VIEW public.analytics_events RENAME TO %I', legacy_name);
    ELSIF relkind = 'm' THEN
      EXECUTE format('ALTER MATERIALIZED VIEW public.analytics_events RENAME TO %I', legacy_name);
    ELSIF relkind = 'f' THEN
      EXECUTE format('ALTER FOREIGN TABLE public.analytics_events RENAME TO %I', legacy_name);
    ELSE
      EXECUTE format('ALTER TABLE public.analytics_events RENAME TO %I', legacy_name);
    END IF;

    EXECUTE '
      CREATE TABLE public.analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        session_id UUID,
        event_type TEXT,
        event_name TEXT,
        page_url TEXT,
        referrer TEXT,
        metadata JSONB DEFAULT ''{}''::jsonb,
        user_agent TEXT
      )
    ';
  END IF;
END $$;

-- Backward-compatible migration for older analytics_events schema
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'analytics_events'
      AND c.relkind IN ('r', 'p')
  ) THEN
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now()';
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS session_id UUID';
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS event_type TEXT';
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS event_name TEXT';
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS page_url TEXT';
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS referrer TEXT';
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT ''{}''::jsonb';
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS user_agent TEXT';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'analytics_events'
      AND c.relkind IN ('r', 'p')
  ) THEN
  -- Legacy column: event -> event_type/event_name
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'analytics_events' AND column_name = 'event'
  ) THEN
    EXECUTE '
      UPDATE public.analytics_events
      SET event_type = COALESCE(event_type, event),
          event_name = COALESCE(event_name, event)
      WHERE event IS NOT NULL
    ';
  END IF;

  -- Legacy column: path -> page_url
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'analytics_events' AND column_name = 'path'
  ) THEN
    EXECUTE '
      UPDATE public.analytics_events
      SET page_url = COALESCE(page_url, path)
      WHERE path IS NOT NULL
    ';
  END IF;

  -- Legacy column: meta -> metadata
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'analytics_events' AND column_name = 'meta'
  ) THEN
    EXECUTE '
      UPDATE public.analytics_events
      SET metadata = COALESCE(metadata, meta)
      WHERE meta IS NOT NULL
    ';
  END IF;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_url ON public.analytics_events (page_url);

-- Optional sessions table
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
  time_on_page INT,
  session_id UUID
);

CREATE INDEX IF NOT EXISTS idx_scroll_tracking_url ON public.scroll_tracking(page_url);
CREATE INDEX IF NOT EXISTS idx_scroll_tracking_created ON public.scroll_tracking(created_at DESC);

-- ============================================
-- CONTENT GENERATION TABLES (USED BY /api/content/*)
-- ============================================

CREATE TABLE IF NOT EXISTS public.content_drafts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  type TEXT NOT NULL CHECK (type IN ('blog', 'case_study', 'press_release', 'product_update')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
  keywords JSONB DEFAULT '[]'::jsonb,
  internal_links JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  author TEXT DEFAULT 'AI Assistant',
  reviewed_by TEXT,
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.content_templates (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.content_generation_log (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  content_id BIGINT REFERENCES public.content_drafts(id),
  prompt TEXT,
  model TEXT,
  tokens_used INTEGER,
  success BOOLEAN,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON public.content_drafts(status);
CREATE INDEX IF NOT EXISTS idx_content_drafts_type ON public.content_drafts(type);
CREATE INDEX IF NOT EXISTS idx_content_drafts_created_at ON public.content_drafts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_drafts_slug ON public.content_drafts(slug);
CREATE INDEX IF NOT EXISTS idx_content_templates_type ON public.content_templates(type);

-- Seed templates idempotently
INSERT INTO public.content_templates (type, name, prompt_template, variables)
SELECT
  'blog',
  'Healthcare AI Insights',
  'Write a professional blog post about {topic} in healthcare AI. Focus on practical applications and ethical considerations. Target audience: healthcare professionals and technology leaders. Include specific examples and current research. Length: 800-1000 words. Tone: Professional yet accessible.',
  '["topic"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_templates WHERE type = 'blog' AND name = 'Healthcare AI Insights'
);

INSERT INTO public.content_templates (type, name, prompt_template, variables)
SELECT
  'case_study',
  'Product Success Story',
  'Create a case study showcasing how {product_name} solved {problem} for healthcare providers. Include: Challenge, Solution, Results (with metrics), and Key Takeaways. Focus on real-world impact and measurable outcomes. Length: 600-800 words.',
  '["product_name", "problem"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_templates WHERE type = 'case_study' AND name = 'Product Success Story'
);

INSERT INTO public.content_templates (type, name, prompt_template, variables)
SELECT
  'press_release',
  'Product Launch',
  'Write a press release announcing {announcement}. Include: headline, dateline, lead paragraph with key facts, supporting quotes from Dr. Ali Ghahary, product details, and boilerplate about Armada MD. Tone: Professional, newsworthy. Length: 400-500 words.',
  '["announcement"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_templates WHERE type = 'press_release' AND name = 'Product Launch'
);

INSERT INTO public.content_templates (type, name, prompt_template, variables)
SELECT
  'product_update',
  'Feature Release',
  'Create a product update announcement for {feature_name} in {product}. Explain what the feature does, why it matters for healthcare providers, and how to use it. Include technical details and benefits. Tone: Informative and exciting. Length: 400-600 words.',
  '["feature_name", "product"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_templates WHERE type = 'product_update' AND name = 'Feature Release'
);

-- ============================================
-- SEO TABLES (USED BY /api/seo/*)
-- ============================================

CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  url TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  schema JSONB,
  confidence NUMERIC(4, 3) DEFAULT 0.800,
  approved_by TEXT,
  status TEXT DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_url ON public.ai_recommendations(url);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_created_at ON public.ai_recommendations(created_at DESC);

CREATE TABLE IF NOT EXISTS public.page_metrics (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  url TEXT NOT NULL,
  date DATE NOT NULL,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  queries JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_page_metrics_url_date ON public.page_metrics(url, date DESC);

-- ============================================
-- LEGACY CONTENT TABLE (kept for compatibility)
-- ============================================

CREATE TABLE IF NOT EXISTS public.generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  keywords TEXT[],
  internal_links JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_generated_content_type ON public.generated_content(content_type);
CREATE INDEX IF NOT EXISTS idx_generated_content_status ON public.generated_content(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scroll_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_generation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

-- Anonymous insert-only analytics policies
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

-- Service role full access policies
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

DROP POLICY IF EXISTS "service role full access content drafts" ON public.content_drafts;
CREATE POLICY "service role full access content drafts"
  ON public.content_drafts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access content templates" ON public.content_templates;
CREATE POLICY "service role full access content templates"
  ON public.content_templates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access content log" ON public.content_generation_log;
CREATE POLICY "service role full access content log"
  ON public.content_generation_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access recommendations" ON public.ai_recommendations;
CREATE POLICY "service role full access recommendations"
  ON public.ai_recommendations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access metrics" ON public.page_metrics;
CREATE POLICY "service role full access metrics"
  ON public.page_metrics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service role full access generated content" ON public.generated_content;
CREATE POLICY "service role full access generated content"
  ON public.generated_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- RELOAD SCHEMA CACHE
-- ============================================

SELECT pg_notify('pgrst', 'reload schema');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '📊 Analytics tables: analytics_events, analytics_sessions, page_performance, scroll_tracking';
  RAISE NOTICE '📝 Content tables: content_drafts, content_templates, content_generation_log';
  RAISE NOTICE '🔎 SEO tables: ai_recommendations, page_metrics';
  RAISE NOTICE '🔒 RLS policies: anon insert-only analytics, service role full access';
END $$;

-- Row Level Security Policies for Analytics Tables
-- Ensures proper security for anon inserts and admin reads

-- Enable RLS on all analytics tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scroll_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- Analytics Events: anon can INSERT only, no SELECT
CREATE POLICY "Allow anon insert on analytics_events"
  ON analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow service role all on analytics_events"
  ON analytics_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Scroll Tracking: anon can INSERT only
CREATE POLICY "Allow anon insert on scroll_tracking"
  ON scroll_tracking
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow service role all on scroll_tracking"
  ON scroll_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Page Performance: anon can INSERT only
CREATE POLICY "Allow anon insert on page_performance"
  ON page_performance
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow service role all on page_performance"
  ON page_performance
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- A/B Test Results: anon can INSERT only
CREATE POLICY "Allow anon insert on ab_test_results"
  ON ab_test_results
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow service role all on ab_test_results"
  ON ab_test_results
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add source, tenant columns for future multi-tenancy
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'web';
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS tenant VARCHAR(100);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

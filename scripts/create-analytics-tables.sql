-- Analytics event tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  page_url VARCHAR(500),
  user_agent TEXT,
  referrer TEXT,
  session_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);

-- Page performance metrics
CREATE TABLE IF NOT EXISTS page_performance (
  id BIGSERIAL PRIMARY KEY,
  page_url VARCHAR(500) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10, 2),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_page_performance_url ON page_performance(page_url);
CREATE INDEX idx_page_performance_metric ON page_performance(metric_name);

-- Scroll depth tracking
CREATE TABLE IF NOT EXISTS scroll_tracking (
  id BIGSERIAL PRIMARY KEY,
  page_url VARCHAR(500) NOT NULL,
  max_scroll_percentage INT,
  time_on_page INT, -- seconds
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scroll_tracking_url ON scroll_tracking(page_url);

-- A/B test results
CREATE TABLE IF NOT EXISTS ab_test_results (
  id BIGSERIAL PRIMARY KEY,
  test_name VARCHAR(255) NOT NULL,
  variant_name VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- "view", "click", "conversion"
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ab_test_name ON ab_test_results(test_name);
CREATE INDEX idx_ab_test_variant ON ab_test_results(variant_name);

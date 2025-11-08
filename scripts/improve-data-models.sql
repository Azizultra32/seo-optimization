-- Improve data models with audit trails and metadata

-- Generated Content: add audit trail
ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS origin_prompt TEXT;
ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS model VARCHAR(100);
ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS model_version VARCHAR(50);
ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS reviewer VARCHAR(255);
ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_generated_content_status ON generated_content(status);
CREATE INDEX IF NOT EXISTS idx_generated_content_type ON generated_content(content_type);

-- AI Recommendations: add application tracking
ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS applied BOOLEAN DEFAULT false;
ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS applied_by VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_applied ON ai_recommendations(applied);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_page ON ai_recommendations(page_url);

-- Page Metrics: add tracking columns
ALTER TABLE page_metrics ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_page_metrics_url ON page_metrics(page_url);

-- Content Generation Tables for AI-powered blog posts and case studies

-- Content drafts table
CREATE TABLE IF NOT EXISTS content_drafts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
  published_at TIMESTAMP WITH TIME ZONE
);

-- Content generation prompts/templates
CREATE TABLE IF NOT EXISTS content_templates (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true
);

-- Content generation history
CREATE TABLE IF NOT EXISTS content_generation_log (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content_id BIGINT REFERENCES content_drafts(id),
  prompt TEXT,
  model TEXT,
  tokens_used INTEGER,
  success BOOLEAN,
  error_message TEXT
);

-- Enable RLS
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generation_log ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON content_drafts(status);
CREATE INDEX IF NOT EXISTS idx_content_drafts_type ON content_drafts(type);
CREATE INDEX IF NOT EXISTS idx_content_drafts_created_at ON content_drafts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_drafts_slug ON content_drafts(slug);

-- Insert default templates
INSERT INTO content_templates (type, name, prompt_template, variables) VALUES
('blog', 'Healthcare AI Insights', 'Write a professional blog post about {topic} in healthcare AI. Focus on practical applications and ethical considerations. Target audience: healthcare professionals and technology leaders. Include specific examples and current research. Length: 800-1000 words. Tone: Professional yet accessible.', '["topic"]'),
('case_study', 'Product Success Story', 'Create a case study showcasing how {product_name} solved {problem} for healthcare providers. Include: Challenge, Solution, Results (with metrics), and Key Takeaways. Focus on real-world impact and measurable outcomes. Length: 600-800 words.', '["product_name", "problem"]'),
('press_release', 'Product Launch', 'Write a press release announcing {announcement}. Include: headline, dateline, lead paragraph with key facts, supporting quotes from Dr. Ali Ghahary, product details, and boilerplate about Armada MD. Tone: Professional, newsworthy. Length: 400-500 words.', '["announcement"]'),
('product_update', 'Feature Release', 'Create a product update announcement for {feature_name} in {product}. Explain what the feature does, why it matters for healthcare providers, and how to use it. Include technical details and benefits. Tone: Informative and exciting. Length: 400-600 words.', '["feature_name", "product"]')
ON CONFLICT DO NOTHING;

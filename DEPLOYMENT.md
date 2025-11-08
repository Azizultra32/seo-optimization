# Deployment Checklist

## ✅ P0 Priority: Do This Now

Before deploying, complete these critical tasks:

### 1. Database Security (RLS Policies)
Run `scripts/add-rls-policies.sql` in Supabase SQL Editor to:
- Enable Row Level Security on all analytics tables
- Prevent anonymous users from reading analytics data
- Allow insert-only access for event tracking
- Grant full access to service role for admin dashboards

### 2. Data Model Improvements
Run `scripts/improve-data-models.sql` to add:
- Audit trails for content (origin_prompt, model, reviewer, approved_at)
- Application tracking for SEO recommendations (applied, applied_at, applied_by)
- Multi-tenancy support (source, tenant columns)

### 3. Environment Variables
**Critical:** Add `CRON_SECRET` to Vercel:
\`\`\`bash
# Generate a secure token:
openssl rand -base64 32

# Or use a UUID:
550e8400-e29b-41d4-a716-446655440000
\`\`\`

**All Required Variables:**
- ✅ `OPENAI_API_KEY` - Already set
- ✅ `SUPABASE_*` - Already set
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` - Already set
- ⚠️ `CRON_SECRET` - **ADD THIS NOW**

### 4. Legal Pages
New pages added:
- `/privacy` - Privacy Policy with PIPA/PIPEDA compliance
- `/terms` - Terms of Service with medical disclaimers
- Footer links updated to point to new pages

### 5. Command Bar (⌘K)
Press **⌘K** (or Ctrl+K) anywhere on the site to:
- Generate SEO recommendations for current page
- Create new content drafts
- Open admin dashboards (SEO, Content, Analytics)
- Toggle theme
- Access privacy settings

### 6. SEO Snippet Card
Added to `/admin/content` editor:
- Real-time Google SERP preview
- Title/description length validation
- Visual score badges (Good/OK/Fix)
- Inline recommendations

---

## Required Environment Variables

Add these to your Vercel project under Settings → Environment Variables:

### Core Variables
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `SITE_URL` - Your production URL (e.g., https://drghahary.com)

### Database (Supabase)
- `SUPABASE_POSTGRES_URL` - Supabase connection string
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public Supabase key
- `NEXT_PUBLIC_SUPABASE_URL` - **Optional** (auto-derived from SUPABASE_POSTGRES_URL)
  - If auto-derivation fails, set manually: `https://usbhyermczgiaefsczcu.supabase.co`

### Security
- **`CRON_SECRET`** - Random secure token to protect cron job endpoints
  - Generate with: `openssl rand -base64 32`
  - Or use any secure random string (32+ characters)
  - Example: `harvest-studio-cron-2025-secure-xyz789`
  - Used by automated SEO audits and content generation
  - **REQUIRED** for cron jobs to work

### Google Integration
- `GOOGLE_SERVICE_ACCOUNT_KEY` - Google Search Console API credentials
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` - Google site verification token

### Optional
- `BACKEND_API_URL` - Backend API endpoint if using external services
- `NEXT_PUBLIC_BACKEND_API_URL` - Public API endpoint

## Database Setup

Run these SQL scripts in Supabase SQL Editor (in order):

1. `scripts/create-seo-tables.sql` - SEO automation tables
2. `scripts/create-content-tables.sql` - Content generation tables
3. `scripts/create-analytics-tables.sql` - Analytics and tracking tables
4. `scripts/add-rls-policies.sql` - SECURITY POLICIES (REQUIRED)
5. `scripts/improve-data-models.sql` - Audit trails and metadata

## Cron Jobs

Vercel Cron jobs are configured in `vercel.json`:

- **SEO Audit**: Runs weekly (Sundays at 2 AM)
- **Content Generation**: Runs weekly (Mondays at 10 AM)

Both require the `CRON_SECRET` environment variable to function securely.

## Features

### Step 1: AI-Powered SEO Automation
- **Endpoints**: `/api/seo/analyze`, `/api/seo/audit`, `/api/seo/metrics`
- **Dashboard**: `/admin/seo`
- **Features**: 
  - Real-time page SEO analysis with OpenAI
  - Weekly automated audits via cron
  - Google Search Console integration
  - Recommendation tracking with confidence scores

### Step 2: Dynamic Content Generation
- **Endpoints**: `/api/content/generate`, `/api/content/drafts`, `/api/content/auto-generate`
- **Dashboard**: `/admin/content`
- **Features**:
  - AI-powered blog posts, case studies, product updates
  - Weekly automated content generation (2-3 pieces)
  - Content templates and workflow management
  - Internal linking suggestions
  - Draft → Review → Published workflow

### Step 3: Advanced Analytics & Heatmapping
- **Endpoints**: `/api/analytics/track`, `/api/analytics/scroll`, `/api/analytics/performance`, `/api/analytics/dashboard`
- **Dashboard**: `/admin/analytics`
- **Features**:
  - Custom event tracking (CTA clicks, demo requests)
  - Scroll depth and time-on-page monitoring
  - Core Web Vitals tracking (FCP, LCP, CLS, FID)
  - Session-based analytics
  - Real-time performance metrics
  - Top pages and event breakdowns

### Step 4: Motion Tokens (Design System)
CSS custom properties for consistent animations:
- `--ease-snappy`, `--ease-fluid`, `--ease-bounce` - Easing functions
- `--dur-sm`, `--dur-md`, `--dur-lg` - Duration tokens
- Utility classes: `.animate-snappy`, `.animate-fluid`, `.animate-bounce`

### Step 5: SEO Snippet Card
Live Google SERP preview in content editor:
- Real-time title/description preview
- Character count validation (50-60 for title, 150-160 for description)
- Score badges with color coding
- Inline optimization tips

### Step 6: Privacy & Legal
Compliance-focused pages:
- **Privacy Policy**: PIPA/PIPEDA compliant, clear analytics/personalization language
- **Terms of Service**: Medical disclaimers, HIPAA-inspired practices
- **No PHI Collection**: Explicit warnings against submitting health data

## Post-Deployment Checklist

### Immediate (5 minutes)
- [ ] Add `CRON_SECRET` to Vercel environment variables
- [ ] Run `scripts/add-rls-policies.sql` in Supabase
- [ ] Run `scripts/improve-data-models.sql` in Supabase
- [ ] Verify `/privacy` and `/terms` pages load correctly
- [ ] Test Command Bar (⌘K) on homepage

### Within 1 Hour
- [ ] Visit `/admin/seo` and trigger manual analysis
- [ ] Visit `/admin/content` and generate test content
- [ ] Visit `/admin/analytics` and verify tracking is working
- [ ] Check Vercel cron logs for scheduled jobs
- [ ] Test event tracking (click CTAs, scroll pages)

### Within 24 Hours
- [ ] Monitor analytics for incoming events
- [ ] Review first automated content generation (Monday 10 AM)
- [ ] Check SEO audit results (Sunday 2 AM)
- [ ] Verify performance metrics are being collected

## Privacy & Compliance

### What We Collect
**Anonymous Analytics:**
- Page views, scroll depth, time on page
- Click events (CTA buttons, demo requests)
- Performance metrics (Core Web Vitals)
- Session IDs (ephemeral, no IP storage)

**Business Contacts:**
- Demo requests: name, email, organization
- Newsletter signups (if implemented)

### What We DON'T Collect
- ❌ IP addresses (hashed only if needed)
- ❌ Protected Health Information (PHI)
- ❌ Personal medical data
- ❌ Patient information

### Compliance Approach
- **Canada-first**: PIPA/PIPEDA compliant
- **HIPAA-inspired**: Best practices for healthcare tech
- **No medical advice**: Clear disclaimers on all pages
- **Patient safety**: No PHI in web analytics or chatbot

## Troubleshooting

**"Unauthorized" errors on cron endpoints:**
- Ensure `CRON_SECRET` is set in all environments (Production, Preview, Development)
- Verify the secret matches in both Vercel project settings and cron configuration

**"Missing credentials" OpenAI errors:**
- Confirm `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits and permissions

**Database connection errors:**
- Verify all Supabase environment variables are set
- Ensure database tables are created via SQL scripts
- Check Supabase service role key has necessary permissions

**Analytics not tracking:**
- Verify analytics tables are created in Supabase
- Check browser console for tracking errors
- Ensure API routes are accessible (not blocked by ad blockers)

**Performance metrics missing:**
- Performance API may not be available in all browsers
- Check browser compatibility for Navigation Timing API
- Verify user has allowed scripts to run

**Command Bar not appearing:**
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for errors
- Verify ThemeProvider is wrapping the app

**SEO Snippet Card not showing:**
- Ensure content editor has title and excerpt
- Check component imports in admin/content page

**Motion animations not smooth:**
- Verify motion tokens are defined in globals.css
- Check for CSS conflicts
- Ensure browser supports CSS custom properties

## Success Metrics to Monitor

**SEO Performance:**
- Recommendation implementation rate
- Organic traffic growth
- Search ranking improvements
- Featured snippets captured

**Content Generation:**
- Drafts generated per week
- Approval/publish rate
- Content engagement metrics
- Internal linking effectiveness

**Analytics:**
- Average scroll depth (target: >60%)
- Time on page (target: >45s)
- Core Web Vitals scores
- Conversion funnel analysis

**New Metrics:**
- Command Bar usage frequency
- Privacy page views (baseline for user awareness)
- SEO Snippet Card: before/after title/description scores
- Motion animation performance (no CLS issues)

## Next Phase (P1 - Weeks 2-3)

After P0 is stable, tackle:
1. Interactive product demos (guided hotspots)
2. Search lite (page index + embeddings)
3. Demo booking (Cal.com embed + lead scoring)

# Database Setup Instructions

## ⚠️ REQUIRED: Run SQL Script First

The analytics and content generation features require database tables. **You must run this script before the site will work properly.**

---

## Quick Setup (3 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project: `usbhyermczgiaefsczcu`
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### Step 2: Run the Setup Script

1. Open `scripts/00-run-this-first.sql` in this project
2. **Copy the entire file** (all ~300 lines)
3. **Paste** into the Supabase SQL Editor
4. Click **"Run"** (or press `Cmd/Ctrl + Enter`)

### Step 3: Verify Success

You should see these messages:
```
✅ Database setup complete! All tables created successfully.
📊 Analytics tables: analytics_events, analytics_sessions, page_performance, scroll_tracking
📝 Content tables: generated_content
🔒 RLS policies: Anonymous users can insert analytics, service role has full access
```

### Step 4: Confirm Tables Exist

1. Go to **"Table Editor"** in Supabase sidebar
2. You should see these new tables:
   - ✅ `analytics_events`
   - ✅ `analytics_sessions`
   - ✅ `page_performance`
   - ✅ `scroll_tracking`
   - ✅ `generated_content`

---

## What This Script Does

### 📊 Analytics Tables (Step 3)

**`analytics_events`** - Tracks all user interactions
- Page views
- Button clicks (demo requests, CTAs)
- Video engagement
- Custom events

**`analytics_sessions`** - User session tracking
- First page visited
- Last page visited
- Referrer source
- User agent hash

**`page_performance`** - Core Web Vitals
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- TTFB (Time to First Byte)

**`scroll_tracking`** - User engagement
- Maximum scroll depth per page
- Time spent on page
- Session tracking

### 📝 Content Tables (Step 2)

**`generated_content`** - AI-generated content management
- Blog posts
- Case studies
- Product updates
- Press releases
- Draft → Review → Published workflow

### 🔒 Security (P0 Fix)

**Row Level Security (RLS):**
- Anonymous users can **INSERT** analytics data only
- Anonymous users **CANNOT** read, update, or delete data
- Service role (your API) has full access
- Prevents data leaks and unauthorized access

### 📋 Audit Trail (P0 Fix)

Adds tracking columns to content and recommendations:
- `created_at` - When record was created
- `updated_at` - When record was last modified
- `created_by` - Who created it
- `updated_by` - Who last modified it
- `status` - Workflow state (draft, review, published)

---

## Testing After Setup

### Test Analytics Tracking

1. Visit your deployed site
2. Open browser DevTools → Console
3. Click around (demo buttons, scroll, etc.)
4. Check for `[v0] Analytics tracking` success messages

### Verify Data in Supabase

Run this in SQL Editor to see recent events:
```sql
SELECT * FROM public.analytics_events 
ORDER BY created_at DESC 
LIMIT 10;
```

You should see rows appearing as you interact with the site.

### Test Content Generation

1. Visit `/admin/content` on your site
2. Click "Generate New Content"
3. Select content type and topic
4. Click "Generate"
5. View the draft in the dashboard

---

## Troubleshooting

### ❌ Error: "relation already exists"

**This is normal!** The script safely skips tables that already exist. No action needed.

### ❌ Error: "Could not find the table 'public.analytics_events'"

This means the script hasn't run yet. Follow Step 1-2 above.

### ❌ Error: "permission denied"

Make sure you're logged into Supabase with the project owner account.

### ❌ Analytics still not working after running script

1. Check that tables exist in Table Editor
2. Verify RLS policies were created (Settings → Database → Policies)
3. Wait 30 seconds for schema cache to reload
4. Try a hard refresh of your site (`Cmd/Ctrl + Shift + R`)

### ❌ Still seeing 404 errors on `/rest/v1/analytics_events`

Run this in SQL Editor to force schema reload:
```sql
SELECT pg_notify('pgrst', 'reload schema');
```

Then wait 30 seconds and try again.

---

## Need Help?

If you encounter any issues:

1. Check the Supabase logs (Dashboard → Logs → API Logs)
2. Verify environment variables are set correctly in Vercel
3. Ensure `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ANON_KEY` are set
4. Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set for client-side tracking

---

## What Happens Next?

Once the script runs successfully:

✅ **Analytics tracking starts immediately** (no code changes needed)  
✅ **Content generation API is ready** (visit `/admin/content`)  
✅ **SEO recommendations are secured** (RLS protects data)  
✅ **Audit trails track all changes** (full accountability)

**No redeployment required!** The site will automatically start using the new tables.

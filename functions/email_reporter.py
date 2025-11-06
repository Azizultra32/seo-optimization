"""
Summarizes weekly metrics and writes them to Supabase (no email required).
"""

import os, datetime
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def summarize():
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    today = datetime.date.today().isoformat()

    metrics = sb.table("page_metrics").select("*").order("date", desc=True).limit(50).execute().data
    total_clicks = sum(m["clicks"] for m in metrics)
    total_impressions = sum(m["impressions"] for m in metrics)
    avg_ctr = round((total_clicks / total_impressions) * 100, 2) if total_impressions else 0

    summary = {
        "date": today,
        "summary": f"Clicks: {total_clicks}, Impressions: {total_impressions}, CTR: {avg_ctr}%",
        "notes": "Automated SEO summary stored in Supabase instead of email."
    }

    sb.table("ai_recommendations").insert({
        "url": "SUMMARY",
        "meta_title": "Weekly SEO Summary",
        "meta_description": summary["summary"],
        "schema": {},
        "confidence": 1.0
    }).execute()

    print("✅ SEO summary written to Supabase:", summary["summary"])

if __name__ == "__main__":
    summarize()

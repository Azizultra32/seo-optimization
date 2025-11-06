"""
Uses OpenAI GPT-4 to analyze the fetched metrics and generate updated meta titles and descriptions.
Stores the results in Supabase for automatic use.
"""

import os, json, openai
from supabase import create_client

openai.api_key = os.getenv("OPENAI_API_KEY")
sb = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

PROMPT_TEMPLATE = """
Given this webpage data:

URL: {url}
Recent queries: {queries}
Impressions: {impressions}
Clicks: {clicks}

Suggest:
1. A new SEO title (≤60 chars)
2. A meta description (≤155 chars)
3. One schema.org tag update idea
Return JSON with keys title, description, schema.
"""

def optimize():
    pages = sb.table("page_metrics").select("*").limit(10).execute().data
    for p in pages:
        prompt = PROMPT_TEMPLATE.format(**p)
        result = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an SEO expert for medical content."},
                {"role": "user", "content": prompt}
            ]
        )
        try:
            content = json.loads(result.choices[0].message.content)
        except Exception:
            print("⚠️ Failed to parse GPT output for", p["url"])
            continue

        sb.table("ai_recommendations").insert({
            "url": p["url"],
            "meta_title": content.get("title"),
            "meta_description": content.get("description"),
            "schema": json.dumps(content.get("schema")),
            "confidence": 0.95
        }).execute()
        print(f"✅ Optimized meta for {p['url']}")

if __name__ == "__main__":
    optimize()

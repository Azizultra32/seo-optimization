"""
Fetches the past 7 days of Search Console metrics and stores them in Supabase.
"""

import os, datetime, json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
PROPERTY_URI = "sc-domain:alighahary.com"

def fetch_metrics():
    creds = service_account.Credentials.from_service_account_file(
        os.getenv("SEARCH_CONSOLE_CREDENTIALS"),
        scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
    )
    service = build("searchconsole", "v1", credentials=creds)
    today = datetime.date.today()
    start = today - datetime.timedelta(days=7)

    body = {
        "startDate": start.isoformat(),
        "endDate": today.isoformat(),
        "dimensions": ["page", "query"],
        "rowLimit": 250,
    }

    response = service.searchanalytics().query(siteUrl=PROPERTY_URI, body=body).execute()
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    if not response.get("rows"):
        print("No Search Console data found.")
        return

    for row in response["rows"]:
        page, query = row["keys"]
        sb.table("page_metrics").insert({
            "url": page,
            "date": today.isoformat(),
            "impressions": row.get("impressions", 0),
            "clicks": row.get("clicks", 0),
            "queries": json.dumps([query]),
        }).execute()
    print("✅ Search Console metrics updated in Supabase.")

if __name__ == "__main__":
    fetch_metrics()

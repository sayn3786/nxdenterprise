#!/usr/bin/env python3
"""
Fetches SWIFT & payments news from multiple public RSS feeds,
filters for relevant articles, and writes swift-news.json.
Runs daily via GitHub Actions.
"""
import json, re, html, datetime, sys
import feedparser
import requests
from dateutil import parser as dateparser

KEYWORDS = [
    'swift', 'iso 20022', 'mx migration', 'gpi', 'cbdc',
    'instant payment', 'rtgs', 'sanctions screening', 'aml',
    'anti-money laundering', 'correspondent banking', 'cross-border payment',
    'payment modernisation', 'payment modernization', 'fintech',
    'bank compliance', 'financial crime', 'kyc', 'basel',
]

SOURCES = [
    {
        'url': 'https://www.finextra.com/rss/finextra-news.xml',
        'name': 'Finextra',
        'color': '#0d2145',
    },
    {
        'url': 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
        'name': 'Wall Street Journal',
        'color': '#07111f',
    },
    {
        'url': 'https://www.centralbanking.com/rss',
        'name': 'Central Banking',
        'color': '#1e3a8a',
    },
    {
        'url': 'https://www.bis.org/rss/home.rss',
        'name': 'BIS',
        'color': '#164e63',
    },
    {
        'url': 'https://www.pymnts.com/feed/',
        'name': 'PYMNTS',
        'color': '#0f172a',
    },
    {
        'url': 'https://www.reuters.com/arc/outboundfeeds/v3/category/business/?outputType=xml',
        'name': 'Reuters',
        'color': '#7c3aed',
    },
    {
        'url': 'https://feeds.feedburner.com/ThePaymentsNerd',
        'name': 'The Payments Nerd',
        'color': '#065f46',
    },
]

def is_relevant(title, summary=''):
    text = (title + ' ' + summary).lower()
    return any(kw in text for kw in KEYWORDS)

def clean(text):
    text = html.unescape(text or '')
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:200] + ('…' if len(text) > 200 else '')

def tag_for(title):
    t = title.lower()
    if any(k in t for k in ['iso 20022','mx','mt migration','pacs','camt']): return 'ISO 20022'
    if any(k in t for k in ['sanction','ofac','watchlist']): return 'Sanctions'
    if any(k in t for k in ['aml','financial crime','money laundering']): return 'AML'
    if any(k in t for k in ['cbdc','digital currency','blockchain','dlt']): return 'CBDC/DLT'
    if any(k in t for k in ['gpi','uetr','tracking']): return 'SWIFT gpi'
    if any(k in t for k in ['instant','rtgs','faster payment']): return 'Instant Payments'
    if any(k in t for k in ['csp','customer security','cyber']): return 'SWIFT CSP'
    return 'Payments'

articles = []
headers = {'User-Agent': 'Mozilla/5.0 (compatible; NXD-NewsFetcher/1.0)'}

for source in SOURCES:
    try:
        resp = requests.get(source['url'], headers=headers, timeout=12)
        feed = feedparser.parse(resp.content)
        for entry in feed.entries[:20]:
            title   = clean(entry.get('title', ''))
            summary = clean(entry.get('summary', entry.get('description', '')))
            link    = entry.get('link', '')
            pub_raw = entry.get('published', entry.get('updated', ''))
            try:
                pub_dt = dateparser.parse(pub_raw)
                pub_iso = pub_dt.strftime('%Y-%m-%dT%H:%M:%SZ')
                pub_display = pub_dt.strftime('%d %b %Y')
            except Exception:
                pub_iso = datetime.datetime.utcnow().isoformat() + 'Z'
                pub_display = 'Recent'

            if title and is_relevant(title, summary):
                articles.append({
                    'title':       title,
                    'summary':     summary,
                    'link':        link,
                    'source':      source['name'],
                    'color':       source['color'],
                    'tag':         tag_for(title),
                    'published':   pub_iso,
                    'display_date': pub_display,
                })
    except Exception as e:
        print(f"  ⚠ {source['name']}: {e}", file=sys.stderr)

# Sort by date, newest first; deduplicate by title
seen = set()
unique = []
for a in sorted(articles, key=lambda x: x['published'], reverse=True):
    key = a['title'][:60].lower()
    if key not in seen:
        seen.add(key)
        unique.append(a)
    if len(unique) >= 9:
        break

output = {
    'updated': datetime.datetime.utcnow().strftime('%d %b %Y, %H:%M UTC'),
    'count': len(unique),
    'articles': unique,
}

with open('swift-news.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"✅ Wrote {len(unique)} articles to swift-news.json")

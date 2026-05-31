#!/usr/bin/env python3
"""
Fetches latest SWIFT Standards Releases + SWIFT news + payments industry RSS.
Prioritises swift.com content. Falls back to industry RSS feeds.
Writes swift-news.json — committed daily by GitHub Actions.
"""
import json, re, html, datetime, sys
try:
    import feedparser, requests
    from dateutil import parser as dateparser
except ImportError:
    import subprocess
    subprocess.run([sys.executable, '-m', 'pip', 'install',
                    'requests', 'feedparser', 'python-dateutil', '-q'])
    import feedparser, requests
    from dateutil import parser as dateparser

KEYWORDS = [
    'swift','iso 20022','mx migration','pacs','camt','gpi','cbdc',
    'instant payment','rtgs','sanctions','aml','anti-money laundering',
    'correspondent banking','cross-border payment','payment modernis',
    'financial crime','kyc','csp','customer security','standards release',
    'blockchain','dlt','tokenised','post-quantum','structured address',
]

TAG_MAP = [
    (['iso 20022','pacs','camt','mx','mt migration','structured address',
      'standards release','coexistence'],                        'ISO 20022'),
    (['sanction','ofac','watchlist','pep'],                      'Sanctions'),
    (['aml','financial crime','money laundering','fatf'],        'AML'),
    (['cbdc','digital currency','blockchain','dlt','tokenised',
      'hyperledger','ethereum','evm'],                           'CBDC / DLT'),
    (['gpi','uetr','tracking'],                                  'SWIFT gpi'),
    (['instant','faster payment','real-time payment','retail payment',
      'consumer payment'],                                       'Instant Payments'),
    (['csp','customer security','cyber','post-quantum','cscf'],  'SWIFT CSP'),
    (['dora','mifid','basel','regulation','compliance mandate'],  'Regulation'),
]

SOURCES = [
    # SWIFT own RSS / news feeds (highest priority)
    {'url':'https://www.swift.com/rss.xml',                         'name':'SWIFT','pri':1},
    {'url':'https://www.swift.com/news-events/news.rss',            'name':'SWIFT','pri':1},
    # Industry
    {'url':'https://www.finextra.com/rss/finextra-news.xml',        'name':'Finextra','pri':2},
    {'url':'https://www.pymnts.com/feed/',                          'name':'PYMNTS','pri':3},
    {'url':'https://www.bis.org/rss/home.rss',                      'name':'BIS','pri':2},
    {'url':'https://www.centralbanking.com/rss',                    'name':'Central Banking','pri':3},
    {'url':'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',        'name':'WSJ Markets','pri':4},
]

HDRS = {'User-Agent':'Mozilla/5.0 (compatible; NXD-NewsFetcher/1.0)'}

def is_relevant(title, summary=''):
    t = (title + ' ' + summary).lower()
    return any(k in t for k in KEYWORDS)

def get_tag(title):
    t = title.lower()
    for kws, tag in TAG_MAP:
        if any(k in t for k in kws):
            return tag
    return 'Payments'

def clean(text, maxlen=200):
    text = html.unescape(text or '')
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:maxlen] + ('...' if len(text) > maxlen else '')

def parse_date(raw):
    try:
        dt = dateparser.parse(raw)
        return dt.strftime('%Y-%m-%dT%H:%M:%SZ'), dt.strftime('%d %b %Y')
    except Exception:
        now = datetime.datetime.utcnow()
        return now.strftime('%Y-%m-%dT%H:%M:%SZ'), 'Recent'

articles = []
for src in SOURCES:
    try:
        r = requests.get(src['url'], headers=HDRS, timeout=12)
        feed = feedparser.parse(r.content)
        for entry in feed.entries[:25]:
            title   = clean(entry.get('title',''))
            summary = clean(entry.get('summary', entry.get('description','')))
            link    = entry.get('link','')
            pub_iso, pub_disp = parse_date(entry.get('published', entry.get('updated','')))
            if title and is_relevant(title, summary):
                articles.append({
                    'title':        title,
                    'summary':      summary,
                    'link':         link,
                    'source':       src['name'],
                    'color':        '#07111f' if src['name']=='SWIFT' else '#0d2145',
                    'tag':          get_tag(title),
                    'published':    pub_iso,
                    'display_date': pub_disp,
                    '_pri':         src['pri'],
                })
    except Exception as e:
        print(f'  skip {src["name"]}: {e}', file=sys.stderr)

# Sort: primary source first, then by date
articles.sort(key=lambda x: (x['_pri'], x['published']), reverse=False)
articles.sort(key=lambda x: x['published'], reverse=True)

# Deduplicate
seen, unique = set(), []
for a in articles:
    key = a['title'][:55].lower()
    if key not in seen:
        seen.add(key)
        a.pop('_pri', None)
        unique.append(a)
    if len(unique) >= 9:
        break

out = {
    'updated': datetime.datetime.utcnow().strftime('%d %b %Y, %H:%M UTC'),
    'count':   len(unique),
    'source_credit': 'swift.com + industry feeds',
    'articles': unique,
}
with open('swift-news.json','w',encoding='utf-8') as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
print(f'Wrote {len(unique)} articles.')

import urllib.request, re, html

def get(u):
    req = urllib.request.Request(u, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36"})
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")

targets = [
    "https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025",
    "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/",
    "https://blog.google/products-and-platforms/products/gemini/gemini-2-5-model-family-expands/",
    "https://cloud.google.com/blog/products/ai-machine-learning/gemini-3-1-flash-lite-is-now-generally-available",
    "https://deepmind.google/models/gemini/pro/",
]
for u in targets:
    try:
        t = get(u)
        og = re.search(r'property="og:title" content="([^"]+)"', t)
        tw = re.search(r'name="twitter:title" content="([^"]+)"', t)
        ti = re.search(r"<title[^>]*>(.*?)</title>", t, re.S | re.I)
        pt = re.search(r'article:published_time" content="([^"]+)"', t)
        dt = re.search(r'datePublished["\s:]+([^,"\}]+)', t)
        print(u)
        print("  <title>:", html.unescape(ti.group(1)).strip() if ti else "?")
        print("  og:title:", html.unescape(og.group(1)) if og else "?")
        print("  twitter:title:", html.unescape(tw.group(1)) if tw else "?")
        print("  published:", pt.group(1) if pt else "?", "| datePublished:", dt.group(1) if dt else "?")
    except Exception as e:
        print(u, "ERROR", repr(e))

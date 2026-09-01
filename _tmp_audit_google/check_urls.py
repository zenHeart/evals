import json, glob, urllib.request, re, html, os

os.chdir(r"C:\Users\cheng\code\github\evals")
urls = []
for f in sorted(glob.glob("data/model-releases/official/google/*.json")):
    d = json.load(open(f, encoding="utf-8"))
    for s in d["primary_sources"]:
        urls.append((os.path.basename(f), s["url"]))
for f in ["legacy/gemini-1-5", "legacy/google-gemini"]:
    d = json.load(open("data/model-releases/" + f + ".json", encoding="utf-8"))
    for s in d["primary_sources"]:
        urls.append((f.split("/")[-1], s["url"]))

for name, u in urls:
    try:
        req = urllib.request.Request(u, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36"})
        t = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")
        m = re.search(r"<title[^>]*>(.*?)</title>", t, re.S | re.I)
        title = html.unescape(m.group(1)).strip() if m else "NO TITLE"
        pt = (re.search(r'article:published_time"[^>]*content="([^"]+)"', t)
              or re.search(r'content="([^"]+)"[^>]*article:published_time', t))
        print(name, "|", u)
        print("   title=", title)
        print("   published=", pt.group(1) if pt else "?")
    except Exception as e:
        print(name, "|", u)
        print("   ERROR:", repr(e))

"""Rebuild ../index.html from the source modules: python3 src/build.py (run from the repo root)."""
import os
here = os.path.dirname(os.path.abspath(__file__)); r = lambda f: open(os.path.join(here, f), encoding="utf-8").read()
h = r("app.html")
head = '<meta name="description" content="DeoCoach, Edition for African Coaches: sense where coaching opportunities are rising across Africa, read what people in each city care about, and turn your competencies into cheques.">\n<meta name="theme-color" content="#070d24"><link rel="manifest" href="/manifest.json"><link rel="icon" href="/icon-192.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<meta property="og:title" content="DeoCoach · Edition for African Coaches"><meta property="og:description" content="From competencies to cheques — and a sonar for the future of coaching in Africa."><meta property="og:image" content="/icon-512.png">'
out = h.replace("__D3GEO__", r("d3geo.min.js")).replace("__WORLD__", r("world.json")).replace("__DATA__", r("data.js")).replace("__APP__", r("app.js") + "\n" + r("sonar.js"))
out = out.replace("<title>", head + "\n<title>", 1)
open(os.path.join(here, "..", "index.html"), "w", encoding="utf-8").write(out); print("index.html", len(out))

# TGC27 — The Power to Persevere

Landing page for **TGC27 Church Conference** · September 21–23, 2026 · Indianapolis, IN.

> Revelation's Letters to the 7 Churches.

## Stack

Pure static site — HTML, CSS, vanilla JS. No build step.

- Self-hosted Empirica + Mallory fonts
- IntersectionObserver-driven reveal animations
- Transform-based parallax on hero, CityAlight, and location backgrounds
- Lazy image fade-in
- Brand tokens from the TGC27 kit (Indigo `#1B1F33`, Emerald `#5E9075`, Lemon `#D3D782`)

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Deployed to Vercel. Static site — `vercel.json` only declares clean URLs.

<div align="center">

# 🔍 AI Search

**A self-updating AI news hub that aggregates 20+ sources daily — fully static, zero-cost, fork it and you have your own.**

[简体中文](README.md) ・ English

[![Live Demo](https://img.shields.io/badge/🌐_Live-Demo-2ea44f?style=for-the-badge)](https://keyuchen-del.github.io/AI-Search/)

[![Stars](https://img.shields.io/github/stars/keyuchen-del/AI-Search?style=flat&logo=github)](https://github.com/keyuchen-del/AI-Search/stargazers)
[![Forks](https://img.shields.io/github/forks/keyuchen-del/AI-Search?style=flat&logo=github)](https://github.com/keyuchen-del/AI-Search/network/members)
[![Deploy](https://img.shields.io/github/actions/workflow/status/keyuchen-del/AI-Search/deploy.yml?logo=githubactions&logoColor=white&label=daily%20deploy)](https://github.com/keyuchen-del/AI-Search/actions)
[![Last Commit](https://img.shields.io/github/last-commit/keyuchen-del/AI-Search?logo=git&logoColor=white)](https://github.com/keyuchen-del/AI-Search/commits)
[![License](https://img.shields.io/github/license/keyuchen-del/AI-Search)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)

<br/>

<!-- 👉 Drop a homepage screenshot at docs/images/screenshot-home.png (≈1280px wide), then uncomment the line below -->
<!-- ![AI Search homepage](docs/images/screenshot-home.png) -->

</div>

---

## What is this?

Every day at 22:17 UTC, a GitHub Actions workflow crawls **20+ public sources** (OpenAI, DeepMind, HuggingFace, arXiv, Hacker News, and more), dedupes and classifies the items, rebuilds the site, and redeploys to GitHub Pages.

The whole thing is a **static site** — so:

- 🆓 **Zero cost** — no backend, no database, no API keys. Runs entirely within GitHub Pages' free tier.
- 🔄 **Always fresh** — crawls and redeploys daily, fully unattended.
- ⚡ **Instant** — filtering / search / pagination all happen client-side; data is inlined into the page.
- 🍴 **Forkable** — fork it, enable Pages, and you have your own AI news hub in ~5 minutes.

## 🍴 Run your own in 3 minutes

1. Click **Fork** (top-right).
2. In your fork: **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and run **Build & Deploy to GitHub Pages** once (or push any commit).
4. Wait for the green check, then visit `https://<your-username>.github.io/AI-Search/`.

From then on, the workflow re-crawls and redeploys every day — your site stays fresh on its own.

Want your own sources? Add one line to the `FEEDS` array in `scripts/sources/rss.ts` — see [CONTRIBUTING](CONTRIBUTING.md).

## 📸 Preview

<!-- Drop screenshots into docs/images/ then uncomment. See docs/images/README.md -->
<!--
| Home (categories + search) | Daily digest |
| :---: | :---: |
| ![home](docs/images/screenshot-home.png) | ![daily](docs/images/screenshot-daily.png) |
-->

_Screenshots coming — see [`docs/images/README.md`](docs/images/README.md)._

## 🚀 Features

| Feature | Description |
|---------|-------------|
| Category browsing | Models / Products / Industry / Papers / Tips — 5 categories |
| Featured / All | Curated items by default, toggle to see everything |
| Time window | 24h / 3d / 7d / 30d filters |
| Keyword search | Instant client-side match over title + summary + source + tags |
| AI Daily | Per-day digest with editor's note, category summaries, and quick hits |
| Daily archive | Browse historical digests by date |
| Trending | Sidebar Top 8 ranked by heat (stars / upvotes / HN points) |
| Auto refresh | GitHub Actions crawls + rebuilds + deploys daily |
| Responsive | Works on desktop and mobile |

## 📡 Data sources (all public RSS / APIs)

- **Labs / research**: OpenAI, Google AI, Google DeepMind, HuggingFace (Blog + Daily Papers), Berkeley AI Research, MIT News
- **Academic**: arXiv (cs.AI / cs.CL / cs.LG), HuggingFace Daily Papers
- **Code / tools**: GitHub (new repos by topic: llm / ai-agent / rag / multimodal …)
- **Tech media**: The Verge, TechCrunch, VentureBeat, Ars Technica, MIT Technology Review
- **Community**: Hacker News (high-signal AI stories), Simon Willison
- **Chinese**: QbitAI, 36Kr, InfoQ

Every item links back to its original source.

## 🛠 Tech stack

- **Framework**: Next.js 14 (App Router, `output: 'export'` full static export) + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Interactivity**: server-prerendered default view; filtering / search / pagination run entirely in the browser against inlined data (no runtime requests)
- **Crawling**: `scripts/crawl.ts`, sources run in parallel and fail independently
- **Classification**: `lib/classify.ts`, pure functions mapping heterogeneous sources into 5 categories
- **Deploy**: GitHub Actions → GitHub Pages (zero servers, zero cost)

## 🏗 Architecture

```
GitHub Actions (daily cron / push / manual)
        │
        ▼
  npm run crawl ── crawl 20+ sources in parallel ──▶ dedupe + classify ──▶ data/items.json
        │
        ▼
  next build (output: export, DATA_SOURCE=local)
        │  reads data/items.json, inlines it into static pages
        ▼
       out/  ──▶ upload-pages-artifact ──▶ deploy-pages ──▶ GitHub Pages
```

## 💻 Local development

```bash
git clone https://github.com/keyuchen-del/AI-Search.git
cd AI-Search
npm install

# 1) Crawl real data into data/items.json (optional, a snapshot ships with the repo)
CRAWL_ARXIV=1 npm run crawl

# 2) Dev server
npm run dev            # http://localhost:3000

# 3) Production static build (output in out/)
DATA_SOURCE=local npm run build
```

> Note: under `npm run dev`, `basePath` is empty (root). Only CI builds inject `NEXT_PUBLIC_BASE_PATH=/AI-Search` for the Pages sub-path.

See the [Chinese README](README.md) for the full env-var / category / script / project-structure reference.

## 🤝 Contributing

PRs welcome! The most common contribution is **adding a new data source** (one line in `FEEDS`). See [CONTRIBUTING.md](CONTRIBUTING.md).

## ⭐ Star History

If this is useful to you, a Star goes a long way.

[![Star History Chart](https://api.star-history.com/svg?repos=keyuchen-del/AI-Search&type=Date)](https://star-history.com/#keyuchen-del/AI-Search&Date)

## 📄 License

[MIT](LICENSE) © [keyuchen-del](https://github.com/keyuchen-del)

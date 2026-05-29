<div align="center">

# 🔍 AI Search

**A self-updating knowledge base for AI news — daily crawl, AI commentary, personalization, full-text search, installable. Fully static, zero cost for visitors, fork it and you have your own.**

[简体中文](README.md) ・ English

[![Live Demo](https://img.shields.io/badge/🌐_Live-Demo-2ea44f?style=for-the-badge)](https://keyuchen-del.github.io/AI-Search/)

[![Stars](https://img.shields.io/github/stars/keyuchen-del/AI-Search?style=flat&logo=github)](https://github.com/keyuchen-del/AI-Search/stargazers)
[![Forks](https://img.shields.io/github/forks/keyuchen-del/AI-Search?style=flat&logo=github)](https://github.com/keyuchen-del/AI-Search/network/members)
[![Deploy](https://img.shields.io/github/actions/workflow/status/keyuchen-del/AI-Search/deploy.yml?logo=githubactions&logoColor=white&label=daily%20deploy)](https://github.com/keyuchen-del/AI-Search/actions)
[![License](https://img.shields.io/github/license/keyuchen-del/AI-Search)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)

</div>

---

## ✨ What is it

> A **daily-updating, AI-augmented, personalizable, fully searchable, installable** AI-industry news site.
> No server, no database, no API key required for visitors — it all runs within GitHub Pages' free tier.
> Want your own? **Fork it, live in 5 minutes.** Swap the sources and it becomes a news knowledge base for any vertical.

## 🎯 Highlights

- 🤖 **AI-augmented** — a one-line take on every item, an auto-picked "must-read" digest daily, and an AI lead-in for each daily entry.
- 🧠 **A knowledge base that remembers** — historical archive + auto-generated topic/source pages + fuzzy full-text search.
- 🎨 **Magazine reading** — hero headline + cover images + a Xiaohongshu-style masonry feed.
- 🎯 **Personal** — follow/mute sources, follow topics, bookmark, mark-as-read — all stored in your browser, no login.
- ⚡ **Zero cost · zero latency** — fully static; filter/search/sort happen locally; GitHub Actions rebuilds daily.
- 🍴 **Fork-and-go** — enable Pages, (optionally) add one LLM key, and adding a source is a single line.

## 🚀 Features

**Content & aggregation**

| Feature | Notes |
|---|---|
| Multi-source crawl | 20+ public sources daily, in parallel; one failure never sinks the run |
| Normalization | dedupe (URL + cross-source title), classification, HTML/entity cleanup, `firstSeen` stamping |
| AI daily report | compiled from "newly collected today": featured + 5 sections + flashes, each with an AI lead-in |
| Source health | per-source counts, last update, failed sources |

**Browse & discover**

| Feature | Notes |
|---|---|
| Category / time window | models / products / industry / papers / tips · 24h–30d |
| Source filter & sort | click a source to filter; latest / hottest |
| Views | all / new today / bookmarks / unread + NEW badge |
| Command palette ⌘K | fuzzy full-text search + jump to category/source/daily |
| Topic pages | auto-generated `/topic/openai`, `/topic/agent`… aggregating full history |
| Trending | "hottest this week" by GitHub stars / HN points, labeled per source |

**Personalization (browser-local, no login)**

| Feature | Notes |
|---|---|
| Follow / mute sources | followed float up, muted hidden |
| Follow topics | matching items boosted |
| Bookmark / read | one-tap bookmark, auto mark-read, export bookmarks to Markdown |

**AI (build-time, zero key for visitors)**

| Feature | Notes |
|---|---|
| One-line take | ≤40-char note per new item, cached, capped per run |
| Daily must-read | 3–5 picks + reasons, pinned on home |
| Daily lead-ins | concise AI intro under each daily entry |

**Experience** — magazine visuals (hero + thumbnails + masonry), PWA (installable + offline), responsive.

## 🤖 AI (optional · cost-controlled)

All AI runs **at build time** in GitHub Actions and is cached into the snapshot — so visitors get a pure static, zero-key, zero-latency site; only the maintainer needs a key.

- Defaults to **DeepSeek**; only new items are analyzed, results cached, capped per run → very low daily cost.
- Enable: `gh secret set DEEPSEEK_API_KEY -R <you>/AI-Search`. Without it, AI features are skipped gracefully.

## 🧠 Knowledge base / architecture

- **Historical archive** — `data/archive/YYYY-MM.json` monthly shards, deduped by id, last 3 months.
- **Topic pages** — entities extracted in `lib/entities.ts`; `generateStaticParams` builds a static page per entity with ≥5 items (depth + SEO, no home-page bloat).
- **Full-text search** — MiniSearch lazy-loaded on first search (fuzzy / prefix / title-weighted).
- **Offline** — service worker caches the app shell and visited pages.

## 🛠 Tech stack

Next.js 14 (App Router, `output: 'export'`) · TypeScript · Tailwind CSS · MiniSearch · DeepSeek (build-time, optional) · GitHub Actions → GitHub Pages.

## 🏗 Architecture

```
GitHub Actions (daily cron / push / manual)
        │
        ▼
  npm run crawl ── parallel fetch 20+ sources ──▶ dedupe + firstSeen + classify + clean
        │                              │
        │            (optional) DeepSeek notes / must-read / daily lead-ins
        │                              ▼
        │     data/items.json · meta.json · digest.json · archive/*.json
        ▼
  next build (output: export) ── embed snapshot + generate topic pages
        ▼
       out/ ──▶ deploy-pages ──▶ GitHub Pages (fully static)
```

## 🍴 Get your own in 5 minutes

1. **Fork**
2. **Settings → Pages → Source: GitHub Actions**
3. (optional) add secret `DEEPSEEK_API_KEY`
4. Run **Build & Deploy** in Actions
5. Visit `https://<you>.github.io/AI-Search/`

## 💻 Local development

```bash
git clone https://github.com/keyuchen-del/AI-Search.git
cd AI-Search && npm install
npm run crawl
npm run dev                       # http://localhost:3000
DATA_SOURCE=local npm run build   # static export -> out/
```

See env vars / scripts / structure in the [Chinese README](README.md).

## 🧱 Use cases

It's essentially a **"crawl → AI-process → static host" news-site template**. Swap the sources and classification to spin up an industry-intelligence hub, a vertical news aggregator, or a personal knowledge base — serverless, no ops, AI optional.

## 🤝 Contributing

PRs welcome — the most common is **adding a source** (one line in `FEEDS`). See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

[MIT](LICENSE) © [keyuchen-del](https://github.com/keyuchen-del)

<div align="center">

# 🔍 AI Search

**自动聚合全网 AI 资讯的知识库 —— 每日抓取、AI 点评、个性化、可检索、可安装。纯静态、访客零成本、Fork 一份即拥有同款。**

简体中文 ・ [English](README.en.md)

[![在线访问](https://img.shields.io/badge/🌐_在线访问-Live_Demo-2ea44f?style=for-the-badge)](https://keyuchen-del.github.io/AI-Search/)

[![Stars](https://img.shields.io/github/stars/keyuchen-del/AI-Search?style=flat&logo=github)](https://github.com/keyuchen-del/AI-Search/stargazers)
[![Forks](https://img.shields.io/github/forks/keyuchen-del/AI-Search?style=flat&logo=github)](https://github.com/keyuchen-del/AI-Search/network/members)
[![Deploy](https://img.shields.io/github/actions/workflow/status/keyuchen-del/AI-Search/deploy.yml?logo=githubactions&logoColor=white&label=daily%20deploy)](https://github.com/keyuchen-del/AI-Search/actions)
[![Last Commit](https://img.shields.io/github/last-commit/keyuchen-del/AI-Search?logo=git&logoColor=white)](https://github.com/keyuchen-del/AI-Search/commits)
[![License](https://img.shields.io/github/license/keyuchen-del/AI-Search)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)

<br/>

<!-- 👉 把首页截图放到 docs/images/screenshot-home.png（建议宽 1280px）后取消下一行注释 -->
<!-- ![AI Search 首页](docs/images/screenshot-home.png) -->

> 📸 **建议在此放一张首页截图 / 操作 GIF**（演示时最直观）。把图放进 `docs/images/` 后取消上面那行注释即可。

</div>

---

## ✨ 一句话

> 一个**每天自动更新、带 AI 解读、可个性化、可全文检索、可安装到手机**的 AI 行业资讯站。
> 没有服务器、没有数据库、访客侧不需要任何 API Key —— 全部跑在 GitHub Pages 的免费额度内。
> 想要自己的同款？**Fork 一下，5 分钟上线**；换掉数据源，它就是任何垂直领域的资讯知识库模板。

## 🎯 核心亮点

- 🤖 **AI 增强**：为每条资讯生成「一句话点评」，每天自动挑选「必读」，日报每条配 AI 导读。
- 🧠 **会沉淀的知识库**：历史归档 + 自动生成的「话题页 / 来源页」+ 全文模糊搜索，资讯不再阅后即焚。
- 🎨 **杂志式阅读**：头条 Hero + 封面图 + 小红书式错落瀑布流，干净好看。
- 🎯 **千人千面**：关注 / 屏蔽来源、关注话题、收藏、已读 —— 全存在你自己的浏览器，无需登录。
- ⚡ **零成本 · 零延迟**：纯静态，筛选 / 搜索 / 排序全在本地即时完成；每天 GitHub Actions 自动抓取重建。
- 🍴 **Fork 即用**：开 Pages、（可选）配一个 LLM Key，就有你自己的站；加数据源只需一行。

## 📸 界面预览

<!-- 放进 docs/images/ 后取消注释 -->
<!--
| 首页（头条 + 瀑布流） | AI 资讯日报 | 话题页 |
| :---: | :---: | :---: |
| ![首页](docs/images/screenshot-home.png) | ![日报](docs/images/screenshot-daily.png) | ![话题](docs/images/screenshot-topic.png) |
-->

_截图占位中 —— 演示前补上效果最佳。_

## 🚀 功能全景

**内容与聚合**

| 功能 | 说明 |
|------|------|
| 多源抓取 | 每日并行抓取 20+ 公开来源（模型实验室 / 学术 / 媒体 / 社区 / 中文），单源失败不影响整体 |
| 智能归一 | 去重（URL + 跨源同标题）、自动分类、清洗乱码（HTML/实体）、`firstSeen` 收录时间标记 |
| AI 资讯日报 | 按「当天新收录」自动汇编：今日精选（跨板块）+ 五大板块重点 + 快讯，每条带 AI 导读 |
| 来源健康看板 | 侧栏展示各源条数、更新时间、失败来源 |

**浏览与发现**

| 功能 | 说明 |
|------|------|
| 分类 / 时间窗 | 模型 / 产品 / 行业 / 论文 / 观点；24h / 3d / 7d / 30d |
| 来源筛选 | 点侧栏来源即筛选，支持一键清除 |
| 排序 | 最新 / 最热 切换 |
| 视图 | 全部 / 今日新增 / 收藏 / 未读 + NEW 角标（48h 内） |
| 命令面板 ⌘K | 快捷搜索资讯、跳转分类 / 来源 / 日报（全文模糊搜索） |
| 话题页 | 自动生成 `/topic/openai`、`/topic/anthropic`、`/topic/agent` 等，聚合该实体全部历史 |
| 热门榜单 | 「本周最热」按 GitHub Star / HN 讨论度排序，每条标注来源指标 |

**个性化（纯浏览器本地，无需登录）**

| 功能 | 说明 |
|------|------|
| 关注 / 屏蔽来源 | 关注的优先靠前，屏蔽的隐藏 |
| 关注话题 | 命中话题的内容加权靠前 |
| 收藏 / 已读 | 一键收藏、点开标已读、淡化已读；收藏可一键导出为 Markdown |

**AI 能力（构建时生成，访客零 Key）**

| 功能 | 说明 |
|------|------|
| 一句话点评 | 为新条目生成 ≤40 字中文点评，缓存进快照、不重复花钱、每次封顶 |
| AI 每日必读 | 每天从当天内容精选 3–5 条 + 推荐理由，首页置顶 |
| 日报 AI 导读 | 日报每条标题下的简明 AI 介绍 |

**体验**

| 功能 | 说明 |
|------|------|
| 杂志式视觉 | 头条 Hero + 封面缩略图 + 错落瀑布流（无图优雅降级） |
| PWA | 可「添加到主屏」、离线可读已访问内容 |
| 响应式 | 桌面 / 移动自适应 |

## 🤖 AI 能力（可选 · 成本可控）

三项 AI 能力都在**构建时**由 GitHub Actions 调用 LLM 生成、结果缓存进快照 —— 所以**访客侧依旧是纯静态、零 Key、零延迟**，只有维护者需要配一个 key。

- 默认用 **DeepSeek**（便宜、中文好）；只分析「新」条目、结果缓存、每次封顶（`AI_NOTE_MAX`），日报必读按天缓存 → **每日成本极低**。
- 启用：仓库加一个 Secret —— `gh secret set DEEPSEEK_API_KEY -R <你的用户名>/AI-Search`。
- **不配也能用**：AI 功能自动跳过、相关区域隐藏，其余功能不受影响。可换模型（`LLM_MODEL`）。

## 🧠 知识库 / 架构亮点

- **历史归档**：`data/archive/YYYY-MM.json` 月度分片、按 id 去重、保留近 3 月 —— 站点从「今日快照」变成可沉淀、可回溯的知识库。
- **话题页**：`lib/entities.ts` 抽取实体（模型 / 公司 / 主题），`generateStaticParams` 为出现≥5 次的实体生成静态聚合页，**展示深度 + SEO 双赢**，且不增加首页复杂度。
- **全文搜索**：构建期之外，客户端首次搜索时懒加载 **MiniSearch**，模糊 / 前缀 / 标题加权。
- **可离线**：service worker 缓存应用壳与已访问页。

## 📡 数据来源（全部为公开 RSS / API）

- **模型实验室 / 研究**：OpenAI、Google AI、DeepMind、HuggingFace（Blog + Daily Papers）、Microsoft Research、Berkeley AI、MIT News
- **学术 / 深度**：arXiv（cs.AI / cs.CL / cs.LG）、Lil'Log、Ahead of AI、The Gradient
- **代码 / 工具**：GitHub（按话题的新仓库）、AWS ML Blog
- **科技媒体**：The Verge、TechCrunch、VentureBeat、Ars Technica、MIT Tech Review
- **社区**：Hacker News、Simon Willison
- **中文**：量子位、36氪、InfoQ

> 每条内容保留原始链接可溯源；失效 / 被限流的源会在「数据来源」看板标出。**加一个源只需在 `scripts/sources/rss.ts` 加一行。**

## 🛠 技术栈

| 层 | 选型 |
|----|------|
| 框架 | Next.js 14（App Router · `output: 'export'` 全静态导出）+ TypeScript |
| 样式 | Tailwind CSS 3.4 |
| 抓取 | `scripts/crawl.ts` 并行 + 失败隔离；归一 / 去重 / firstSeen / 分类 纯函数 |
| 搜索 | MiniSearch（客户端懒加载） |
| AI | DeepSeek（构建时，可选） |
| 部署 | GitHub Actions（每日 cron + push + 手动）→ GitHub Pages |

## 🏗 架构

```
GitHub Actions（每日 cron / push / 手动）
        │
        ▼
  npm run crawl ── 并行抓取 20+ 源 ──▶ 去重 + firstSeen + 分类 + 清洗
        │                                   │
        │                  （可选）DeepSeek 点评 / 每日必读 / 日报导读
        │                                   ▼
        │            data/items.json · meta.json · digest.json · archive/*.json
        ▼
  next build (output: export) ── 读取快照内嵌 + 生成话题静态页
        ▼
       out/ ──▶ deploy-pages ──▶ GitHub Pages（纯静态）
        │
        ▼
   浏览器：筛选 / 搜索 / 排序 / 个性化 / 收藏 全在本地即时计算（零延迟）
```

## 🍴 5 分钟拥有你自己的站点

1. 点右上角 **Fork**
2. Fork 仓库 **Settings → Pages → Source 选 GitHub Actions**
3.（可选）加 Secret `DEEPSEEK_API_KEY` 启用 AI 能力
4. **Actions** 里跑一次 **Build & Deploy**（或推送一次代码）
5. 访问 `https://<你的用户名>.github.io/AI-Search/`

之后每天自动抓取重建，无需维护。

## 💻 本地开发

```bash
git clone https://github.com/keyuchen-del/AI-Search.git
cd AI-Search && npm install

npm run crawl                 # 抓取真实数据到 data/（仓库已自带快照）
npm run dev                   # http://localhost:3000
DATA_SOURCE=local npm run build   # 生产静态构建（产物 out/）
```

<details>
<summary>📖 环境变量 / 脚本 / 项目结构（点击展开）</summary>

### 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_BASE_PATH` | 空 | Pages 子路径（CI 设 `/AI-Search`） |
| `DATA_SOURCE` | `auto` | `auto` / `local` / `mock`；构建用 `local` |
| `DEEPSEEK_API_KEY` | — | 启用 AI 能力（不设则跳过） |
| `LLM_MODEL` | `deepseek-chat` | AI 模型 |
| `AI_NOTE_MAX` | `30` | 每次构建最多生成多少条新点评 |
| `DIGEST_PICKS` | `5` | 每日必读条数 |
| `ARCHIVE_MONTHS` | `3` | 历史归档保留月数 |
| `GITHUB_TOKEN` | — | 抓取 GitHub 限额（CI 自带） |

### 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产静态构建（`out/`） |
| `npm run crawl` | 抓取 + 可选 AI + 写归档 |
| `npm run crawl -- --only=hf,github` | 仅抓指定源 |

### 项目结构

```
AI-Search/
├── app/                 # 路由：首页 / 日报 / 话题页 / manifest
├── components/          # HomeClient / FeedSection / ItemCard / Hero / Sidebar
│                        # CommandPalette / PersonalizeModal / TopReads / DailyView / TopicFeed
├── lib/                 # types / filter / personalize / userStore / entities
│                        # archive / text(清洗) / highlight / href / config
├── scripts/
│   ├── crawl.ts         # 抓取编排
│   ├── lib/             # fetch / persist(快照 diff) / aiNote / digest / archive
│   └── sources/         # arxiv / github / hackernews / hfPapers / rss
├── data/                # items.json / meta.json / digest.json / archive/*.json
└── .github/workflows/deploy.yml
```

</details>

## 🧱 适用场景（可复用为任意领域的资讯知识库）

本项目本质是一个**「自动抓取 → AI 加工 → 静态托管」的资讯站模板**。换掉数据源与分类，即可几乎零成本地搭出：

- 团队 / 公司的**行业情报站**（自动汇编每日要点）
- 某个垂直领域（医疗 AI、芯片、出海、Web3…）的**资讯聚合站**
- 个人**领域知识库 / 周报源**

零服务器、零运维、按需配 AI —— 适合做 Demo、内部工具或对外产品的起点。

## 🗺 Roadmap

- [ ] `/topics` 话题总览页 · 话题热度趋势图
- [ ] AI 周报 `/weekly`
- [ ] 英文界面 i18n
- [ ] 更多无图源的统一封面 / 来源 logo

## 🤝 贡献

欢迎 PR！最常见的贡献是**加一个数据源**（`FEEDS` 加一行）。详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=keyuchen-del/AI-Search&type=Date)](https://star-history.com/#keyuchen-del/AI-Search&Date)

## 📄 License

[MIT](LICENSE) © [keyuchen-del](https://github.com/keyuchen-del)

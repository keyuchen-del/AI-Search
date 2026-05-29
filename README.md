<div align="center">

# 🔍 AI Search

**每天自动聚合 20+ 来源的 AI 行业资讯，带个性化、收藏与 AI 点评 —— 纯静态、访客零成本、Fork 一份就有你自己的同款站。**

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

> ⚠️ **README 顶部还缺一张首页截图 / 操作 GIF** —— 这是涨 star 的头号转化点。
> 录制方法见 [`docs/images/README.md`](docs/images/README.md)，拖进去后取消上面那行注释即可。

</div>

---

## ✨ 这是什么

每天，GitHub Actions 自动从 **20+ 个公开来源**（OpenAI / DeepMind / HuggingFace / arXiv / Hacker News / 量子位 / 36氪 …）抓取最新 AI 资讯，自动去重、分类、打上「首次发现时间」，重新构建并发布到 GitHub Pages。

整站是**纯静态站点**：

- 🆓 **访客零成本** —— 没有后端、没有数据库、访客侧不需要任何 API Key，全部跑在 GitHub Pages 免费额度内
- 🔄 **永远新鲜** —— 每天自动抓取 + 重新部署，无需人工维护
- ⚡ **零延迟** —— 筛选 / 搜索 / 排序 / 分页全在浏览器本地完成，数据内嵌进页面
- 🎯 **千人千面** —— 关注 / 屏蔽来源、关注话题、收藏、已读，全部存在你自己的浏览器
- 🤖 **AI 增强（可选）** —— 配一个 LLM key，即可为新条目生成「一句话点评」+ 每天精选「必读」
- 🍴 **可复制** —— Fork 一份，开启 Pages，5 分钟拥有你自己的同款 AI 资讯站

## 🚀 功能一览

| 功能 | 说明 |
|------|------|
| 分类浏览 | 模型发布 / 产品更新 / 行业动态 / 论文研究 / 技巧观点 五大分类 |
| 精选 / 全部 | 默认精选条目，可切换查看全量 |
| 时间窗筛选 | 24 小时 / 3 天 / 7 天 / 30 天 |
| 关键词搜索 | 标题 + 摘要 + 来源 + 标签即时匹配，命中处**高亮**（纯前端，零延迟） |
| 视图切换 | 全部 / 今日新增 / 收藏 / 未读 |
| NEW 角标 | 基于「本站首次发现时间」(firstSeen)，48 小时内的新内容自动标 NEW |
| ⭐ 收藏 | 点卡片右上角收藏，「收藏」视图集中查看，可一键**导出为 Markdown** |
| 已读 | 点开原文自动标记已读、卡片淡化，「未读」视图只看没读过的 |
| 个性化 | 关注 / 屏蔽来源、关注话题；关注的优先靠前、屏蔽的隐藏（存本地） |
| AI 一句话点评 | 为新条目生成不超过 40 字的中文点评（需 LLM key，构建时生成、缓存） |
| AI 每日必读 | 每天从当天内容精选 3–5 条 + 推荐理由，首页置顶（需 LLM key） |
| 来源健康看板 | 侧栏展示各数据源条数、更新时间、失败来源 |
| AI 日报 | 按天聚合的日报，含主编点评、分类摘要、快讯；条目支持收藏 / 已读 |
| 日报存档 | 按日期回溯历史日报 |
| 热门榜单 | 侧边栏按热度（Star / 点赞 / HN points）排序 Top 8 |
| 自动刷新 | GitHub Actions 每日抓取 + 重新构建 + 部署 |
| 响应式 | 适配桌面端与移动端 |

## 🤖 AI 增强（可选）

两个 AI 功能都在**构建时**由 GitHub Actions 调用 LLM 生成、结果缓存进快照 —— 所以**访客侧依旧是纯静态、零 Key、零延迟**，只有维护者需要配一个 key。

| 功能 | 说明 |
|------|------|
| 一句话点评 | 每次构建为「新」条目生成中文点评，已生成的缓存进 `items.json` 不重复花钱；每次封顶 `AI_NOTE_MAX`（默认 30）条 |
| 每日必读 | 每天（按北京日期）从当天内容选 `DIGEST_PICKS`（默认 5）条 + 理由，写入 `data/digest.json`，同日重复构建不再调用 |

**启用方式**：在仓库加一个 Secret（默认用 [DeepSeek](https://platform.deepseek.com/)，便宜、中文好）：

```bash
gh secret set DEEPSEEK_API_KEY -R <你的用户名>/AI-Search   # 粘贴你的 key
```

> 不配 key 也能正常用 —— 这两个 AI 功能会自动跳过，点评行与必读卡片隐藏，其余功能不受影响。
> 想换模型：`LLM_MODEL`（默认 `deepseek-chat`）。适配层在 `scripts/lib/aiNote.ts` / `scripts/lib/digest.ts`。

## 🎯 个性化与收藏（纯浏览器本地）

无需登录、无账号、无服务器 —— 所有个人数据只存在你这台浏览器的 `localStorage`：

- **关注 / 屏蔽来源**、**关注话题**：关注的内容在「综合」里优先靠前，屏蔽的来源直接隐藏。
- **收藏（★）**：随手收藏，「收藏」视图集中看，支持**导出为 Markdown**（复制到剪贴板）。
- **已读**：点开即标记，支持「只看未读」。
- 首页与「日报」页**共享同一份收藏 / 已读状态**。

## 🍴 一键拥有你自己的站点

1. 点击右上角 **Fork** 本仓库
2. 打开你 Fork 仓库的 **Settings → Pages**，将 **Source** 选为 **GitHub Actions**
3.（可选）加 Secret `DEEPSEEK_API_KEY` 以启用 AI 点评 / 每日必读
4. 打开 **Actions** 标签页，运行一次 **Build & Deploy to GitHub Pages**（或随意推送一次代码）
5. 等待绿色对勾，访问 `https://<你的用户名>.github.io/AI-Search/`

之后每天工作流会自动重新抓取数据并发布，站点始终保持新鲜。想加自己关注的来源？只需在 `scripts/sources/rss.ts` 的 `FEEDS` 数组里加一行 —— 详见 [CONTRIBUTING](CONTRIBUTING.md)。

## 📡 数据来源（全部为公开 RSS / API）

- **模型实验室 / 研究机构**：OpenAI、Google AI、Google DeepMind、HuggingFace（Blog + Daily Papers）、Berkeley AI Research、MIT News、Microsoft Research
- **学术 / 深度**：arXiv（cs.AI / cs.CL / cs.LG）、HuggingFace Daily Papers、Lil'Log、Ahead of AI（Sebastian Raschka）、The Gradient
- **代码 / 工具**：GitHub（按 llm / ai-agent / rag / multimodal 等话题的新仓库）、AWS Machine Learning Blog
- **科技媒体**：The Verge、TechCrunch、VentureBeat、Ars Technica、MIT Technology Review
- **社区**：Hacker News（AI 相关高热故事）、Simon Willison
- **中文**：量子位、36氪、InfoQ

每条内容均保留原始来源链接，点击可追溯到源站。失效 / 被限流的来源会在「来源健康看板」中标出。

## 🛠 技术栈

- **框架**：Next.js 14（App Router，`output: 'export'` 全静态导出）+ TypeScript + Tailwind CSS
- **交互**：首屏服务端预渲染默认视图，筛选 / 搜索 / 排序 / 个性化 / 分页全部在浏览器内完成（数据内嵌，无需请求）
- **抓取**：`scripts/crawl.ts`，各来源并行、互不影响（一个失败不影响整体）
- **管线**：归一 → 去重（URL + 跨源同标题）→ firstSeen 快照 diff → 分类 → 打分
- **AI（可选）**：构建时 DeepSeek 生成一句话点评 + 每日必读，缓存进快照
- **部署**：GitHub Actions → GitHub Pages（零服务器、访客零成本）

## 🏗 架构

```
GitHub Actions（每日 cron / push / 手动）
        │
        ▼
  npm run crawl ── 并行抓取 20+ 来源 ──▶ 去重 + firstSeen diff + 分类
        │                                      │
        │                         （可选）DeepSeek 一句话点评 + 每日必读
        │                                      ▼
        │                          data/items.json + data/digest.json
        ▼
  next build (output: export, DATA_SOURCE=local)
        │  读取快照，内嵌进静态页面
        ▼
       out/  ──▶ upload-pages-artifact ──▶ deploy-pages ──▶ GitHub Pages
```

浏览器加载后，全部 Query（分类 / 时间窗 / 关键词 / 视图 / 个性化 / 分页）在本地对内嵌数据集即时计算，交互零延迟、不依赖任何运行时服务。

## 💻 本地开发

```bash
git clone https://github.com/keyuchen-del/AI-Search.git
cd AI-Search
npm install

# 1) 抓取真实数据到 data/（可选，仓库已自带一份快照）
#    配了 DEEPSEEK_API_KEY 才会生成 AI 点评 / 每日必读
CRAWL_ARXIV=1 npm run crawl

# 2) 开发服务器
npm run dev            # http://localhost:3000

# 3) 生产静态构建（产物在 out/）
DATA_SOURCE=local npm run build
```

> 注意：`npm run dev` 下 `basePath` 为空（根路径）；只有 CI 构建会注入 `NEXT_PUBLIC_BASE_PATH=/AI-Search` 以适配 Pages 子路径。

<details>
<summary>📖 环境变量 / 分类体系 / 脚本 / 项目结构（点击展开）</summary>

### 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_BASE_PATH` | 空 | Pages 子路径前缀（CI 设为 `/AI-Search`） |
| `DATA_SOURCE` | `auto` | `auto` / `local` / `mock`；构建静态站点用 `local` |
| `STORE_MAX_AGE_HOURS` | `168` | `auto` 模式下快照过期阈值（小时），0 表示不过期 |
| `GITHUB_TOKEN` | — | 抓取 GitHub 时提升限额（CI 自带） |
| `RSS_MAX_PER_FEED` | `20` | 每个 RSS 源最多抓取条数 |
| `HN_MIN_POINTS` | `40` | Hacker News 收录的最低点数 |
| `CRAWL_ARXIV` | 关 | 置 `1` 抓取 arXiv（CI 默认开启） |
| `DEEPSEEK_API_KEY` | — | 启用 AI 点评 / 每日必读（不设则跳过） |
| `LLM_MODEL` | `deepseek-chat` | AI 功能使用的模型 |
| `AI_NOTE_MAX` | `30` | 每次构建最多生成多少条新点评 |
| `DIGEST_PICKS` | `5` | 每日必读挑选的条数 |

### 分类体系

| Key | 标签 | 说明 |
|-----|------|------|
| `ai-models` | 模型发布/更新 | 大模型与基础模型的发布与更新 |
| `ai-products` | 产品发布/更新 | 新产品、新功能、开源项目 |
| `industry` | 行业动态 | 融资、政策、商业与重大事件 |
| `paper` | 论文研究 | 论文、技术报告与研究进展 |
| `tip` | 技巧与观点 | 实用技巧与深度观点 |

### 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热重载） |
| `npm run build` | 生产静态构建（输出到 `out/`） |
| `npm run crawl` | 抓取所有来源到 `data/items.json`（+ 可选 AI 点评 / 每日必读） |
| `npm run crawl -- --only=hf,github` | 仅抓取指定来源 |
| `npm run lint` | ESLint 检查 |

### 项目结构

```
AI-Search/
├── app/                        # 路由：首页 / 日报 / globals.css
├── components/                 # HomeClient / FeedSection / ItemCard / Sidebar
│   ├── PersonalizeModal.tsx    # 关注 / 屏蔽来源 + 话题
│   ├── TopReads.tsx            # AI 每日必读卡片
│   └── DailyView.tsx           # 日报（支持收藏 / 已读）
├── lib/
│   ├── classify.ts             # 纯分类器
│   ├── filter.ts               # 纯筛选 / 排序 / 分页
│   ├── personalize.ts          # 关注 / 屏蔽 / 话题加权
│   ├── userStore.ts            # 收藏 / 已读 / 关注（localStorage）
│   ├── highlight.tsx           # 搜索关键词高亮
│   ├── localStore.ts / config.ts
├── scripts/
│   ├── crawl.ts                # 抓取编排（并行 + dedupe + firstSeen + AI）
│   ├── lib/                    # fetch / persist(快照 diff) / aiNote / digest
│   └── sources/                # arxiv / github / hackernews / hfPapers / rss
├── data/                       # items.json / meta.json / digest.json（CI 每日刷新）
└── .github/workflows/deploy.yml
```

</details>

## 🤝 贡献

欢迎 PR！最常见的贡献是**新增一个数据源**（在 `FEEDS` 加一行即可）。详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## ⭐ Star History

如果这个项目对你有用，点个 Star 支持一下 —— 这是对开源最好的鼓励。

[![Star History Chart](https://api.star-history.com/svg?repos=keyuchen-del/AI-Search&type=Date)](https://star-history.com/#keyuchen-del/AI-Search&Date)

## 📄 License

[MIT](LICENSE) © [keyuchen-del](https://github.com/keyuchen-del)

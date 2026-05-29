# AI Search

> AI 行业资讯聚合站 —— 一站式追踪大模型发布、AI 产品、行业动态、论文研究与技巧观点。

**🌐 在线访问（无需安装，打开即用）：https://keyuchen-del.github.io/AI-Search/**

数据由 GitHub Actions 每天自动从 20+ 个公开来源抓取、分类、并重新构建发布到 GitHub Pages。
整站是**纯静态站点**：没有后端服务器、没有数据库、不需要任何 API Key，任何人 Fork 后开启 Pages 即可拥有自己的同款站点。

---

## 一键拥有你自己的站点

1. 点击右上角 **Fork** 本仓库
2. 打开你 Fork 仓库的 **Settings → Pages**，将 **Source** 选为 **GitHub Actions**
   （首次推送时工作流也会尝试自动开启）
3. 打开 **Actions** 标签页，运行一次 **Build & Deploy to GitHub Pages**（或随意推送一次代码）
4. 等待绿色对勾，访问 `https://<你的用户名>.github.io/AI-Search/`

之后每天 22:17 (UTC) 工作流会自动重新抓取数据并发布，站点始终保持新鲜。

---

## 功能一览

| 功能 | 说明 |
|------|------|
| 分类浏览 | 模型发布 / 产品更新 / 行业动态 / 论文研究 / 技巧观点 五大分类 |
| 精选 / 全部 | 默认精选条目，可切换查看全量 |
| 时间窗筛选 | 24 小时 / 3 天 / 7 天 / 30 天 |
| 关键词搜索 | 标题 + 摘要 + 来源 + 标签即时匹配（纯前端，零延迟） |
| AI 日报 | 按天聚合的日报，含主编点评、分类摘要、快讯 |
| 日报存档 | 按日期回溯历史日报 |
| 热门榜单 | 侧边栏按热度（Star / 点赞 / HN points）排序 Top 8 |
| 自动刷新 | GitHub Actions 每日抓取 + 重新构建 + 部署 |
| 响应式 | 适配桌面端与移动端 |

---

## 数据来源（全部为公开 RSS / API）

- **模型实验室 / 研究机构**：OpenAI、Google AI、Google DeepMind、HuggingFace（Blog + Daily Papers）、Berkeley AI Research、MIT News
- **学术**：arXiv（cs.AI / cs.CL / cs.LG）、HuggingFace Daily Papers
- **代码 / 工具**：GitHub（按 llm / ai-agent / rag / multimodal 等话题的新仓库）
- **科技媒体**：The Verge、TechCrunch、VentureBeat、Ars Technica、MIT Technology Review
- **社区**：Hacker News（AI 相关高热故事）、Simon Willison
- **中文**：量子位、36氪、InfoQ

每条内容均保留原始来源链接，点击可追溯到源站。新增来源只需在 `scripts/sources/rss.ts` 的 `FEEDS` 数组里加一行。

---

## 技术栈

- **框架**：Next.js 14（App Router，`output: 'export'` 全静态导出）+ TypeScript
- **样式**：Tailwind CSS 3.4
- **交互**：首屏服务端预渲染默认视图，筛选 / 搜索 / 分页全部在浏览器内完成（数据内嵌，无需请求）
- **抓取**：`scripts/crawl.ts`，各来源并行、互不影响（一个失败不影响整体）
- **分类**：`lib/classify.ts` 纯函数，把异构来源统一归入 5 个分类（含模型发布识别）
- **部署**：GitHub Actions → GitHub Pages（零服务器、零成本）

---

## 架构

```
GitHub Actions（每日 cron / push / 手动）
        │
        ▼
  npm run crawl ── 并行抓取 20+ 来源 ──▶ dedupe + classify ──▶ data/items.json
        │
        ▼
  next build (output: export, DATA_SOURCE=local)
        │  读取 data/items.json，内嵌进静态页面
        ▼
       out/  ──▶ upload-pages-artifact ──▶ deploy-pages ──▶ GitHub Pages
```

浏览器加载页面后，全部 Query（分类 / 时间窗 / 关键词 / 分页 / 排序）在本地对内嵌数据集即时计算，因此交互零延迟、不依赖任何运行时服务。

---

## 本地开发

```bash
git clone https://github.com/keyuchen-del/AI-Search.git
cd AI-Search
npm install

# 1) 抓取真实数据到 data/items.json（可选，仓库已自带一份快照）
CRAWL_ARXIV=1 npm run crawl

# 2) 开发服务器
npm run dev            # http://localhost:3000

# 3) 生产静态构建（产物在 out/）
DATA_SOURCE=local npm run build
```

> 注意：`npm run dev` 下 `basePath` 为空（根路径）；只有 CI 构建会注入 `NEXT_PUBLIC_BASE_PATH=/AI-Search` 以适配 Pages 子路径。

---

## 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_BASE_PATH` | 空 | Pages 子路径前缀（CI 设为 `/AI-Search`） |
| `DATA_SOURCE` | `auto` | `auto` / `local` / `mock`；构建静态站点用 `local` |
| `STORE_MAX_AGE_HOURS` | `168` | `auto` 模式下快照过期阈值（小时），0 表示不过期 |
| `GITHUB_TOKEN` | — | 抓取 GitHub 时提升限额（CI 自带） |
| `GITHUB_TOPICS` | `llm,ai-agent,...` | GitHub 抓取的话题（逗号分隔） |
| `CRAWL_DAYS` | `30` | GitHub 新仓库时间窗（天） |
| `RSS_MAX_PER_FEED` | `20` | 每个 RSS 源最多抓取条数 |
| `HN_MIN_POINTS` | `40` | Hacker News 收录的最低点数 |
| `CRAWL_ARXIV` | 关 | 置 `1` 抓取 arXiv（CI 默认开启） |

---

## 分类体系

| Key | 标签 | 说明 |
|-----|------|------|
| `ai-models` | 模型发布/更新 | 大模型与基础模型的发布与更新 |
| `ai-products` | 产品发布/更新 | 新产品、新功能、开源项目 |
| `industry` | 行业动态 | 融资、政策、商业与重大事件 |
| `paper` | 论文研究 | 论文、技术报告与研究进展 |
| `tip` | 技巧与观点 | 实用技巧与深度观点 |

---

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热重载） |
| `npm run build` | 生产静态构建（输出到 `out/`） |
| `npm run crawl` | 抓取所有来源到 `data/items.json` |
| `npm run crawl -- --only=hf,github` | 仅抓取指定来源 |
| `npm run lint` | ESLint 检查 |

---

## 项目结构

```
AI-Search/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页（读取快照 → 内嵌 → 客户端筛选）
│   ├── globals.css
│   └── daily/
│       ├── page.tsx            # 最新日报
│       └── [date]/page.tsx     # 指定日期日报（generateStaticParams 预渲染）
├── components/
│   ├── HomeClient.tsx          # 首页交互（筛选/搜索/分页，纯前端）
│   ├── Header / CategoryNav / SortTabs / ItemList / ItemCard
│   ├── Sidebar / Pagination / DailyView / DataSourceBanner
├── lib/
│   ├── types.ts                # 类型定义
│   ├── classify.ts             # 纯分类器（含模型发布识别）
│   ├── filter.ts               # 纯筛选/排序/分页（客户端复用）
│   ├── categories.ts           # 分类常量
│   ├── dailyData.ts            # 日报数据层
│   ├── localStore.ts           # 读取本地快照
│   ├── config.ts               # 数据源 / 路径配置
│   ├── mockData.ts             # 离线兜底示例数据
│   └── timeFormat.ts           # 北京时间格式化
├── scripts/
│   ├── crawl.ts                # 抓取编排（并行 + dedupe + classify）
│   ├── lib/                    # fetch 工具 / 持久化
│   └── sources/                # arxiv / github / hackernews / hfPapers / rss
├── data/
│   ├── items.json              # 抓取快照（CI 每日刷新）
│   └── meta.json               # 抓取元数据
├── public/.nojekyll            # 保证 _next 资源不被 Pages 过滤
└── .github/workflows/deploy.yml # 抓取 + 构建 + 部署
```

---

## License

[MIT](LICENSE)

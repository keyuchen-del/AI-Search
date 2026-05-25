# AI-Search

AI 行业资讯聚合站点 —— 默认对接 [aihot.virxact.com](https://aihot.virxact.com) 的公开 REST API，按 AI HOT 的 5 类分类体系（模型/产品/行业/论文/技巧观点）展示精选条目；不可达时自动回退到本地示例数据。

## 技术栈

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- React Server Components for SSR + 5min in-memory 缓存
- aihot 适配层（强制浏览器 UA、超时控制、auto fallback）

## 路由

- `/` 首页：分类 + 精选/全部模式 + 时间窗 + 关键词搜索 + 分页
- `/daily` 最新 AI HOT 日报（5 个固定 section + 主编点评 + 快讯）
- `/daily/[YYYY-MM-DD]` 指定日期日报
- `/api/items` 透传查询参数到 aihot（含 mock fallback）
- `/api/crawl` 爬虫触发桩（保留，后续若需要本地采集再启用）

## 关键查询参数

- `category` — `ai-models | ai-products | industry | paper | tip`
- `mode` — `selected`（默认精选）/ `all`（含次要条目）
- `since` — `24h | 3d | 7d`（默认 7d）
- `keyword` — 服务端 `q` 关键词检索
- `page` — 页码

## 数据源

通过环境变量 `DATA_SOURCE` 切换：

- `auto`（默认）— 优先调 aihot 公开 API，失败自动回退 mock 并在页顶显示提示
- `aihot` — 强制走真实 API
- `mock` — 强制走本地示例数据（离线开发用）

其他可选：

- `AIHOT_BASE_URL`（默认 `https://aihot.virxact.com`）
- `AIHOT_TIMEOUT_MS`（默认 `6000`）

## 本地开发

```bash
npm install
npm run dev
```

浏览：

- http://localhost:3000/
- http://localhost:3000/?category=ai-models&since=24h
- http://localhost:3000/?mode=all&since=7d
- http://localhost:3000/?keyword=OpenAI
- http://localhost:3000/daily

> 若本机网络不通 aihot.virxact.com（如内网/被墙），站点会自动展示 mock 数据并在顶部提示。部署到外网（Vercel 等）后会自动用真实数据。

## 输出纪律（学自 aihot SKILL 规约）

- 时间一律转北京时间 + 相对时间（"2 小时前" / "今天上午 09:48" / "昨天"）
- 每条 item 必显 `source` + `sourceUrl`，不丢追溯链路
- 不在 UI 中暴露 raw 参数名（`mode=selected` / `category=paper` / `cursor` 等）
- 默认 `mode=selected`；用户主动切到 `all` 才显示全部池子
- 关键词搜索走服务端 `q`，不做客户端 grep

## 归属

数据来自 [aihot.virxact.com](https://aihot.virxact.com)。所有条目链接回原始 source。

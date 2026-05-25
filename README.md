# AI-Search

AI 行业资讯聚合站点 —— 收集与索引 AI 行业的动态、产品、模型、研究、工具、投融资、政策与观点。

> 当前为骨架版本（v0.1）：UI、分类、分页、搜索、排序、API 接口已就绪，数据层使用示例数据，爬虫接入与持久化将在后续版本完成。

## 技术栈

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- React Server Components for SSR
- API Routes 提供 `/api/items` 与 `/api/crawl`(stub)

## 目录结构

```
app/                        # 页面与 API 路由
  layout.tsx
  page.tsx                  # 首页：分类 + 列表 + 分页 + 搜索
  globals.css
  api/
    items/route.ts          # GET /api/items
    crawl/route.ts          # POST /api/crawl  (爬虫触发桩)
components/                 # UI 组件
  Header.tsx
  SearchBar.tsx
  CategoryNav.tsx
  SortTabs.tsx
  Sidebar.tsx
  ItemCard.tsx
  ItemList.tsx
  Pagination.tsx
lib/                        # 数据层
  types.ts
  categories.ts
  mockData.ts               # 示例数据，后续被真实数据源替换
  queryItems.ts             # 查询、分页、过滤、排序
scripts/
  crawl.ts                  # 爬虫入口（当前为 stub）
```

## 本地开发

```bash
npm install
npm run dev
# http://localhost:3000
```

可访问的查询参数：

- `category` — `industry | product | model | research | tools | investment | policy | opinion`
- `sort` — `heat | latest`
- `page` — 页码
- `keyword` — 关键词搜索

示例：

- `/?category=industry&page=1`
- `/?category=model&sort=latest`
- `/?keyword=Agent`

## 后续路线

1. **数据源接入**：在 `scripts/sources/` 下按来源新增 adapter，统一归一化为 `AIItem`。
2. **持久化**：把抓取结果写入 SQLite / Postgres，替换 `lib/mockData.ts` 的内存数据源。
3. **反爬与稳健性**：UA 轮换、robots.txt 校验、退避重试、headless fallback。
4. **检索增强**：接入向量检索 + 全文检索，支持语义搜索。
5. **订阅与推送**：分类订阅、RSS、邮件 / Webhook 推送。

## 法律与版权

本项目仅做公开信息的聚合与索引，所有内容均跳转回原文出处。任何抓取需遵循目标站点的 `robots.txt` 与服务条款。

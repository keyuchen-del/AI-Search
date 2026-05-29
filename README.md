# AI Search

> AI 行业资讯聚合站 —— 一站式追踪大模型、AI 产品、行业动态、论文研究与技巧观点。

默认对接 [aihot.virxact.com](https://aihot.virxact.com) 公开 REST API，按 AI HOT 的 5 类分类体系展示精选条目；API 不可达时自动回退到本地示例数据，确保站点始终可用。

---

## 功能一览

| 功能 | 说明 |
|------|------|
| 分类浏览 | 模型发布/产品更新/行业动态/论文研究/技巧观点 五大分类 |
| 精选/全部模式 | 默认展示 AI HOT 每日精挑细选，可切换查看全量条目 |
| 时间窗筛选 | 24 小时 / 3 天 / 7 天 三档快速切换 |
| 关键词搜索 | 服务端全文检索，支持标题+摘要+标签匹配 |
| AI 日报 | 每日自动生成的 AI 行业日报，含主编点评、分类摘要、快讯 |
| 日报存档 | 按日期回溯历史日报 |
| 热门榜单 | 侧边栏实时展示热度 Top 8 |
| 分页 | 智能分页，支持省略号展示 |
| 自动降级 | API 不可达时无感切换至 Mock 数据，顶部提示当前数据源 |
| 响应式布局 | 适配桌面端与移动端 |

---

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS 3.4
- **渲染**: React Server Components (RSC) 服务端渲染
- **缓存**: 5 分钟内存缓存（减少上游 API 压力）
- **数据源**: aihot.virxact.com 公开 API + 本地 Mock 兜底

---

## 项目结构

```
AI-Search/
├── app/
│   ├── layout.tsx              # 根布局（meta、全局样式）
│   ├── page.tsx                # 首页（分类+搜索+列表+分页）
│   ├── globals.css             # 全局样式 + CSS 变量
│   ├── daily/
│   │   ├── page.tsx            # 最新日报页
│   │   └── [date]/page.tsx     # 指定日期日报页
│   └── api/
│       ├── items/route.ts      # 资讯列表 REST API
│       └── crawl/route.ts      # 爬虫触发桩（预留）
├── components/
│   ├── Header.tsx              # 顶部导航 + 搜索栏
│   ├── SearchBar.tsx           # 搜索输入框（Client Component）
│   ├── CategoryNav.tsx         # 分类标签导航
│   ├── SortTabs.tsx            # 模式/时间窗筛选条
│   ├── ItemList.tsx            # 资讯卡片网格
│   ├── ItemCard.tsx            # 单条资讯卡片
│   ├── Sidebar.tsx             # 侧边栏（热榜+快捷入口+关于）
│   ├── Pagination.tsx          # 分页组件
│   ├── DataSourceBanner.tsx    # 数据源状态提示
│   └── DailyView.tsx           # 日报详情视图
├── lib/
│   ├── types.ts                # TypeScript 类型定义
│   ├── categories.ts           # 分类常量与辅助函数
│   ├── aihot.ts                # aihot API 适配层（请求/缓存/超时）
│   ├── queryItems.ts           # 数据查询入口（auto 降级逻辑）
│   ├── dailyData.ts            # 日报数据层
│   ├── mockData.ts             # 本地示例数据生成器
│   └── timeFormat.ts           # 北京时间格式化工具
├── scripts/
│   └── crawl.ts                # 爬虫脚本入口（预留）
├── .env.example                # 环境变量模板
├── tailwind.config.ts          # Tailwind 配置
├── next.config.mjs             # Next.js 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 依赖与脚本
```

---

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/keyuchen-del/AI-Search.git
cd AI-Search

# 安装依赖
npm install

# 复制环境变量（可选）
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

浏览器打开 http://localhost:3000

### 生产构建

```bash
npm run build
npm start
```

---

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `DATA_SOURCE` | `auto` | 数据源模式：`auto` / `aihot` / `mock` |
| `AIHOT_BASE_URL` | `https://aihot.virxact.com` | aihot API 基础地址 |
| `AIHOT_TIMEOUT_MS` | `6000` | API 请求超时（毫秒） |

**模式说明：**
- `auto` — 优先调用 aihot API，失败时自动回退 Mock 数据并在页顶显示提示
- `aihot` — 强制使用真实 API（适合生产环境）
- `mock` — 强制使用本地示例数据（适合离线开发/演示）

---

## 路由说明

| 路由 | 类型 | 说明 |
|------|------|------|
| `/` | 页面 | 首页：分类浏览 + 精选/全部 + 时间窗 + 搜索 + 分页 |
| `/daily` | 页面 | 最新 AI HOT 日报 + 存档列表 |
| `/daily/[YYYY-MM-DD]` | 页面 | 指定日期的日报 |
| `/api/items` | API | 资讯列表查询接口 |
| `/api/crawl` | API | 爬虫任务触发（桩，预留后续扩展） |

### 查询参数

| 参数 | 可选值 | 默认 | 说明 |
|------|--------|------|------|
| `category` | `ai-models` `ai-products` `industry` `paper` `tip` | 全部 | 分类筛选 |
| `mode` | `selected` `all` | `selected` | 精选模式 / 全部模式 |
| `since` | `24h` `3d` `7d` | `7d` | 时间窗口 |
| `keyword` | 任意文本 | — | 关键词搜索 |
| `page` | 正整数 | `1` | 页码 |

**示例 URL：**
```
http://localhost:3000/?category=ai-models&since=24h
http://localhost:3000/?mode=all&since=7d
http://localhost:3000/?keyword=OpenAI
http://localhost:3000/daily
http://localhost:3000/daily/2025-05-01
```

---

## 架构设计

```
┌────────────────────────────────────────────────────┐
│                    Next.js App Router               │
├────────────────────────────────────────────────────┤
│  Server Components (RSC)    Client Components      │
│  ┌──────────────────────┐  ┌────────────────────┐  │
│  │ page.tsx / daily/    │  │ SearchBar.tsx       │  │
│  │ ItemList / Sidebar   │  │ (useSearchParams)  │  │
│  └──────────┬───────────┘  └────────────────────┘  │
│             │                                       │
│  ┌──────────▼───────────┐                          │
│  │   lib/queryItems.ts  │ ← 统一数据查询入口       │
│  │   lib/dailyData.ts   │                          │
│  └──────────┬───────────┘                          │
│             │                                       │
│  ┌──────────▼───────────┐                          │
│  │   lib/aihot.ts       │ ← API 适配层            │
│  │   (缓存/超时/降级)    │                          │
│  └──────────┬───────────┘                          │
│             │                                       │
├─────────────┼──────────────────────────────────────┤
│             ▼                                       │
│   aihot.virxact.com   ←→   lib/mockData.ts        │
│   (真实数据)                 (兜底数据)              │
└────────────────────────────────────────────────────┘
```

**核心设计原则：**

1. **数据源透明切换** — `queryItems()` 封装了 auto/aihot/mock 三种模式，上层组件无需感知数据来源
2. **服务端渲染优先** — 所有数据获取在 Server Component 完成，首屏即带完整内容
3. **优雅降级** — API 异常时自动回退 Mock 数据，页面永不白屏
4. **5 分钟缓存** — 内存级缓存减少对上游 API 的重复请求
5. **时区统一** — 所有时间统一转为北京时间 + 相对时间展示

---

## 分类体系

| Key | 标签 | 说明 |
|-----|------|------|
| `ai-models` | 模型发布/更新 | 大模型与基础模型的发布与更新 |
| `ai-products` | 产品发布/更新 | 新产品、新功能、新版本 |
| `industry` | 行业动态 | AI 行业趋势与重大事件 |
| `paper` | 论文研究 | 论文、技术报告与研究进展 |
| `tip` | 技巧与观点 | 实用技巧与深度观点 |

---

## 部署

### Vercel（推荐）

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 无需额外配置，默认 `DATA_SOURCE=auto` 即可连接真实数据
4. 部署完成后自动使用 aihot.virxact.com 真实数据

### 其他平台

支持任何 Node.js 18+ 环境：

```bash
npm run build
npm start
```

确保服务器可访问 `aihot.virxact.com`。

---

## 开发指南

### 添加新分类

1. 在 `lib/types.ts` 的 `CategoryKey` 联合类型中添加新值
2. 在 `lib/categories.ts` 的 `CATEGORIES` 数组中添加对应配置
3. 完成。分类导航、筛选逻辑自动适配

### 自定义数据源

1. 修改 `lib/aihot.ts` 中的 `BASE` 地址或实现新的 fetch 函数
2. 确保返回数据符合 `AihotItemsResponse` 接口
3. 在 `lib/queryItems.ts` 中注册新数据源

### 爬虫扩展（预留）

```bash
npm run crawl
```

当前为空壳。后续可在 `scripts/` 下添加采集适配器，将结果写入本地存储替换 Mock 数据。

---

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热重载） |
| `npm run build` | 生产构建 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | ESLint 代码检查 |
| `npm run crawl` | 运行爬虫脚本（预留） |

---

## 数据归属

所有资讯数据来自 [aihot.virxact.com](https://aihot.virxact.com)，每条内容均保留原始来源链接，点击可追溯到源站。

## License

[MIT](LICENSE)

# 贡献指南 / Contributing

感谢你愿意让 AI Search 变得更好!最受欢迎的贡献是**新增一个数据源**——通常只要加一行。

> English speakers: scroll down for the English version.

---

## 🇨🇳 新增一个数据源(最常见)

绝大多数来源都是标准 RSS / Atom,直接在 `scripts/sources/rss.ts` 的 `FEEDS` 数组里加一行即可:

```ts
{ id: "rss:example", label: "Example AI", url: "https://example.com/feed.xml", source: "Example", category: "ai-products" },
```

字段说明:

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `id` | ✅ | 唯一标识,格式 `rss:<slug>` |
| `label` | ✅ | 展示名(列表里的来源标签) |
| `url` | ✅ | RSS / Atom feed 地址 |
| `source` | ✅ | 来源品牌名 |
| `category` | ✅ | 分类兜底值:`ai-models` / `ai-products` / `industry` / `paper` / `tip` |
| `aiOnly` | ⬜ | 综合类 feed 设为 `true`,只保留 AI 相关条目 |

本地验证:

```bash
npm run crawl -- --only=rss        # 只跑 RSS 源,看你的 feed 有没有抓到
npm run dev                        # 起本地站,确认条目正常展示
```

确认能抓到、分类正确后,提个 PR 即可。

### 非 RSS 来源

如果来源是 API(像 GitHub / Hacker News / arXiv),参考 `scripts/sources/` 下已有的适配器,新增一个实现 `SourceAdapter` 接口的文件并注册进抓取编排。

## PR 约定

- 一个 PR 聚焦一件事(加一个源 / 修一个 bug)
- 跑过 `npm run lint`
- 加新源时,在 PR 描述里贴一下 `npm run crawl -- --only=rss` 的相关输出,证明能抓到

---

## 🇬🇧 Add a data source (most common)

Most sources are plain RSS / Atom — just add one line to the `FEEDS` array in `scripts/sources/rss.ts`:

```ts
{ id: "rss:example", label: "Example AI", url: "https://example.com/feed.xml", source: "Example", category: "ai-products" },
```

Fields: `id` (unique, `rss:<slug>`), `label` (display name), `url` (feed URL), `source` (brand), `category` (one of `ai-models` / `ai-products` / `industry` / `paper` / `tip`), and optional `aiOnly: true` for general feeds where only AI items should be kept.

Verify locally:

```bash
npm run crawl -- --only=rss
npm run dev
```

For non-RSS APIs, follow the existing adapters in `scripts/sources/` and implement the `SourceAdapter` interface.

### PR conventions

- One PR, one thing.
- Run `npm run lint`.
- When adding a source, paste the relevant `npm run crawl -- --only=rss` output in the PR description.

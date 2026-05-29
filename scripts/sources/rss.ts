import { XMLParser } from "fast-xml-parser";
import type { AIItem, CategoryKey } from "../../lib/types";
import { getText, hashId, stripHtml, toIso, truncate } from "../lib/fetchUtil";
import type { SourceAdapter } from "./types";

interface FeedDef {
  id: string;
  label: string;
  url: string;
  source: string;
  /** Fallback category before the classifier runs over the merged set. */
  category: CategoryKey;
  /** General-purpose feed: keep only AI-related items. */
  aiOnly?: boolean;
}

// Reputable, public RSS/Atom feeds spanning Chinese + English AI coverage:
// model labs, research blogs, the tech press, and community. Each is fetched
// independently — a single dead feed never sinks the crawl.
const FEEDS: FeedDef[] = [
  // —— 中文 ——
  { id: "rss:qbitai", label: "量子位", url: "https://www.qbitai.com/feed", source: "量子位", category: "ai-products" },
  { id: "rss:36kr", label: "36氪", url: "https://36kr.com/feed", source: "36氪", category: "industry", aiOnly: true },
  { id: "rss:infoq", label: "InfoQ", url: "https://www.infoq.cn/feed", source: "InfoQ", category: "industry", aiOnly: true },

  // —— 模型实验室 / 研究机构 ——
  { id: "rss:openai", label: "OpenAI News", url: "https://openai.com/news/rss.xml", source: "OpenAI", category: "ai-models" },
  { id: "rss:google-ai", label: "Google AI Blog", url: "https://blog.google/technology/ai/rss/", source: "Google AI", category: "ai-models" },
  { id: "rss:deepmind", label: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", source: "Google DeepMind", category: "ai-models" },
  { id: "rss:hf-blog", label: "HuggingFace Blog", url: "https://huggingface.co/blog/feed.xml", source: "HuggingFace Blog", category: "tip" },
  { id: "rss:bair", label: "BAIR Blog", url: "https://bair.berkeley.edu/blog/feed.xml", source: "Berkeley AI Research", category: "paper" },
  { id: "rss:mit-news-ai", label: "MIT News AI", url: "https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml", source: "MIT News", category: "industry" },

  // —— 科技媒体 AI 频道 ——
  { id: "rss:theverge-ai", label: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", source: "The Verge", category: "industry" },
  { id: "rss:techcrunch-ai", label: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch", category: "industry" },
  { id: "rss:venturebeat-ai", label: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", source: "VentureBeat", category: "industry" },
  { id: "rss:arstechnica-ai", label: "Ars Technica AI", url: "https://arstechnica.com/ai/feed/", source: "Ars Technica", category: "industry" },
  { id: "rss:techreview-ai", label: "MIT Tech Review AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", source: "MIT Tech Review", category: "industry" },

  // —— 社区 / 个人 ——
  { id: "rss:simonwillison", label: "Simon Willison", url: "https://simonwillison.net/atom/everything/", source: "Simon Willison", category: "tip", aiOnly: true },

  // —— 研究 / 社区扩充 ——
  { id: "rss:aws-ml", label: "AWS ML Blog", url: "https://aws.amazon.com/blogs/machine-learning/feed/", source: "AWS ML", category: "tip" },
  { id: "rss:msr", label: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/feed/", source: "Microsoft Research", category: "paper", aiOnly: true },
  { id: "rss:lilianweng", label: "Lil'Log", url: "https://lilianweng.github.io/index.xml", source: "Lilian Weng", category: "tip" },
  { id: "rss:raschka", label: "Ahead of AI", url: "https://magazine.sebastianraschka.com/feed", source: "Sebastian Raschka", category: "tip" },
  { id: "rss:thegradient", label: "The Gradient", url: "https://thegradient.pub/rss/", source: "The Gradient", category: "tip", aiOnly: true },
  { id: "rss:importai", label: "Import AI", url: "https://importai.substack.com/feed", source: "Import AI", category: "industry" },
];

const AI_KEYWORDS = [
  "ai", "a.i", "人工智能", "大模型", "模型", "llm", "gpt", "claude", "gemini", "llama",
  "智能体", "agent", "生成式", "多模态", "神经网络", "机器学习", "深度学习", "openai",
  "anthropic", "deepseek", "通义", "文心", "豆包", "kimi", "训练", "推理", "算力", "gpu",
  "开源模型", "diffusion", "扩散", "rag", "微调", "embedding", "transformer", "agi",
  "neural", "machine learning", "deep learning", "chatbot", "copilot", "stable diffusion",
];

const MAX_PER_FEED = Number(process.env.RSS_MAX_PER_FEED || 20);

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return text(v[0]);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if ("#text" in o) return String(o["#text"]);
    if ("@_href" in o) return String(o["@_href"]);
  }
  return "";
}

/** Atom <link> can be an array of rel-typed links; prefer rel="alternate". */
function atomLink(v: unknown): string {
  if (Array.isArray(v)) {
    const alt = v.find((l) => (l as Record<string, unknown>)?.["@_rel"] === "alternate");
    return text(alt ?? v[0]);
  }
  return text(v);
}

function isAiRelated(title: string, summary: string): boolean {
  const hay = `${title} ${summary}`.toLowerCase();
  return AI_KEYWORDS.some((k) => hay.includes(k));
}

function cleanSummary(raw: string): string | null {
  const s = stripHtml(raw);
  if (!s || s.includes("点击查看原文")) return null;
  return truncate(s, 180);
}

async function fetchFeed(feed: FeedDef): Promise<AIItem[]> {
  const xml = await getText(feed.url, { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" });
  const doc = parser.parse(xml);
  const rawItems = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? doc?.["rdf:RDF"]?.item ?? [];
  const list = Array.isArray(rawItems) ? rawItems : [rawItems];

  const out: AIItem[] = [];
  for (const it of list.slice(0, MAX_PER_FEED)) {
    const title = text(it.title).trim();
    const link = (atomLink(it.link) || text(it.guid) || text(it.id)).trim();
    if (!title || !link) continue;
    const summary =
      cleanSummary(
        text(it.description) ||
          text(it["content:encoded"]) ||
          text(it.summary) ||
          text(it.content),
      ) ?? "";
    if (feed.aiOnly && !isAiRelated(title, summary)) continue;
    out.push({
      id: hashId(feed.id, link),
      title,
      summary: summary || null,
      source: feed.source,
      sourceUrl: link,
      category: feed.category,
      publishedAt: toIso(text(it.pubDate) || text(it.published) || text(it.updated) || text(it["dc:date"])),
      aiSelected: true,
      origin: feed.id,
    });
  }
  return out;
}

export const rssAdapters: SourceAdapter[] = FEEDS.map((feed) => ({
  id: feed.id,
  label: feed.label,
  fetch: () => fetchFeed(feed),
}));

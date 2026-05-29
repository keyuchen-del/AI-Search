import type { AIItem, CategoryKey } from "./types";

/**
 * Pure category classifier — no fs / no network, safe on client & in CI.
 *
 * Adapters set a best-guess category, but a single normalization pass here gives
 * consistent routing across heterogeneous sources and, crucially, populates
 * `ai-models` (model releases) which no single feed maps to cleanly.
 */

const MODEL_FAMILIES =
  /\b(gpt-?5|gpt-?4o|gpt-?4|gpt-?3|chatgpt|o1|o3|o4|claude|gemini|gemma|llama\s?[0-9]?|qwen|通义千问|deepseek|mistral|mixtral|grok|phi-?[0-9]?|yi-?[0-9]+|chatglm|glm-?[0-9]?|kimi|文心一言|ernie|豆包|doubao|command\s?r|cohere|stable\s?diffusion|sdxl|flux\.?1?|sora|veo\s?[0-9]?|imagen|dall[\s·.-]?e|midjourney|whisper|falcon|baichuan|internlm|minimax|hunyuan|混元|skywork|nemotron|olmo|aya|reka|jamba|dbrx|pixtral|molmo|janus|wan\s?[0-9]|qwq)\b/i;

const RELEASE_WORDS =
  /(发布|推出|开源|开放|上线|亮相|登场|问世|放出|更新|升级|release|released|launch|launches|launched|introduc|unveil|announce|debut|now available|开源模型|新模型|新一代|版本|\bv\d)/i;

const PRODUCT_WORDS =
  /(产品|应用|工具|平台|插件|功能|app\b|功能上线|新功能|助手|copilot|assistant|sdk|api\b|框架|开源项目|repo|github)/i;

const PAPER_WORDS = /(论文|arxiv|paper|研究|technical report|预印本|综述|survey)/i;

const TIP_WORDS =
  /(教程|指南|技巧|实战|最佳实践|how to|guide|tutorial|tips|观点|解读|深度|思考|为什么|comment|opinion|访谈|对话|专访)/i;

const INDUSTRY_WORDS =
  /(融资|投资|收购|并购|估值|营收|裁员|ipo|上市|政策|监管|法案|合规|战略|合作|签约|布局|市场|商业化|落地|招聘|ceo|创始人|离职|入职|开城|发布会|大会|峰会|榜单|排行)/i;

function hay(item: AIItem): string {
  return `${item.title} ${item.summary ?? ""} ${(item.tags ?? []).join(" ")}`;
}

/** Resolve the best category for an item using source hints + text signals. */
export function classifyCategory(item: AIItem): CategoryKey {
  const origin = item.origin ?? "";
  const text = hay(item);

  // 1) Papers are unambiguous by source.
  if (origin === "hf-papers" || origin === "arxiv") return "paper";
  if (/arxiv|huggingface papers|papers with code/i.test(item.source)) return "paper";

  // 2) Model releases — needs a model family AND a release verb to avoid
  //    misrouting articles that merely mention a model in passing.
  if (MODEL_FAMILIES.test(text) && RELEASE_WORDS.test(text)) return "ai-models";

  // 3) Code / tools / product launches.
  if (origin === "github") return "ai-products";
  if (PRODUCT_WORDS.test(text) && RELEASE_WORDS.test(text)) return "ai-products";

  // 4) Industry moves (funding, policy, business) win over generic tip routing.
  if (INDUSTRY_WORDS.test(text)) return "industry";

  // 5) Tutorials / opinion.
  if (origin === "rss:hf-blog") return "tip";
  if (TIP_WORDS.test(text)) return "tip";
  if (PAPER_WORDS.test(text)) return "paper";

  // 6) Fall back to the adapter's guess, else industry.
  return item.category ?? "industry";
}

/** Apply classification + light heat fallback to a freshly merged item set. */
export function normalizeItems(items: AIItem[]): AIItem[] {
  return items.map((it) => ({
    ...it,
    category: classifyCategory(it),
    heat: typeof it.heat === "number" ? it.heat : 0,
  }));
}

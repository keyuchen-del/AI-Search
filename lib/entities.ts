import type { AIItem } from "./types";

export interface Entity {
  slug: string;
  name: string;
  re: RegExp;
}

// Topic/entity catalog. Slugs are ASCII (clean URLs). Matched against title+summary.
export const ENTITIES: Entity[] = [
  { slug: "openai", name: "OpenAI", re: /openai|gpt-?[345]|chatgpt|\bo[134]\b|\bsora\b|dall[\s·.-]?e/i },
  { slug: "anthropic", name: "Anthropic / Claude", re: /anthropic|claude/i },
  { slug: "google", name: "Google / DeepMind", re: /\bgoogle\b|deepmind|gemini|gemma/i },
  { slug: "meta", name: "Meta / Llama", re: /\bmeta\b|llama/i },
  { slug: "microsoft", name: "Microsoft", re: /microsoft|copilot|phi-?[0-9]/i },
  { slug: "nvidia", name: "NVIDIA", re: /nvidia|\bcuda\b|nemotron/i },
  { slug: "deepseek", name: "DeepSeek", re: /deepseek/i },
  { slug: "mistral", name: "Mistral", re: /mistral|mixtral/i },
  { slug: "qwen", name: "通义千问 Qwen", re: /\bqwen\b|通义/i },
  { slug: "huggingface", name: "Hugging Face", re: /hugging\s?face|\bhf\b/i },
  { slug: "agent", name: "AI Agent", re: /\bagent(s|ic)?\b|智能体/i },
  { slug: "rag", name: "RAG / 检索增强", re: /\brag\b|检索增强|retrieval[-\s]?augmented/i },
  { slug: "multimodal", name: "多模态", re: /multimodal|多模态|vision[-\s]?language|\bvlm\b/i },
  { slug: "opensource", name: "开源模型", re: /open[-\s]?source|开源/i },
  { slug: "robotics", name: "具身 / 机器人", re: /robot|具身|embodied/i },
  { slug: "chip", name: "AI 芯片 / 算力", re: /\bgpu\b|\bchip\b|芯片|算力|tpu|wafer/i },
  { slug: "funding", name: "融资 / 商业", re: /融资|investment|funding|valuation|估值|\bipo\b|acqui/i },
  { slug: "policy", name: "政策 / 监管", re: /政策|监管|regulat|policy|法案|compliance|合规/i },
  { slug: "video", name: "视频生成", re: /video\s?gen|视频生成|\bsora\b|\bveo\b|runway/i },
  { slug: "coding", name: "AI 编程", re: /\bcoding\b|代码|copilot|code\s?gen|programmer|swe[-\s]?bench/i },
];

export const ENTITY_MAP: Record<string, Entity> = Object.fromEntries(ENTITIES.map((e) => [e.slug, e]));

export function entitiesOf(item: AIItem): string[] {
  const hay = `${item.title} ${item.summary ?? ""} ${(item.tags ?? []).join(" ")}`;
  return ENTITIES.filter((e) => e.re.test(hay)).map((e) => e.slug);
}

/** slug -> count over a set of items (for thresholding which topic pages to build). */
export function entityCounts(items: AIItem[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const it of items) for (const s of entitiesOf(it)) c[s] = (c[s] ?? 0) + 1;
  return c;
}

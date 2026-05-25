import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { key: "industry", label: "行业动态", desc: "AI 行业趋势与重大事件" },
  { key: "product", label: "产品发布", desc: "新产品、新功能、新版本" },
  { key: "model", label: "模型进展", desc: "大模型与基础研究进展" },
  { key: "research", label: "学术研究", desc: "论文、技术报告与开源项目" },
  { key: "tools", label: "AI 工具", desc: "可用的 AI 应用与工具集合" },
  { key: "investment", label: "投融资", desc: "融资、并购与商业化进展" },
  { key: "policy", label: "政策监管", desc: "法规、监管与合规动态" },
  { key: "opinion", label: "观点解读", desc: "专家观点与深度评论" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
);

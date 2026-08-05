import type { StackGroupInput } from "./schema";

export const stackRaw = [
  {
    title: { uk: "Автоматизація", en: "Automation" },
    items: [
      "n8n",
      { uk: "ШІ-агенти", en: "AI agents" },
      "LLM API (OpenAI, Claude)",
      "CRM / Telegram / Google Sheets",
    ],
  },
  {
    title: { uk: "Frontend", en: "Frontend" },
    items: ["React", "Next.js", "JavaScript", "HTML/CSS"],
  },
  {
    title: { uk: "Backend", en: "Backend" },
    items: ["Node.js", "MongoDB", "REST API"],
  },
  {
    title: { uk: "Дизайн", en: "Design" },
    items: ["Figma", { uk: "прототипи", en: "prototypes" }],
  },
  {
    title: { uk: "CMS", en: "CMS" },
    items: ["WordPress", "Tilda"],
  },
  {
    title: { uk: "Деплой", en: "Deployment" },
    items: ["Vercel"],
  },
  {
    title: { uk: "SEO", en: "SEO" },
    items: [{ uk: "Базова автоматизація", en: "Basic automation" }],
  },
] satisfies readonly StackGroupInput[];

import type { SiteInput } from "./schema";

export const siteRaw = {
  name: { uk: "Станіслав Ракітянський", en: "Stanislav Rakitianskiy" },
  role: {
    uk: "Автоматизація бізнес-процесів і веб-розробка",
    en: "Business process automation and web development",
  },
  tagline: "n8n & AI Agents | AI Automator | Fullstack developer",
  availability: {
    uk: "Готовий до нового проєкту",
    en: "Available for a new project",
  },
  email: "hello@example.com",
  socials: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/StanislavRakitianskiy",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/",
    },
    {
      id: "telegram",
      label: "Telegram",
      href: "https://t.me/",
    },
  ],
} satisfies SiteInput;

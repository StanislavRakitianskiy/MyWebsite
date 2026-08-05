import type { Project } from "./schema";

export const projects = [
  {
    slug: "nord-store",
    year: 2026,
    category: "web",
    kind: { uk: "E-commerce", en: "E-commerce" },
    title: { uk: "Крамниця NORD", en: "NORD Store" },
    summary: {
      uk: "Інтернет-магазин одягу з кастомною корзиною та оплатою.",
      en: "Clothing e-commerce store with a custom cart and checkout.",
    },
    image: {
      src: "/projects/nord-store.svg",
      width: 1200,
      height: 800,
      alt: {
        uk: "Скріншот інтернет-магазину NORD",
        en: "Screenshot of the NORD online store",
      },
    },
  },
  {
    slug: "taskflow",
    year: 2025,
    category: "web",
    kind: { uk: "Веб-застосунок", en: "Web app" },
    title: "TaskFlow",
    summary: {
      uk: "Трекер задач для команд з real-time синхронізацією.",
      en: "Task tracker for teams with real-time sync.",
    },
    image: {
      src: "/projects/taskflow.svg",
      width: 1200,
      height: 800,
      alt: {
        uk: "Скріншот застосунку TaskFlow",
        en: "Screenshot of the TaskFlow app",
      },
    },
  },
  {
    slug: "studio-bright",
    year: 2025,
    category: "web",
    kind: { uk: "Лендінг", en: "Landing page" },
    title: "Studio Bright",
    summary: {
      uk: "Сайт-візитка для дизайн-студії з анімаціями.",
      en: "Animated landing page for a design studio.",
    },
    image: {
      src: "/projects/studio-bright.svg",
      width: 1200,
      height: 800,
      alt: {
        uk: "Скріншот сайту Studio Bright",
        en: "Screenshot of the Studio Bright website",
      },
    },
  },
  {
    slug: "vector-legal",
    year: 2024,
    category: "web",
    kind: { uk: "Корпоративний сайт", en: "Corporate website" },
    title: "Vector Legal",
    summary: {
      uk: "Багатосторінковий сайт юридичної компанії.",
      en: "Multi-page website for a law firm.",
    },
    image: {
      src: "/projects/vector-legal.svg",
      width: 1200,
      height: 800,
      alt: {
        uk: "Скріншот сайту Vector Legal",
        en: "Screenshot of the Vector Legal website",
      },
    },
  },
  {
    slug: "lead-automation",
    year: 2026,
    category: "automation",
    kind: { uk: "CRM-інтеграція", en: "CRM integration" },
    title: { uk: "Автоматизація заявок", en: "Lead intake automation" },
    summary: {
      uk: "Синхронізація лідів з сайту в CRM та Telegram-сповіщення.",
      en: "Website leads synced to a CRM with Telegram notifications.",
    },
    image: {
      src: "/projects/lead-automation.svg",
      width: 1200,
      height: 800,
      alt: {
        uk: "Схема автоматизації обробки заявок",
        en: "Diagram of the lead intake automation",
      },
    },
  },
  {
    slug: "nord-emails",
    year: 2025,
    category: "automation",
    kind: { uk: "Email-маркетинг", en: "Email marketing" },
    title: { uk: "Розсилка Nord", en: "Nord email flows" },
    summary: {
      uk: "Автоматичні тригерні листи на основі дій клієнта.",
      en: "Automated trigger emails based on customer actions.",
    },
    image: {
      src: "/projects/nord-emails.svg",
      width: 1200,
      height: 800,
      alt: {
        uk: "Схема тригерних email-розсилок Nord",
        en: "Diagram of the Nord trigger email flows",
      },
    },
  },
  {
    slug: "price-parsing",
    year: 2025,
    category: "automation",
    kind: { uk: "Обробка даних", en: "Data processing" },
    title: { uk: "Парсинг прайсів", en: "Price list parsing" },
    summary: {
      uk: "Щоденне оновлення цін з постачальників у Google Sheets.",
      en: "Daily supplier price updates in Google Sheets.",
    },
    image: {
      src: "/projects/price-parsing.svg",
      width: 1200,
      height: 800,
      alt: {
        uk: "Схема парсингу прайсів у Google Sheets",
        en: "Diagram of the price parsing pipeline in Google Sheets",
      },
    },
  },
] as const satisfies readonly Project[];

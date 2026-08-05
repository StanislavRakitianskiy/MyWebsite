import { z } from "zod";
import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

/** Значення, що має переклад для кожної локалі. Додавання локалі в routing
 *  зламає білд, поки не з'являться всі переклади. */
export type Localized<T = string> = Readonly<Record<Locale, T>>;

/** Текст, однаковий для всіх локалей, або з перекладами. */
export type LocalizedText = string | Localized;

// Zod-двійники типів вище: TS ловить помилки типів у редакторі,
// Zod на build ловить помилки значень (regex, діапазони, url).
const localized = z.object({ uk: z.string().min(1), en: z.string().min(1) });
const localizedText = z.union([z.string().min(1), localized]);

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(["web", "automation"]),
  year: z.number().int().min(2020).max(2030),
  /** Тип роботи в картці, напр. «E-commerce», «Веб-застосунок». */
  kind: localized,
  title: localizedText,
  summary: localized,
  cover: z.object({
    src: z.string().startsWith("/projects/"),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    alt: localized,
  }),
  /** Теги технологій під картку / для майбутнього кейсу. */
  stack: z.array(z.string().min(1)),
  /** «Заявка за 1 хв замість 20» — під майбутні картки з цифрами. */
  metrics: z.array(localized).optional(),
  url: z.string().url().optional(),
  repo: z.string().url().optional(),
  /** Чи генерувати сторінку кейсу /works/[slug] (фаза кейсів). */
  caseStudy: z.boolean().default(false),
  featured: z.boolean().default(true),
  order: z.number().int(),
});

export const stackGroupSchema = z.object({
  title: localized,
  items: z.array(localizedText).min(1),
});

export const siteSchema = z.object({
  name: localized,
  role: localized,
  tagline: z.string().min(1),
  availability: localized,
  email: z.string().email(),
  socials: z.array(
    z.object({
      id: z.enum(["github", "linkedin", "telegram"]),
      label: z.string().min(1),
      href: z.string().url(),
    }),
  ),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectInput = z.input<typeof projectSchema>;
export type StackGroupInput = z.input<typeof stackGroupSchema>;
export type SiteInput = z.input<typeof siteSchema>;
export type ProjectCategory = Project["category"];
export type StackGroup = z.infer<typeof stackGroupSchema>;
export type SiteConfig = z.infer<typeof siteSchema>;
export type SocialLink = SiteConfig["socials"][number];

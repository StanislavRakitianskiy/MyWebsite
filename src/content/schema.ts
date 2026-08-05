import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

/** Значення, що має переклад для кожної локалі. Додавання локалі в routing
 *  зламає білд, поки не з'являться всі переклади. */
export type Localized<T = string> = Readonly<Record<Locale, T>>;

/** Текст, однаковий для всіх локалей, або з перекладами. */
export type LocalizedText = string | Localized;

export type ProjectCategory = "web" | "automation";

export interface ProjectImage {
  readonly src: `/${string}`;
  readonly width: number;
  readonly height: number;
  readonly alt: Localized;
}

export interface Project {
  readonly slug: string;
  readonly year: number;
  readonly category: ProjectCategory;
  /** Тип роботи в картці, напр. «E-commerce», «Веб-застосунок». */
  readonly kind: Localized;
  readonly title: LocalizedText;
  readonly summary: Localized;
  readonly image: ProjectImage;
}

export interface StackGroup {
  readonly title: Localized;
  readonly items: readonly LocalizedText[];
}

export type SocialId = "github" | "linkedin" | "telegram";

export interface SocialLink {
  readonly id: SocialId;
  readonly label: string;
  readonly href: `https://${string}`;
}

export interface SiteConfig {
  readonly name: Localized;
  readonly role: Localized;
  readonly tagline: string;
  readonly availability: Localized;
  readonly email: string;
  readonly socials: readonly SocialLink[];
}

import { getProjects, getSite, localize } from "@/content/api";
import type { Locale } from "@/content/schema";
import { env } from "./env";

export function buildJsonLd(locale: Locale): object[] {
  const site = getSite();
  const base = env.NEXT_PUBLIC_SITE_URL;
  const name = localize(site.name, locale);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    email: `mailto:${site.email}`,
    url: base,
    sameAs: site.socials.map((social) => social.href),
    jobTitle: localize(site.role, locale),
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name,
    description: localize(site.role, locale),
    url: base,
    email: `mailto:${site.email}`,
    areaServed: "UA",
    founder: { "@type": "Person", name },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "uk" ? "Вибрані проєкти" : "Selected projects",
    itemListElement: getProjects().map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: localize(project.title, locale),
      description: localize(project.summary, locale),
    })),
  };

  return [person, service, itemList];
}

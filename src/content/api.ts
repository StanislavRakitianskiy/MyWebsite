import { projectsRaw } from "./projects";
import {
  projectSchema,
  siteSchema,
  stackGroupSchema,
  type Locale,
  type LocalizedText,
  type Project,
  type ProjectCategory,
  type SiteConfig,
  type StackGroup,
} from "./schema";
import { siteRaw } from "./site";
import { stackRaw } from "./stack";

// parse на етапі збірки: помилка в контенті ламає деплой, а не сайт у проді.
const projects: readonly Project[] = projectsRaw
  .map((project) => projectSchema.parse(project))
  .sort((a, b) => a.order - b.order);

const stack: readonly StackGroup[] = stackRaw.map((group) =>
  stackGroupSchema.parse(group),
);

const site: SiteConfig = siteSchema.parse(siteRaw);

/** Розгортає локалізоване значення для заданої локалі. */
export function localize(value: LocalizedText, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}

export function getSite(): SiteConfig {
  return site;
}

export function getProjects(category?: ProjectCategory): readonly Project[] {
  return category
    ? projects.filter((project) => project.category === category)
    : projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getCaseStudySlugs(): readonly string[] {
  return projects
    .filter((project) => project.caseStudy)
    .map((project) => project.slug);
}

export function getStack(): readonly StackGroup[] {
  return stack;
}

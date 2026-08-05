import { projects } from "./projects";
import type {
  Locale,
  LocalizedText,
  Project,
  ProjectCategory,
  SiteConfig,
  StackGroup,
} from "./schema";
import { site } from "./site";
import { stack } from "./stack";

/** Розгортає локалізоване значення для заданої локалі. */
export function localize(value: LocalizedText, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}

export function getSite(): SiteConfig {
  return site;
}

/** Усі проєкти, найновіші першими (порядок у межах року — як у контенті). */
export function getProjects(): readonly Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function getProjectsByCategory(
  category: ProjectCategory,
): readonly Project[] {
  return getProjects().filter((project) => project.category === category);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getStack(): readonly StackGroup[] {
  return stack;
}

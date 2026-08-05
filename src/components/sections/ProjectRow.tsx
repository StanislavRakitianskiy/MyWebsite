import Image from "next/image";
import { useLocale } from "next-intl";
import { localize } from "@/content/api";
import type { Locale, Project } from "@/content/schema";

export function ProjectRow({ project }: { project: Project }) {
  const locale = useLocale() as Locale;

  return (
    <article className="grid gap-6 py-10 sm:py-12 md:grid-cols-2 md:items-center md:gap-10 lg:gap-16">
      <div>
        <p className="text-sm text-muted-foreground">
          {project.year} — {localize(project.kind, locale)}
        </p>
        <h4 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {localize(project.title, locale)}
        </h4>
        <p className="mt-4 max-w-md text-muted-foreground">
          {localize(project.summary, locale)}
        </p>
      </div>
      <Image
        src={project.image.src}
        width={project.image.width}
        height={project.image.height}
        alt={localize(project.image.alt, locale)}
        unoptimized
        className="h-auto w-full rounded-2xl"
      />
    </article>
  );
}

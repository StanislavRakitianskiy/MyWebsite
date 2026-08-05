import Image from "next/image";
import { useLocale } from "next-intl";
import { localize } from "@/content/api";
import type { Locale, Project } from "@/content/schema";

export function ProjectRow({ project }: { project: Project }) {
  const locale = useLocale() as Locale;

  return (
    <article className="group grid gap-6 py-10 sm:py-12 md:grid-cols-2 md:items-center md:gap-10 lg:gap-16">
      <div>
        <p className="text-sm text-muted-foreground">
          {project.year} — {localize(project.kind, locale)}
        </p>
        <h4 className="mt-3 font-display text-3xl font-bold tracking-tight underline-offset-4 transition-colors duration-200 ease-out group-hover:underline sm:text-4xl">
          {localize(project.title, locale)}
        </h4>
        <p className="mt-4 max-w-md text-muted-foreground">
          {localize(project.summary, locale)}
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl">
        <Image
          src={project.cover.src}
          width={project.cover.width}
          height={project.cover.height}
          alt={localize(project.cover.alt, locale)}
          unoptimized
          className="h-auto w-full transition-transform duration-200 ease-out group-hover:scale-[1.02]"
        />
      </div>
    </article>
  );
}

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { localize } from "@/content/api";
import type { Locale, Project } from "@/content/schema";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { StackDisclosure } from "@/components/ui/StackDisclosure";

export function ProjectRow({ project }: { project: Project }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("works");
  const title = localize(project.title, locale);

  const cover = (
    <Image
      src={project.cover.src}
      width={project.cover.width}
      height={project.cover.height}
      alt={localize(project.cover.alt, locale)}
      sizes="(min-width: 768px) 50vw, 100vw"
      className="h-auto w-full transition-transform duration-200 ease-out group-hover:scale-[1.02]"
    />
  );

  return (
    <article className="group grid gap-6 py-10 sm:py-12 md:grid-cols-2 md:items-center md:gap-10 lg:gap-16">
      <div>
        <p className="text-sm text-muted-foreground">
          {project.year} — {localize(project.kind, locale)}
        </p>
        <h4 className="mt-3 font-display text-3xl font-bold tracking-tight underline-offset-4 transition-colors duration-200 ease-out group-hover:underline sm:text-4xl">
          {title}
        </h4>
        <ExpandableText
          text={localize(project.summary, locale)}
          limit={150}
          moreLabel={t("showMore")}
          lessLabel={t("showLess")}
          className="mt-4 max-w-md text-muted-foreground"
        />
        <StackDisclosure
          items={project.stack}
          label={t("stack")}
          showLabel={t("showStack", { title })}
          hideLabel={t("hideStack", { title })}
        />
      </div>
      <div className="overflow-hidden rounded-2xl">
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={title}
            className="block cursor-pointer"
          >
            {cover}
          </a>
        ) : (
          cover
        )}
      </div>
    </article>
  );
}

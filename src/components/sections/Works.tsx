import { useTranslations } from "next-intl";
import { getProjects } from "@/content/api";
import type { ProjectCategory } from "@/content/schema";
import { ProjectRow } from "@/components/sections/ProjectRow";
import { Container } from "@/components/ui/Container";

const categories: readonly ProjectCategory[] = ["web", "automation"];

export function Works() {
  const t = useTranslations("works");

  return (
    <section id="works" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {t("title")}
          </h2>
          <span className="text-sm text-muted-foreground">{t("note")}</span>
        </div>
        {categories.map((category) => (
          <div key={category} className="mt-14 sm:mt-16">
            <h3 className="border-b border-border pb-4 text-xl font-bold sm:text-2xl">
              {t(`categories.${category}`)}
            </h3>
            <div className="divide-y divide-border">
              {getProjects(category).map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

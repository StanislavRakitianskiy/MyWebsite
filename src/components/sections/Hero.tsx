import { useTranslations } from "next-intl";
import { getSite } from "@/content/api";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const t = useTranslations("hero");
  const site = getSite();

  return (
    <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
      <Container>
        <p className="text-sm text-muted-foreground sm:text-base">
          {site.tagline}
        </p>
        <h1 className="mt-4 max-w-5xl font-display text-[44px]/[1.04] font-bold tracking-tight sm:text-7xl/[1.02] lg:text-[96px]/[1.0]">
          {t("heading")}
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl/relaxed">
          {t("subtitle")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="#works">{t("ctaWorks")}</ButtonLink>
          <ButtonLink href="#contact" variant="secondary">
            {t("ctaDiscuss")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

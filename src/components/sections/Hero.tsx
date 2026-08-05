import { useTranslations } from "next-intl";
import { getSite } from "@/content/api";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const t = useTranslations("hero");
  const site = getSite();

  return (
    <section className="pt-16 pb-20 sm:pt-24 sm:pb-28" aria-label={t("heading")}>
      <Container>
        <p className="animate-fade-up text-sm text-muted-foreground sm:text-base">
          {site.tagline}
        </p>
        <h1 className="animate-fade-up mt-4 max-w-5xl font-display text-[44px]/[1.04] font-bold tracking-tight sm:text-7xl/[1.02] lg:text-[96px]/[1.0] [animation-delay:60ms]">
          {t("heading")}
        </h1>
        <p className="animate-fade-up mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl/relaxed [animation-delay:120ms]">
          {t("subtitle")}
        </p>
        <div className="animate-fade-up mt-10 flex flex-wrap gap-4 [animation-delay:180ms]">
          <ButtonLink href="#works">{t("ctaWorks")}</ButtonLink>
          <ButtonLink href="#contact" variant="secondary">
            {t("ctaDiscuss")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

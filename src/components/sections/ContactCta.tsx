import { useTranslations } from "next-intl";
import { getSite } from "@/content/api";
import { ContactForm } from "@/components/sections/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ContactCta() {
  const t = useTranslations("cta");
  const site = getSite();

  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="flex flex-col items-center text-center">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {t("title")}
        </h2>
        <p className="mt-6 max-w-2xl text-muted-foreground sm:text-lg">
          {t("subtitle")}
        </p>
        <ButtonLink
          href={`mailto:${site.email}`}
          size="lg"
          variant="secondary"
          className="mt-10"
        >
          {site.email}
        </ButtonLink>
        <div className="mt-14 flex w-full justify-center">
          <ContactForm
            email={site.email}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </div>
      </Container>
    </section>
  );
}

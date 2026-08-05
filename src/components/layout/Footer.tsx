import { useLocale, useTranslations } from "next-intl";
import { getSite, localize } from "@/content/api";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/content/schema";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as Locale;
  const site = getSite();

  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          {t("copyright", {
            year: new Date().getFullYear(),
            name: localize(site.name, locale),
            role: localize(site.role, locale),
          })}
        </p>
        <div className="flex gap-6">
          {site.socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {social.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}

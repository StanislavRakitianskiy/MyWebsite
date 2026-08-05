import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { ContactCta } from "@/components/sections/ContactCta";
import { Hero } from "@/components/sections/Hero";
import { Works } from "@/components/sections/Works";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildJsonLd } from "@/lib/jsonld";
import type { Locale } from "@/content/schema";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const jsonLdLocale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <Works />
        <About />
        <ContactCta />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(jsonLdLocale)),
        }}
      />
    </>
  );
}

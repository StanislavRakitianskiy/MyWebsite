import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSite, localize } from "@/content/api";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "meta" });
  const site = getSite();
  const path = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: path,
      languages: { uk: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: path,
      title: t("title"),
      description: t("description"),
      siteName: localize(site.name, locale),
      locale: locale === "uk" ? "uk_UA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-accent-foreground"
        >
          {t("skipToContent")}
        </a>
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <ThemeProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

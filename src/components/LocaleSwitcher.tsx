"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("common.localeSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center rounded-full bg-accent p-1"
    >
      {routing.locales.map((candidate) => {
        const isActive = candidate === locale;
        return (
          <button
            key={candidate}
            type="button"
            aria-pressed={isActive}
            onClick={() => router.replace(pathname, { locale: candidate })}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              isActive
                ? "bg-background text-foreground"
                : "text-accent-foreground/70 hover:text-accent-foreground"
            }`}
          >
            {t(candidate)}
          </button>
        );
      })}
    </div>
  );
}

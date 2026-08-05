"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<(typeof routing.locales)[number], string> = {
  uk: "UA",
  en: "EN",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-border p-1">
      {routing.locales.map((candidate) => {
        const isActive = candidate === locale;
        return (
          <button
            key={candidate}
            type="button"
            aria-pressed={isActive}
            onClick={() => router.replace(pathname, { locale: candidate })}
            className={`rounded-sm px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {labels[candidate]}
          </button>
        );
      })}
    </div>
  );
}

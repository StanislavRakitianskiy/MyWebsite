"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const t = useTranslations("common.themeToggle");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="relative inline-flex h-9 w-16 shrink-0 items-center rounded-full bg-accent p-1">
      <span
        aria-hidden="true"
        className={`absolute top-1 left-1 size-7 rounded-full bg-background transition-transform duration-200 ${
          isDark ? "translate-x-7" : ""
        }`}
      />
      <button
        type="button"
        aria-label={t("toLight")}
        aria-pressed={mounted ? !isDark : undefined}
        onClick={() => setTheme("light")}
        className="relative z-10 inline-flex size-7 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-4 ${isDark ? "text-accent-foreground" : "text-foreground"}`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      </button>
      <button
        type="button"
        aria-label={t("toDark")}
        aria-pressed={mounted ? isDark : undefined}
        onClick={() => setTheme("dark")}
        className="relative z-10 inline-flex size-7 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-4 ${isDark ? "text-foreground" : "text-accent-foreground"}`}
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </button>
    </div>
  );
}

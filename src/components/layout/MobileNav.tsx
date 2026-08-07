"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { navItems } from "@/components/layout/nav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Container } from "@/components/ui/Container";

export function MobileNav() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc закриває, скрол body блокується, Tab не виходить за межі меню
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      const button = buttonRef.current;
      if (!panel || !button) return;
      const focusables = [
        button,
        ...panel.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), select",
        ),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpen(!open)}
        className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-5"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-4rem)] overflow-y-auto bg-background"
        >
          <Container className="flex min-h-full flex-col gap-2 py-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-4 text-2xl font-semibold transition-colors hover:bg-muted"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <div className="mt-auto flex items-center gap-3 border-t border-border px-2 pt-6">
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}

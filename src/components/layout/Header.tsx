import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { navItems } from "@/components/layout/nav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Container } from "@/components/ui/Container";

export function Header() {
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
        <a href="#main-content" className="text-lg font-bold tracking-tight">
          {t("name")}
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-foreground transition-colors hover:text-muted-foreground"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
        <MobileNav />
      </Container>
    </header>
  );
}

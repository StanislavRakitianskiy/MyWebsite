import { setRequestLocale } from "next-intl/server";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Container } from "@/components/ui/Container";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <Container className="flex items-center justify-end gap-3 py-6">
        <LocaleSwitcher />
        <ThemeToggle />
      </Container>
    </main>
  );
}

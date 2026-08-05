import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { StackTable } from "@/components/sections/StackTable";
import { Container } from "@/components/ui/Container";

export function About() {
  const t = useTranslations("about");
  const strong = (chunks: ReactNode) => (
    <strong className="font-semibold text-white">{chunks}</strong>
  );

  return (
    <section
      id="about"
      className="scroll-mt-20 bg-[#0d0d0e] py-16 text-white/75 sm:py-24"
    >
      <Container>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {t("title")}
        </h2>
        <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_26rem] lg:gap-24 sm:mt-16">
          <div className="max-w-xl space-y-6 text-lg/relaxed">
            <p>{t("intro")}</p>
            <p>{t("believe")}</p>
            <p>{t("benefitsLead")}</p>
            <ul className="list-disc space-y-4 pl-5 marker:text-white/40">
              <li>{t.rich("benefit1", { b: strong })}</li>
              <li>{t.rich("benefit2", { b: strong })}</li>
              <li>{t.rich("benefit3", { b: strong })}</li>
            </ul>
            <p>{t("sites")}</p>
            <p>{t("solo")}</p>
          </div>
          <div>
            <StackTable />
          </div>
        </div>
      </Container>
    </section>
  );
}

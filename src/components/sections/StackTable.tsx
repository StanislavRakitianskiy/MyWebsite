import { useLocale } from "next-intl";
import { getStack, localize } from "@/content/api";
import type { Locale } from "@/content/schema";

export function StackTable() {
  const locale = useLocale() as Locale;

  return (
    <dl className="divide-y divide-inverse-foreground/15 border-y border-inverse-foreground/15">
      {getStack().map((group) => (
        <div
          key={localize(group.title, locale)}
          className="flex items-baseline justify-between gap-6 py-4"
        >
          <dt className="shrink-0 font-semibold text-inverse-foreground">
            {localize(group.title, locale)}
          </dt>
          <dd className="text-right text-inverse-foreground/55">
            {group.items.map((item) => localize(item, locale)).join(", ")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

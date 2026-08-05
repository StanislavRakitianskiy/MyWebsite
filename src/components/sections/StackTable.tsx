import { useLocale } from "next-intl";
import { getStack, localize } from "@/content/api";
import type { Locale } from "@/content/schema";

export function StackTable() {
  const locale = useLocale() as Locale;

  return (
    <dl className="divide-y divide-white/15 border-y border-white/15">
      {getStack().map((group) => (
        <div
          key={localize(group.title, locale)}
          className="flex items-baseline justify-between gap-6 py-4"
        >
          <dt className="shrink-0 font-semibold text-white">
            {localize(group.title, locale)}
          </dt>
          <dd className="text-right text-white/55">
            {group.items.map((item) => localize(item, locale)).join(", ")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

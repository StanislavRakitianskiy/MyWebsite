import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getSite, localize } from "@/content/api";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Станіслав Ракітянський";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const site = getSite();
  const font = await readFile(
    join(process.cwd(), "src/assets/manrope-bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#141414",
          color: "#f5f5f3",
          padding: 72,
          fontFamily: "Manrope",
        }}
      >
        <div
          style={{
            fontSize: 26,
            color: "#a3a39e",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          {site.tagline}
        </div>
        <div style={{ fontSize: 84, lineHeight: 1.05, maxWidth: 1000 }}>
          {localize(site.name, locale)}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 34, color: "#c9c9c5" }}>
            {localize(site.role, locale)}
          </div>
          <div style={{ fontSize: 30, color: "#a3a39e" }}>{site.email}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Manrope", data: font, weight: 700, style: "normal" }],
    },
  );
}

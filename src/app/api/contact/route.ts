import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { env } from "@/lib/env";
import { notifyContact } from "@/lib/notify";
import { checkRateLimit } from "@/lib/rate-limit";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY ?? "",
    response: token,
    remoteip: ip,
  });
  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) return false;
  const outcome = (await res.json()) as { success: boolean };
  return outcome.success;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "validation" }, { status: 400 });
  }

  // Honeypot перевіряємо до валідації: боту відповідаємо успіхом,
  // не підказуючи, що його розпізнали. Заявка тихо ігнорується.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.length > 0
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "validation",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const ip = clientIp(request);

  if (env.TURNSTILE_SECRET_KEY) {
    const token = parsed.data.turnstileToken;
    if (!token || !(await verifyTurnstile(token, ip))) {
      return NextResponse.json(
        { ok: false, code: "turnstile" },
        { status: 400 },
      );
    }
  }

  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({ ok: false, code: "rateLimit" }, { status: 429 });
  }

  try {
    const channel = await notifyContact({
      name: parsed.data.name,
      contact: parsed.data.contact,
      message: parsed.data.message,
      budget: parsed.data.budget,
      locale: parsed.data.locale,
      submittedAt: new Date().toISOString(),
      ip,
    });
    return NextResponse.json({ ok: true, channel });
  } catch (error) {
    console.error("[contact] all delivery channels failed:", error);
    return NextResponse.json({ ok: false, code: "send" }, { status: 500 });
  }
}

import { env } from "./env";

export type ContactPayload = {
  name: string;
  contact: string;
  message: string;
  budget?: string;
  locale?: string;
  submittedAt: string;
  ip: string;
};

const N8N_TIMEOUT_MS = 5000;
const RESEND_TIMEOUT_MS = 10_000;

async function sendToN8n(payload: ContactPayload): Promise<void> {
  if (!env.N8N_WEBHOOK_URL) {
    throw new Error("N8N_WEBHOOK_URL is not configured");
  }
  const res = await fetch(env.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(env.N8N_WEBHOOK_SECRET
        ? { "x-webhook-secret": env.N8N_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`n8n webhook responded ${res.status}`);
  }
}

async function sendFallbackEmail(payload: ContactPayload): Promise<void> {
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    throw new Error("Resend fallback is not configured");
  }
  const text = [
    `Ім'я: ${payload.name}`,
    `Контакт: ${payload.contact}`,
    payload.budget ? `Бюджет: ${payload.budget}` : null,
    `Локаль: ${payload.locale ?? "?"}`,
    `Час: ${payload.submittedAt}`,
    "",
    payload.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const res = await fetch(`${env.RESEND_BASE_URL}/emails`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [env.CONTACT_EMAIL],
      reply_to: payload.contact.includes("@") ? payload.contact : undefined,
      subject: `Нова заявка з сайту — ${payload.name}`,
      text,
    }),
    signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}`);
  }
}

/**
 * Основний канал — n8n (Telegram + Sheets + автовідповідь у WF_CONTACT).
 * Якщо n8n недоступний — лист напряму через Resend.
 * Кидає помилку, лише якщо не спрацював жоден канал.
 */
export async function notifyContact(
  payload: ContactPayload,
): Promise<"n8n" | "email"> {
  try {
    await sendToN8n(payload);
    return "n8n";
  } catch (n8nError) {
    console.error("[contact] n8n delivery failed, trying fallback:", n8nError);
    await sendFallbackEmail(payload);
    return "email";
  }
}

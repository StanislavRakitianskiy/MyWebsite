import { z } from "zod";

// Порожній рядок у змінній оточення трактуємо як «не задано».
const definedEnv = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== ""),
);

const envSchema = z.object({
  N8N_WEBHOOK_URL: z.string().url().optional(),
  N8N_WEBHOOK_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_BASE_URL: z.string().url().default("https://api.resend.com"),
  RESEND_FROM: z.string().min(1).default("Portfolio <onboarding@resend.dev>"),
  CONTACT_EMAIL: z.string().email().optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

export const env = envSchema.parse(definedEnv);

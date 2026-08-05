import { z } from "zod";

export const budgetValues = [
  "<500",
  "500-1500",
  "1500-5000",
  ">5000",
  "unknown",
] as const;

// Повідомлення в схемі — це ключі з messages/*.json (form.errors.*),
// клієнт перекладає їх перед показом. Одна схема на клієнт і сервер.
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(80, "name"),
  contact: z.string().trim().min(3, "contact").max(120, "contact"),
  message: z.string().trim().min(20, "message").max(2000, "message"),
  budget: z.enum(budgetValues).optional(),
  /** Honeypot: справжній користувач залишає поле порожнім. */
  website: z.string().max(0),
  turnstileToken: z.string().optional(),
  locale: z.string().max(10).optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;

/** Клієнтська частина: токен і локаль додаються при відправці, не з полів. */
export const contactFormSchema = contactSchema.omit({
  turnstileToken: true,
  locale: true,
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

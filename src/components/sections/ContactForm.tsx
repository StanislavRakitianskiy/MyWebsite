"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Turnstile } from "@/components/Turnstile";
import { Button } from "@/components/ui/Button";
import { Field, inputClasses } from "@/components/ui/Field";
import {
  budgetValues,
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/contact-schema";

const budgetLabelKey = {
  "<500": "lt500",
  "500-1500": "b500to1500",
  "1500-5000": "b1500to5000",
  ">5000": "gt5000",
  unknown: "unknown",
} as const;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  email,
  turnstileSiteKey,
}: {
  email: string;
  turnstileSiteKey?: string;
}) {
  const t = useTranslations("form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string>("send");
  const [token, setToken] = useState("");
  const onToken = useCallback((value: string) => setToken(value), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", contact: "", message: "", website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          budget: values.budget || undefined,
          locale,
          turnstileToken: token || undefined,
        }),
      });
      if (res.ok) {
        setStatus("success");
        reset();
        return;
      }
      const data = (await res.json().catch(() => null)) as {
        code?: string;
      } | null;
      setErrorKey(
        data?.code === "turnstile" || data?.code === "rateLimit"
          ? data.code
          : "send",
      );
      setStatus("error");
    } catch {
      setErrorKey("send");
      setStatus("error");
    }
  });

  if (status === "success") {
    return (
      <div
        role="status"
        className="w-full max-w-xl rounded-2xl border border-border bg-surface px-8 py-10 text-center"
      >
        <p className="text-xl font-bold">{t("successTitle")}</p>
        <p className="mt-2 text-muted-foreground">{t("successText")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-full max-w-xl flex-col gap-5 text-left"
    >
      <Field id="cf-name" label={t("name")} error={errors.name?.message ? t(`errors.${errors.name.message}`) : undefined}>
        <input
          id="cf-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "cf-name-error" : undefined}
          className={inputClasses}
          {...register("name")}
        />
      </Field>
      <Field
        id="cf-contact"
        label={t("contact")}
        error={
          errors.contact?.message
            ? t(`errors.${errors.contact.message}`)
            : undefined
        }
      >
        <input
          id="cf-contact"
          type="text"
          autoComplete="email"
          placeholder={t("contactPlaceholder")}
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={errors.contact ? "cf-contact-error" : undefined}
          className={inputClasses}
          {...register("contact")}
        />
      </Field>
      <Field
        id="cf-message"
        label={t("message")}
        error={
          errors.message?.message
            ? t(`errors.${errors.message.message}`)
            : undefined
        }
      >
        <textarea
          id="cf-message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
          className={`${inputClasses} resize-y`}
          {...register("message")}
        />
      </Field>
      <Field id="cf-budget" label={t("budget.label")}>
        <select
          id="cf-budget"
          className={inputClasses}
          defaultValue=""
          {...register("budget", {
            setValueAs: (value: string) => (value === "" ? undefined : value),
          })}
        >
          <option value="">—</option>
          {budgetValues.map((value) => (
            <option key={value} value={value}>
              {t(`budget.${budgetLabelKey[value]}`)}
            </option>
          ))}
        </select>
      </Field>
      {/* Honeypot: приховане від людей, боти заповнюють */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("website")}
      />
      {turnstileSiteKey ? (
        <Turnstile siteKey={turnstileSiteKey} onToken={onToken} />
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {errorKey === "send"
            ? t("errorText", { email })
            : t(`errors.${errorKey}`)}
        </p>
      ) : null}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

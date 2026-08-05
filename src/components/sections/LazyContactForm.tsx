"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Форма тягне react-hook-form + zod — вантажимо чанк лише коли користувач
// наближається до секції контактів, щоб не платити за нього на старті.
const ContactForm = dynamic(
  () =>
    import("./ContactForm").then((module) => ({
      default: module.ContactForm,
    })),
  { ssr: false },
);

export function LazyContactForm(props: {
  email: string;
  turnstileSiteKey?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex w-full justify-center">
      {load ? <ContactForm {...props} /> : null}
    </div>
  );
}

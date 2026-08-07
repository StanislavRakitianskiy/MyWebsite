"use client";

import { useEffect, useRef, useState } from "react";

/** Полоска-роздільник, що виїжджає зліва направо за 1.5с при появі у в'юпорті. */
export function GrowLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`reveal h-px w-full origin-left bg-border transition-transform duration-[1500ms] ease-out ${
        shown ? "scale-x-100" : "scale-x-0"
      } ${className}`}
    />
  );
}

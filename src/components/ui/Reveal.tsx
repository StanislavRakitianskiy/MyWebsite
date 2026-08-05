"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-reveal (§10.2): once, threshold 0.15, тільки opacity + translateY.
 * Серверні children не «клієнтизуються» — компонент лишається тонким.
 * Реалізовано на IntersectionObserver без бібліотеки motion, щоб не тягнути
 * її в бандл заради однієї анімації (бюджет §12).
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // При prefers-reduced-motion глобальний CSS обнуляє тривалість переходу,
  // тому окремої гілки не потрібно — поява стає миттєвою.
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
      className={`reveal transition-[opacity,transform] duration-700 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`}
    >
      {children}
    </div>
  );
}

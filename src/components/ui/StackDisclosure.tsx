"use client";

import { useId, useState } from "react";

/**
 * Розкривний нумерований список стеку проєкту: плюсик обертається в хрестик,
 * список плавно випадає за 0.3с (grid-rows трюк — анімується будь-яка висота).
 */
export function StackDisclosure({
  items,
  label,
  showLabel,
  hideLabel,
}: {
  items: readonly string[];
  label: string;
  showLabel: string;
  hideLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={open ? hideLabel : showLabel}
        onClick={() => setOpen(!open)}
        className="group/stack flex cursor-pointer items-center gap-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full border border-border transition-colors group-hover/stack:bg-muted">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`size-4 transition-transform duration-300 ease-out ${
              open ? "rotate-45" : ""
            }`}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        {label}
      </button>
      <div
        id={listId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ol className="mt-3 list-decimal space-y-1 pl-9 text-sm text-muted-foreground">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

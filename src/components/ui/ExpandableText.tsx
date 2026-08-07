"use client";

import { useState } from "react";

/** Текст, обрізаний до limit символів з «…» і кнопкою «показати більше». */
export function ExpandableText({
  text,
  limit = 150,
  moreLabel,
  lessLabel,
  className = "",
}: {
  text: string;
  limit?: number;
  moreLabel: string;
  lessLabel: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= limit) {
    return <p className={className}>{text}</p>;
  }

  const short = `${text.slice(0, limit).trimEnd()}…`;

  return (
    <p className={className}>
      {expanded ? text : short}{" "}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {expanded ? lessLabel : moreLabel}
      </button>
    </p>
  );
}

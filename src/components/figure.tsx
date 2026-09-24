import type { ReactNode } from "react";
import { CountUp } from "@/components/motion-bits";
import { isFigure } from "@/lib/is-figure";

// The one figure form on the site (DESIGN.md): a 2px hairline bar, the figure,
// its label. Over the label when the label is short (/work, results); beside it
// when the label is a sentence (slide 01). Accent for results and the upside,
// ink for problems. One size everywhere, below every slide title and headline:
// 24px, 28px from lg.
const TYPE = "text-2xl leading-none lg:text-[1.75rem]";

export function Figure({
  value,
  children,
  beside = false,
  tone = "accent",
  count = false,
  dl = false,
}: {
  value: string;
  children: ReactNode;
  beside?: boolean;
  tone?: "accent" | "ink";
  // Roll the number up when it scrolls into view (slides only).
  count?: boolean;
  // Render as dt/dd inside a parent <dl>.
  dl?: boolean;
}) {
  const mono = isFigure(value);
  const cls = `block whitespace-nowrap ${TYPE} ${
    mono ? `font-mono tabular-nums ${tone === "accent" ? "text-accent" : "text-ink"}` : "font-medium text-ink"
  }`;
  const Term = dl ? "dt" : "p";
  const Desc = dl ? "dd" : "div";
  return (
    <div
      className={`border-l-2 border-rule pl-4 ${
        beside ? "grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-x-4" : ""
      }`}
    >
      <Term className="m-0">{count && mono ? <CountUp value={value} className={cls} /> : <span className={cls}>{value}</span>}</Term>
      <Desc className={`m-0 leading-snug ${beside ? "" : "mt-2"}`}>{children}</Desc>
    </div>
  );
}

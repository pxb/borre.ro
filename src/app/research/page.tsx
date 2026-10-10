import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMeta } from "@/lib/meta";
import { Page, Row } from "@/components/section";
import { Figure } from "@/components/figure";
import { ui } from "@/content/site";
import { research, researchWords as w } from "@/content/research";

export const metadata: Metadata = pageMeta({
  title: w.t("meta.title"),
  description: w.t("meta.description"),
  path: "/research",
});

// What the research says (#624, Pedro 2026-10-10): every sourced figure the
// site uses, each with who was asked and when, so a figure is never shorter
// than its truth. Slide 01 on the homepage links here. Figures and links:
// src/content/research.ts; words: copy/research.md.
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Research() {
  return (
    <Page title={w.t("meta.title")} lead={w.t("meta.description")} crumbs={[{ href: "/", label: ui.t("crumb.home") }]}>
      {research.map((f) => (
        <Row key={f.stat} label={f.label}>
          <div className="max-w-2xl">
            <Figure value={f.stat} beside tone="ink">
              <p className="leading-relaxed text-ink">{sentence(f.claim)}.</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {f.who}{" "}
                <a
                  href={f.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {w.t("source")}
                </a>
              </p>
              <p className="mt-3 flex items-start gap-1.5 font-medium text-pretty text-ink">
                <ArrowRight aria-hidden className="mt-[0.3em] size-4 shrink-0 text-accent" />
                {f.answer}
              </p>
            </Figure>
          </div>
        </Row>
      ))}
    </Page>
  );
}

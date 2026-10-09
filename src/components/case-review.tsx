"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Row } from "@/components/section";
import { ui } from "@/content/site";

// "What would this do for your business?" at the end of each case study's
// results (Pedro, 2026-10-10): the AI readiness review, starting from the work
// in this case. Drawn after the page loads: the review needs JavaScript, and
// the case studies' HTML sits just under the first network round trip.
export function CaseReview({ slug }: { slug: string }) {
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return (
    <Row label={ui.t("case.try.label")}>
      <div className="max-w-2xl">
        <p className="text-xl leading-snug text-ink">{ui.t("case.try.title")}</p>
        <p className="mt-3 leading-relaxed text-ink-soft">{ui.t("case.try.body")}</p>
        <p className="mt-4">
          <Link
            href={`/try?from=${slug}`}
            data-track="try"
            data-track-where={`case-${slug}`}
            className="inline-flex min-h-11 items-center text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-0"
          >
            {ui.t("case.try.go")}
          </Link>
        </p>
      </div>
    </Row>
  );
}

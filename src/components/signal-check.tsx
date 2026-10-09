"use client";

import { words } from "@/content/copy";
import copySignals from "@/content/copy.gen/signal-check";
import { CompanyLookup } from "@/components/company-lookup";

// The signal check block on the prospecting case study: its name, one line,
// and the lookup. Loaded after the page (company-lookup-lazy.tsx).
const w = words(copySignals);

export function SignalCheck() {
  return (
    <div className="grid gap-8 border-t-2 border-ink pt-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
      <div>
        <p className="text-sm font-medium text-ink-soft">{w.t("meta.title")}</p>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">{w.t("lead")}</p>
      </div>
      <CompanyLookup />
    </div>
  );
}

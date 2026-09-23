"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

// The site's one closing offer. Hidden on /contact, where the page itself is
// the offer, and on /, where the story's last slide already closes on it.
export function FooterCta() {
  const path = usePathname();
  if (path === "/contact" || path === "/") return null;
  return (
    <div className="flex flex-col gap-8 border-b border-rule py-16 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="max-w-xl text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink">
          {site.ctaLine}
        </p>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
          {site.ctaNote}
        </p>
      </div>
      <Link
        href="/contact"
        className="btn-orange shrink-0 px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {site.cta}
      </Link>
    </div>
  );
}

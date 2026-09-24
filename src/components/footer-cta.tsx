"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

// The site's one closing offer, and its one ink band (#585): full bleed, so
// every inner page ends on a change of ground. On ink the secondary text is
// --rule (11.2:1) and the accent is only the button ground: accent text on
// ink measures 2.8:1. Hidden on /contact, where the page itself is the offer,
// and on /, where the story's last slide already closes on it.
export function FooterCta() {
  const path = usePathname();
  if (path === "/contact" || path === "/") return null;
  return (
    <div id="footer-offer" className="bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 sm:flex-row sm:items-end sm:justify-between sm:px-10">
        <div>
          <p className="max-w-xl text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-paper">
            {site.ctaLine}
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-rule">{site.ctaNote}</p>
        </div>
        <Link
          href="/contact"
          className="btn-orange shrink-0 px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
        >
          {site.cta}
        </Link>
      </div>
    </div>
  );
}

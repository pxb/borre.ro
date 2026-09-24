"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

// The booking offer, fixed to the foot of the screen once the reader is past
// the first screen (Pedro, 2026-09-24: a permanent bottom bar). Hidden on
// /contact, where the page is the offer, and while the footer's own offer band
// is in view, so the two never show together.
export function OfferBar() {
  const path = usePathname();
  const [past, setPast] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const on = () => setPast(window.scrollY > 400);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const el = document.getElementById("footer-offer");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFooterInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [path]);

  const show = past && !footerInView && path !== "/contact";

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur transition-[opacity,transform] duration-300 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-10">
        <p className="hidden text-base font-medium text-ink sm:block">{site.ctaLine}</p>
        <Link
          href="/contact"
          tabIndex={show ? 0 : -1}
          className="btn-orange w-full px-5 py-3 text-center text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:w-auto"
        >
          {site.cta}
        </Link>
      </div>
    </div>
  );
}

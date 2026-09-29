"use client";

import { useSearchParams } from "next/navigation";
import { serviceFor, site } from "@/content/site";

const FRAME = "h-[60rem] w-full border-y border-rule bg-paper sm:h-[44rem] sm:border";

// The Cal.com calendar. A service page's button arrives as ?service=<slug>, and
// the service's name goes into the booking form's notes, so the call starts on
// the service the reader chose. Rendered on the client only (the page stays
// static): the server sends an empty frame of the same size, so nothing shifts.
export function BookingFrame() {
  const service = serviceFor(useSearchParams().get("service") ?? "");
  const notes = service ? `&notes=${encodeURIComponent(`About: ${service.name}`)}` : "";
  return (
    <iframe
      src={`https://cal.com/${site.booking}?embed=true&theme=light&layout=month_view${notes}`}
      title="Book a free 30-minute call"
      loading="lazy"
      className={FRAME}
    />
  );
}

export function BookingFrameFallback() {
  return <div aria-hidden="true" className={FRAME} />;
}

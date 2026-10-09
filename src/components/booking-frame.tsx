"use client";

import { useSearchParams } from "next/navigation";
import { REVIEW_KEY, serviceFor, site, ui } from "@/content/site";
import { SCORECARD_KEY } from "@/content/scorecard";

const FRAME = "h-[60rem] w-full border-y border-rule bg-paper sm:h-[44rem] sm:border";

// The Cal.com calendar. A service page's button arrives as ?service=<slug>, and
// the service's name goes into the booking form's notes, so the call starts on
// the service the reader chose. Rendered on the client only (the page stays
// static): the server sends an empty frame of the same size, so nothing shifts.
export function BookingFrame() {
  const service = serviceFor(useSearchParams().get("service") ?? "");
  // A scorecard result or a readiness review, kept in this tab only, joins the note.
  let scorecard = "";
  let review = "";
  try {
    scorecard = sessionStorage.getItem(SCORECARD_KEY) ?? "";
    review = sessionStorage.getItem(REVIEW_KEY) ?? "";
  } catch {}
  const note = [service ? `About: ${service.name}` : "", scorecard, review].filter(Boolean).join(". ");
  const notes = note ? `&notes=${encodeURIComponent(note)}` : "";
  return (
    <iframe
      src={`https://cal.com/${site.booking}?embed=true&theme=light&layout=month_view${notes}`}
      title={ui.t("booking.frame")}
      loading="lazy"
      className={FRAME}
    />
  );
}

export function BookingFrameFallback() {
  return <div aria-hidden="true" className={FRAME} />;
}

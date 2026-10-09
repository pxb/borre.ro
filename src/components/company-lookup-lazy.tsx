"use client";

import dynamic from "next/dynamic";

// The signal check on the prospecting case study, loaded after the page: it
// only works with JavaScript, so it adds nothing to the server's HTML, and
// leaving it out keeps the case study inside the first network round trip
// (measured 2026-10-09: 0.2 KB over cost 150 ms of first paint in Lighthouse).
// The placeholder holds the block's height, so nothing moves.
export const SignalCheckLazy = dynamic(() => import("@/components/signal-check").then((m) => m.SignalCheck), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="min-h-[16rem] border-t-2 border-ink" />,
});

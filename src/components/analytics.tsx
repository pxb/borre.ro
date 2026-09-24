"use client";

import { useEffect } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";

// Cookieless analytics on Vercel Web Analytics (#576): page views on every
// route, plus a click event for anything marked data-track="<name>", with
// data-track-<prop> attributes sent as its properties. One listener for the
// whole site, so server-rendered links can be tracked without becoming client
// components. Custom events are only recorded on Vercel's Pro plan; on Hobby
// the calls are made and page views still count. The privacy page names Vercel.
export function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const props: Record<string, string> = {};
      for (const [k, v] of Object.entries(el.dataset)) {
        if (k.startsWith("track") && k !== "track" && v) {
          props[k.slice(5).toLowerCase()] = v;
        }
      }
      track(el.dataset.track!, props);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return <VercelAnalytics />;
}

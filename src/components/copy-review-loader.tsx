"use client";

import { useEffect, useState, type ComponentType } from "react";

// Loads the copy review mode (#561) only when asked for (?copy, or already on in
// this tab), and only in builds that allow it. COPY_REVIEW is set at build time
// in next.config.ts: "off" on the live site, so this whole branch, and the review
// code with it, is dropped from the production bundle.
export function CopyReviewLoader() {
  const [Review, setReview] = useState<ComponentType | null>(null);
  useEffect(() => {
    if (process.env.COPY_REVIEW === "on") {
      let want = false;
      try {
        const q = new URLSearchParams(location.search).get("copy");
        want = q !== "off" && (q !== null || sessionStorage.getItem("copy-review") === "1");
      } catch {}
      if (want) import("./copy-review").then((m) => setReview(() => m.CopyReview));
    }
  }, []);
  return Review ? <Review /> : null;
}

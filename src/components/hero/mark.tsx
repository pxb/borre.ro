"use client";

/*
 * PARKED 2026-09-21, not mounted anywhere. Kept deliberately, do not delete.
 *
 * The voxel mark was the hero's right-hand element until Vanta NET replaced it.
 * Pedro: "Let's remove the sphere for now but don't lose the code."
 * Baserow #571 carries the reasoning and the conditions for bringing it back.
 */

import dynamic from "next/dynamic";

/* Static fallback: a flat isometric silhouette of the same mark.
   Ships in the HTML, so the hero is never empty while WebGL loads. */
function MarkFallback() {
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="var(--rule)" strokeWidth="1.2">
        <path d="M0 -44 L38 -22 L38 22 L0 44 L-38 22 L-38 -22 Z" />
        <path d="M0 -44 L0 0 M0 0 L38 22 M0 0 L-38 22" />
      </g>
    </svg>
  );
}

const Scene = dynamic(() => import("./mark-scene"), {
  ssr: false,
  loading: () => <MarkFallback />,
});

export function HeroMark() {
  return (
    <div className="pointer-events-none relative h-full w-full">
      <Scene />
    </div>
  );
}

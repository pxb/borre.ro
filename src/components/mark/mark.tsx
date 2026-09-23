"use client";

/*
 * The voxel mark. It was the homepage hero's right-hand element until Vanta NET
 * took that slot (2026-09-21, Pedro: "remove the sphere for now but don't lose
 * the code"). It was then deleted by mistake in eb6b9ba and restored from git
 * on 2026-09-23 to stand in for a photo on /about. Do not delete.
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

export function VoxelMark({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none relative ${className ?? ""}`}>
      <Scene />
    </div>
  );
}

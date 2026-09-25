"use client";

/*
 * The voxel mark. It was the homepage hero's right-hand element until Vanta NET
 * took that slot (2026-09-21, Pedro: "remove the sphere for now but don't lose
 * the code"). It was then deleted by mistake in eb6b9ba and restored from git
 * on 2026-09-23 to stand in for a photo on /about. Do not delete.
 */

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// A still of the mark, rendered by this scene at its first frame
// (Lab/borre-tools/cdp-mark-still.mjs). It ships in the HTML and is all that
// phones and reduced motion ever get: three.js costs about 1.5 s of script on
// a mid-range phone, a single 505 ms task that loading later cannot split
// (#582: 641 ms of blocking time on /about). Wide screens swap in the live
// scene once the page has loaded, the browser is idle and the mark is in view.
function MarkStill() {
  return (
    <Image
      src="/mark-still.webp"
      alt=""
      width={640}
      height={640}
      sizes="20rem"
      // Above the fold on /about, and the page's largest paint on phones.
      preload
      className="absolute inset-0 h-full w-full"
    />
  );
}

const Scene = dynamic(() => import("./mark-scene"), { ssr: false });

function useLiveScene<T extends Element>() {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !wide || reduce) return;
    let idle = 0;
    let loaded = document.readyState === "complete";
    let seen = false;
    const go = () => {
      if (!loaded || !seen) return;
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => setLive(true), { timeout: 3000 });
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      seen = true;
      io.disconnect();
      go();
    });
    io.observe(el);
    const onLoad = () => {
      loaded = true;
      go();
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });
    return () => {
      io.disconnect();
      window.removeEventListener("load", onLoad);
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);
  return [ref, live] as const;
}

export function VoxelMark({ className }: { className?: string }) {
  const [ref, live] = useLiveScene<HTMLDivElement>();
  const [drawn, setDrawn] = useState(false);
  return (
    <div ref={ref} className={`pointer-events-none relative ${className ?? ""}`}>
      {drawn ? null : <MarkStill />}
      {live ? <Scene onReady={() => setDrawn(true)} /> : null}
    </div>
  );
}

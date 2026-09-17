"use client";

import { useEffect, useRef, useState } from "react";

/* Animated gradient behind the work section. Canvas 2D, not WebGL:
   the mark owns the only 3D context on the page. */
export function WorkField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);

    const ctx = el.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const draw = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      if (el.width !== w) el.width = w;
      if (el.height !== h) el.height = h;
      ctx.clearRect(0, 0, w, h);

      const blobs = [
        { x: 0.22, y: 0.3, r: 0.55, c: "216, 69, 42" },
        { x: 0.78, y: 0.66, r: 0.5, c: "232, 120, 80" },
        { x: 0.55, y: 0.18, r: 0.42, c: "180, 90, 190" },
      ];

      blobs.forEach((b, i) => {
        const drift = Math.sin(t * 0.0004 + i * 2.1) * 0.06;
        const cx = (b.x + drift) * w;
        const cy = (b.y + Math.cos(t * 0.0003 + i) * 0.05) * h;
        const rad = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `rgba(${b.c}, 0.17)`);
        g.addColorStop(1, `rgba(${b.c}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
    };

    const loop = () => {
      t += 16;
      draw();
      raf = requestAnimationFrame(loop);
    };

    draw();
    if (active && !reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [active]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      style={{
        // Without this the blobs clip square against the section edge.
        maskImage:
          "radial-gradient(ellipse 75% 65% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 65% at 50% 50%, black 40%, transparent 100%)",
      }}
    />
  );
}

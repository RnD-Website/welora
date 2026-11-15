"use client";

import { useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/* ------------------------------------------------------------
   Procedural topographic contour lines — WELORA's take on the
   reference's terrain texture. Pure maths, rendered once.
   ------------------------------------------------------------ */
const W = 1600;
const H = 1100;

function wobble(theta: number, seed: number, level: number) {
  return (
    Math.sin(theta * 3 + seed) * 0.09 +
    Math.sin(theta * 5 + seed * 1.7 + level * 0.15) * 0.05 +
    Math.cos(theta * 2 - seed * 0.6 + level * 0.08) * 0.11 +
    Math.sin(theta * 9 + seed * 2.3) * 0.015
  );
}

function ring(cx: number, cy: number, r: number, seed: number, level: number) {
  const pts: string[] = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const rr = r * (1 + wobble(t, seed, level));
    const x = cx + Math.cos(t) * rr * 1.25;
    const y = cy + Math.sin(t) * rr;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join("") + "Z";
}

const PEAKS = [
  { x: 260, y: 240, seed: 1.2, n: 22, step: 26 },
  { x: 1280, y: 760, seed: 4.1, n: 26, step: 28 },
  { x: 900, y: 120, seed: 2.6, n: 14, step: 24 },
];

const PATHS = PEAKS.flatMap((p) =>
  Array.from({ length: p.n }, (_, i) => ring(p.x, p.y, 18 + i * p.step, p.seed, i)),
);

export default function ContourBackground({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current?.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={clsx("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <g
        fill="none"
        stroke={tone === "dark" ? "#242421" : "#fcfaf6"}
        strokeOpacity={tone === "dark" ? 0.09 : 0.14}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      >
        {PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

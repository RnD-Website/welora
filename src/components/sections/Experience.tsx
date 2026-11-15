"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { EXPERIENCE } from "@/data/content";
import Label from "@/components/ui/Label";
import PillButton from "@/components/ui/PillButton";
import ExperienceCollage from "./ExperienceCollage";

type Dash = {
  gx: number; gy: number; ga: number;
  tx: number; ty: number; ta: number;
  delay: number; ring: boolean;
};

const DASH_COLOR = "255, 247, 240"; // warm cream on terracotta
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerpAngle = (a: number, b: number, t: number) => {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
};

/**
 * Section 05 — The Experience.
 * A pinned field of drifting dashes gathers into a sunlit ring as you
 * scroll; the four cardinal points become Mind · Body · Rest · Connection
 * and the chapter headline resolves in the centre.
 * (Reference: the pinned compass-rose section.)
 */
export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const ctx2d = canvas.getContext("2d")!;
      const q = gsap.utils.selector(root);
      const state = { p: 0, time: 0 };
      let dashes: Dash[] = [];
      let W = 0, H = 0, R = 0, dpr = 1;

      const build = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = canvas.clientWidth;
        H = canvas.clientHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        R = Math.min(W, H) * (W < 768 ? 0.4 : 0.36);

        const gap = W < 768 ? 64 : 104;
        const cols = Math.ceil(W / gap) + 1;
        const rows = Math.ceil(H / gap) + 1;
        const grid: { x: number; y: number }[] = [];
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++)
            grid.push({ x: c * gap + (r % 2 ? gap / 2 : 0) - gap / 4, y: r * gap + gap / 3 });

        const ringCount = W < 768 ? 48 : 72;
        const cx = W / 2, cy = H / 2;
        // Assign the grid dashes closest to each ring slot to the ring
        const used = new Set<number>();
        dashes = [];
        for (let k = 0; k < ringCount; k++) {
          const th = (k / ringCount) * Math.PI * 2 - Math.PI / 2;
          const tx = cx + Math.cos(th) * R;
          const ty = cy + Math.sin(th) * R;
          let best = -1, bd = Infinity;
          grid.forEach((g, i) => {
            if (used.has(i)) return;
            const d = (g.x - tx) ** 2 + (g.y - ty) ** 2;
            if (d < bd) { bd = d; best = i; }
          });
          if (best < 0) continue;
          used.add(best);
          const g = grid[best];
          dashes.push({
            gx: g.x, gy: g.y, ga: Math.atan2(g.y - cy * 1.6, g.x - W * 1.15),
            tx, ty, ta: th, ring: true,
            delay: (k / ringCount) * 0.25,
          });
        }
        grid.forEach((g, i) => {
          if (used.has(i)) return;
          const a = Math.atan2(g.y - cy, g.x - cx);
          const out = Math.max(W, H) * 0.9;
          dashes.push({
            gx: g.x, gy: g.y, ga: Math.atan2(g.y - cy * 1.6, g.x - W * 1.15),
            tx: cx + Math.cos(a) * out, ty: cy + Math.sin(a) * out, ta: a,
            ring: false, delay: Math.random() * 0.2,
          });
        });
      };

      const draw = () => {
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx2d.clearRect(0, 0, W, H);
        ctx2d.lineCap = "round";
        const small = W < 768;
        for (const d of dashes) {
          const local = easeInOut(clamp01((state.p - d.delay) / 0.75));
          const sway = Math.sin(state.time * 0.8 + d.gx * 0.006 + d.gy * 0.004) * 0.22 * (1 - local);
          const x = lerp(d.gx, d.tx, local);
          const y = lerp(d.gy, d.ty, local);
          const a = lerpAngle(d.ga + sway, d.ta, local);
          const len = d.ring ? lerp(small ? 30 : 46, small ? 22 : 34, local) : (small ? 30 : 46);
          const thick = d.ring ? lerp(small ? 5 : 7, small ? 3 : 4, local) : (small ? 5 : 7);
          const alpha = d.ring ? lerp(0.32, 0.92, local) : 0.32 * (1 - local);
          if (alpha <= 0.01) continue;
          ctx2d.strokeStyle = `rgba(${DASH_COLOR}, ${alpha})`;
          ctx2d.lineWidth = thick;
          ctx2d.beginPath();
          ctx2d.moveTo(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2);
          ctx2d.lineTo(x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2);
          ctx2d.stroke();
        }
      };

      build();
      const tick = (t: number) => { state.time = t; draw(); };

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const heading = q("[data-heading]");
        const fades = q("[data-fade]");
        const points = q("[data-point]");
        gsap.set([heading, fades, points], { autoAlpha: 0 });
        gsap.set(heading, { y: 40, filter: "blur(12px)" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.9}`,
            pin: q("[data-pin]")[0],
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: () => { build(); draw(); },
          },
        });
        tl.to(state, { p: 1, duration: 1 })
          .to(points, { autoAlpha: 1, duration: 0.2, stagger: 0.05 }, 0.7)
          .to(heading, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out" }, 0.62)
          .to(fades, { autoAlpha: 1, duration: 0.25, stagger: 0.06 }, 0.78)
          .to({}, { duration: 0.25 });

        // Render only while the chapter is on screen.
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
        });
        return () => { st.kill(); gsap.ticker.remove(tick); };
      });

      mm.add(MQ.reduce, () => {
        state.p = 1;
        draw();
        const onResize = () => { build(); draw(); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      });
    },
    { scope: root },
  );

  const [north, east, south, west] = EXPERIENCE.compass;

  return (
    <section ref={root} id="experience" aria-labelledby="experience-title" className="relative">
      <div data-bg="#fcfcfa" className="relative">
        <div data-pin className="relative h-svh w-full overflow-hidden">
          {/* Warm sunlit glow */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_65%_at_50%_50%,#f4a27f_0%,#e2724f_42%,#c4532f_100%)]" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(32%_32%_at_50%_50%,rgba(255,236,214,0.45),transparent_70%)]" />
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

          {/* Cardinal points of wellbeing */}
          <div aria-hidden className="t-mono pointer-events-none absolute inset-0 text-soft-white/80">
            <span data-point className="absolute left-1/2 top-[calc(50%-min(36vw,36vh)-2.4rem)] -translate-x-1/2 max-md:top-[calc(50%-40vw-2.2rem)]">{north}</span>
            <span data-point className="absolute left-[calc(50%+min(36vw,36vh)+1.6rem)] top-1/2 -translate-y-1/2 max-md:hidden">{east}</span>
            <span data-point className="absolute left-1/2 top-[calc(50%+min(36vw,36vh)+1.4rem)] -translate-x-1/2 max-md:top-[calc(50%+40vw+1.2rem)]">{south}</span>
            <span data-point className="absolute right-[calc(50%+min(36vw,36vh)+1.6rem)] top-1/2 -translate-y-1/2 max-md:hidden">{west}</span>
          </div>

          {/* Centre copy */}
          <div className="absolute inset-0 flex items-center justify-center px-page">
            <div className="flex max-w-[27rem] flex-col items-center text-center max-md:max-w-[17rem]">
              <div data-fade>
                <Label tone="light" className="mb-5">{EXPERIENCE.label}</Label>
              </div>
              <h2 id="experience-title" data-heading className="text-[clamp(1.8rem,3.4vw,3.6rem)] leading-[1] tracking-[-0.04em] text-soft-white">
                Small Changes. <em className="serif-accent">A More Meaningful Life.</em>
              </h2>
              <p data-fade className="mt-5 text-[clamp(0.95rem,1.1vw,1.08rem)] leading-relaxed text-soft-white/80 max-md:hidden">
                {EXPERIENCE.description}
              </p>
              <div data-fade className="mt-7">
                <PillButton href="#mind-body" size="md" variant="light">Begin the journey</PillButton>
              </div>
            </div>
          </div>

          {/* Side links (reference: mono deep-links at the ring's flanks) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-between px-page md:flex">
            {EXPERIENCE.sideLinks.map((l) => (
              <a
                key={l.label}
                data-fade
                href={l.href}
                className="t-mono group pointer-events-auto inline-flex items-center gap-2 text-soft-white/80 hover:text-soft-white"
              >
                {l.label}
                <svg width="10" height="10" viewBox="0 0 16 16" aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                  <path d="M5 2.5 10.5 8 5 13.5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <ExperienceCollage />
    </section>
  );
}

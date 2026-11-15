"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { HERO } from "@/data/content";
import Label from "@/components/ui/Label";
import Aurora from "@/components/ui/Aurora";

/**
 * Section 02 — Cinematic hero.
 *
 * On load: the photograph resolves out of a soft blur while the three
 * headline lines rise character by character from their masks.
 *
 * On scroll (pinned): the full-bleed frame contracts into an organic
 * circle, then a smaller circular medallion, while the page washes to sage and the
 * scattered headline converges — "Wellbeing." settles beneath the
 * portrait and the supporting copy arrives. (Reference: the pinned
 * portrait-to-medallion hero.)
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: MQ.motion,
          mobile: "(max-width: 767px)",
        },
        (ctx) => {
          const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
          if (!motion) return;

          const frame = q("[data-frame]")[0];
          const photo = q("[data-photo]")[0];
          const photoInner = q("[data-photo-inner]")[0];
          const shade = q("[data-shade]")[0];
          const lines = q("[data-line]");
          const support = q("[data-support]");
          const cue = q("[data-cue]");

          /* ---------- Intro (time-based) ---------- */
          const splits = lines.map((l) =>
            SplitText.create(l.querySelector("[data-text]"), { type: "chars", mask: "chars" }),
          );
          gsap.set(support, { autoAlpha: 0, y: 30 });

          const intro = gsap.timeline({ delay: 0.15 });
          intro
            .fromTo(photoInner, { scale: 1.18, filter: "blur(22px)" }, { scale: 1, filter: "blur(0px)", duration: 2.4, ease: "expo.out" })
            .from(
              splits.flatMap((s) => s.chars),
              { yPercent: 120, duration: 1.4, ease: "expo.out", stagger: { each: 0.028, from: "start" } },
              0.35,
            )
            .from(cue, { autoAlpha: 0, y: 12, duration: 1 }, 1.2);

          /* ---------- Scroll story (pinned, scrubbed) ---------- */
          const vw = () => window.innerWidth;
          const vh = () => window.innerHeight;
          // Perfect circle at both stages (large circle, then smaller medallion).
          const archW = () => (mobile ? vw() * 0.72 : Math.min(vw() * 0.32, 500, vh() * 0.62));
          const archH = archW;
          const smallW = () => (mobile ? vw() * 0.5 : Math.min(vw() * 0.2, 300));
          const smallH = smallW;
          const arch = (w: number) => `${w / 2}px ${w / 2}px ${w / 2}px ${w / 2}px / ${w / 2}px ${w / 2}px ${w / 2}px ${w / 2}px`;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${vh() * (mobile ? 2 : 2.4)}`,
              pin: q("[data-pin]")[0],
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.addLabel("contract")
            .fromTo(
              frame,
              { width: () => vw(), height: () => vh(), borderRadius: "0px 0px 0px 0px / 0px 0px 0px 0px" },
              {
                width: archW,
                height: archH,
                borderRadius: () => arch(archW()),
                duration: 1,
                ease: "power2.inOut",
              },
              "contract",
            )
            .fromTo(photo, { scale: 1 }, { scale: 1.12, duration: 1, ease: "power1.inOut" }, "contract")
            .to(shade, { opacity: 0, duration: 0.7 }, "contract")
            .to(lines, { color: "#15201c", duration: 0.6 }, "contract+=0.15")
            .to(cue, { autoAlpha: 0, duration: 0.2 }, "contract")
            .to(lines[0], { xPercent: mobile ? 0 : -8, duration: 1 }, "contract")
            .to(lines[1], { xPercent: mobile ? 0 : 10, duration: 1 }, "contract")
            .addLabel("medallion")
            .to(
              frame,
              {
                width: smallW,
                height: smallH,
                y: () => -vh() * (mobile ? 0.12 : 0.14),
                borderRadius: () => arch(smallW()),
                duration: 0.9,
                ease: "power2.inOut",
              },
              "medallion",
            )
            .to(photo, { scale: 1, duration: 0.9 }, "medallion")
            .to([lines[0], lines[1]], { autoAlpha: 0, filter: "blur(10px)", y: -40, duration: 0.5, stagger: 0.1 }, "medallion")
            .to(
              lines[2],
              {
                top: () => (mobile ? "54%" : "57%"),
                scale: mobile ? 0.92 : 0.86,
                duration: 0.9,
                ease: "power2.inOut",
              },
              "medallion",
            )
            .to(support, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "medallion+=0.5")
            .to({}, { duration: 0.35 }); // breathing room before release

          return () => splits.forEach((s) => s.revert());
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" data-bg="#e3eee6" className="relative" aria-labelledby="hero-title">
      <div data-pin className="relative h-svh w-full overflow-hidden">
        <Aurora tone="mint" />
        {/* Shrinking photographic frame */}
        <div
          data-frame
          className="absolute left-1/2 top-1/2 h-svh w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden will-change-[width,height,border-radius]"
        >
          <div data-photo className="absolute inset-0 will-change-transform">
            <div data-photo-inner className="absolute inset-0">
              <video
                src="/videos/hero.mp4"
                poster="/images/hero-video-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="A woman stretching and smiling in a sunlit green meadow"
                className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
              />
            </div>
          </div>
          <div
            data-shade
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,24,20,0.5)_0%,rgba(12,24,20,0.12)_32%,rgba(12,24,20,0.04)_60%,rgba(12,24,20,0.42)_100%),radial-gradient(120%_80%_at_50%_40%,rgba(12,24,20,0)_30%,rgba(12,24,20,0.35)_100%)]"
          />
        </div>

        <h1 id="hero-title" className="sr-only">
          {HERO.lines.join(" ")}
        </h1>

        {/* Scattered editorial headline */}
        <div aria-hidden className="pointer-events-none absolute inset-0 text-soft-white [text-shadow:0_2px_40px_rgba(36,36,33,0.22)]">
          <div data-line className="t-display absolute right-[var(--pad-x)] top-[17%] whitespace-nowrap md:top-[13%]">
            <span data-text className="block">Find Your <em className="serif-accent">Balance.</em></span>
          </div>
          <div data-line className="t-display absolute left-[var(--pad-x)] top-[40%] whitespace-nowrap md:top-[41%]">
            <span data-text className="block">{HERO.lines[1]}</span>
          </div>
          <div data-line className="t-display absolute inset-x-0 top-[66%] origin-center text-center whitespace-nowrap md:top-[68%]">
            <span data-text className="inline-block"><em className="serif-accent">Wellbeing.</em></span>
          </div>
        </div>

        {/* Supporting copy — arrives once the medallion forms */}
        <div
          data-support
          className="absolute inset-x-0 bottom-[7%] flex flex-col items-center gap-5 px-page text-center md:bottom-[8%]"
        >
          <Label className="motion-reduce:text-soft-white/80">Wellness, Reimagined.</Label>
          <p className="t-lead max-w-[36rem] text-charcoal/80 motion-reduce:text-soft-white">{HERO.supporting}</p>
        </div>

        {/* Scroll cue */}
        <div data-cue className="motion-reduce:hidden absolute bottom-6 left-[var(--pad-x)] flex items-center gap-3 text-soft-white/85">
          <span className="relative block h-10 w-px overflow-hidden bg-soft-white/30">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.2s_cubic-bezier(.65,0,.35,1)_infinite] bg-soft-white" />
          </span>
          <span className="t-mono">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

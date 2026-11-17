"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { EXPERIENCE } from "@/data/content";
import { img } from "@/lib/images";
import RevealText from "@/components/ui/RevealText";

/**
 * Section 05 (continued) — an interactive "moments" index that reveals
 * imagery following the cursor.
 */
export default function ExperienceCollage() {
  const root = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(q("[data-row]"), {
          y: 60,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: q("[data-list]")[0], start: "top 80%", once: true },
        });
      });

      // Cursor-following preview (desktop pointer only)
      mm.add("(min-width: 1024px) and (hover: hover)", () => {
        const xTo = gsap.quickTo(follower.current, "x", { duration: 0.7, ease: "power3.out" });
        const yTo = gsap.quickTo(follower.current, "y", { duration: 0.7, ease: "power3.out" });
        const list = q("[data-list]")[0] as HTMLElement;
        const move = (e: PointerEvent) => {
          const r = list.getBoundingClientRect();
          xTo(e.clientX - r.left);
          yTo(e.clientY - r.top);
        };
        list.addEventListener("pointermove", move);
        return () => list.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-bg="#fcfcfa" className="relative px-page py-section">
      <div className="mx-auto max-w-[90rem]">
        <p className="t-lead mb-16 max-w-[30rem] text-charcoal/75 md:hidden">{EXPERIENCE.description}</p>

        {/* Moments index with interactive reveal */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <RevealText as="h3" className="t-h3 max-w-[14ch]">
              Four moments that shape a day.
            </RevealText>
          </div>

          <div
            data-list
            className="relative md:col-span-8"
            onPointerLeave={() => setActive(null)}
          >
            <ul>
              {EXPERIENCE.moments.map((m, i) => {
                const photo = img(m.image);
                return (
                  <li
                    key={m.title}
                    data-row
                    onPointerEnter={() => setActive(i)}
                    className="group relative flex items-center justify-between gap-6 border-t border-charcoal/15 py-6 last:border-b md:py-8"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="t-mono text-charcoal/45">0{i + 1}</span>
                      <span
                        className={clsx(
                          "text-[clamp(1.9rem,4.4vw,4.4rem)] leading-none tracking-[-0.035em] transition-[transform,color,opacity] duration-700 ease-[var(--ease-out-expo)] md:group-hover:translate-x-4",
                          active !== null && active !== i ? "md:opacity-35" : "opacity-100",
                        )}
                      >
                        {m.title}
                      </span>
                    </div>
                    <span className="t-mono hidden text-charcoal/55 sm:block">{m.meta}</span>
                    {/* Inline thumbnail for touch / small screens */}
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full lg:hidden">
                      <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Floating preview */}
            <div
              ref={follower}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
            >
              <div
                className={clsx(
                  "relative -ml-[8.5rem] -mt-[11rem] h-[22rem] w-[17rem] overflow-hidden rounded-[18px] transition-[clip-path,opacity] duration-700 ease-[var(--ease-out-expo)]",
                  active === null ? "opacity-0 [clip-path:inset(50%_50%_50%_50%_round_18px)]" : "opacity-100 [clip-path:inset(0%_0%_0%_0%_round_18px)]",
                )}
              >
                {EXPERIENCE.moments.map((m, i) => {
                  const photo = img(m.image);
                  return (
                    <Image
                      key={m.title}
                      src={photo.src}
                      alt=""
                      fill
                      sizes="272px"
                      className={clsx(
                        "object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
                        active === i ? "scale-100 opacity-100" : "scale-110 opacity-0",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

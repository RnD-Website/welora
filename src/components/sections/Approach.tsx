"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { APPROACH } from "@/data/content";
import { img } from "@/lib/images";
import Label from "@/components/ui/Label";
import RevealText from "@/components/ui/RevealText";
import ContourBackground from "@/components/ui/ContourBackground";

/* Each principle gets its own image silhouette so the four blocks read
   as visually distinct: frame · arch · medallion · organic blob. */
const SHAPE = [
  "rounded-[14px]",
  "rounded-t-[999px] rounded-b-[14px]",
  "rounded-full",
  "rounded-[58%_42%_50%_50%/46%_54%_46%_54%]",
];

/**
 * Section 04 — Our Approach.
 * Staggered two-line headline over a drifting topographic field
 * (reference: "Beyond the plateau"), followed by four pastel principle
 * cards that rise from staggered depths as you scroll.
 */
export default function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const cards = q("[data-card]");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 140 + i * 110 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 95%", end: "top 30%", scrub: 0.8 },
            },
          );
        });
      });

      mm.add(MQ.mobile, () => {
        q("[data-card]").forEach((card) => {
          gsap.from(card, {
            y: 80,
            autoAlpha: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
          });
        });
      });

      mm.add(MQ.motion, () => {
        gsap.from(q("[data-intro]"), {
          y: 40,
          autoAlpha: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: q("[data-intro]")[0], start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="approach"
      data-bg="#f7f5f0"
      aria-labelledby="approach-title"
      className="relative overflow-hidden py-section"
    >
      <ContourBackground />

      <div className="relative px-page">
        <div className="mx-auto max-w-[90rem]">
          <Label className="mb-10 md:mb-14">{APPROACH.label}</Label>

          <h2 id="approach-title" className="t-h1 text-charcoal">
            <RevealText as="span" className="block md:pl-[16%]">
              {APPROACH.heading[0]}
            </RevealText>
            <RevealText as="span" className="block md:pl-[42%]" delay={0.12}>
              Way to <em className="serif-accent text-terracotta">Live Well.</em>
            </RevealText>
          </h2>

          <p data-intro className="t-lead mt-10 max-w-[28rem] text-charcoal/70 md:ml-[42%] md:mt-14">
            {APPROACH.intro}
          </p>

          <ol data-grid className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-28 lg:grid-cols-4 lg:gap-5">
            {APPROACH.principles.map((p, i) => {
              const photo = img(p.image);
              const dark = i === 3;
              return (
                <li key={p.n} data-card className="will-change-transform">
                  <article
                    className={clsx(
                      "group relative flex h-full min-h-[32rem] flex-col overflow-hidden rounded-[24px] p-6 ring-1 transition-[transform,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-2 hover:shadow-[0_40px_80px_-40px_rgba(31,33,29,0.45)] md:p-7",
                      dark ? "bg-sage-deep text-soft-white ring-white/5" : clsx(p.tone, "text-charcoal ring-charcoal/[0.06]"),
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={clsx("t-mono", dark ? "text-soft-white/55" : "text-charcoal/55")}>{p.n}</span>
                      <span className={clsx("grid size-9 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-45deg] group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-soft-white", dark ? "border-white/25" : "border-charcoal/20")}>
                        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
                          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </span>
                    </div>

                    <h3 className="t-h3 mt-10 max-w-[12ch]">{p.title}</h3>
                    <p className={clsx("mt-4 max-w-[22rem] text-[1rem] leading-relaxed", dark ? "text-soft-white/70" : "text-charcoal/70")}>{p.body}</p>

                    <div className="mt-auto pt-10">
                      <div className={clsx("relative mx-auto aspect-square w-full max-w-[18rem] overflow-hidden shadow-[0_24px_50px_-28px_rgba(31,33,29,0.6)]", SHAPE[i])}>
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.08]"
                        />
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

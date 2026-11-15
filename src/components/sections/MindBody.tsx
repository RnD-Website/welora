"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { MIND_BODY } from "@/data/content";
import { img } from "@/lib/images";
import Label from "@/components/ui/Label";
import RevealText from "@/components/ui/RevealText";
import PillButton from "@/components/ui/PillButton";

/**
 * Section 06 — Mind & Body.
 * Two oversized editorial features. Each photograph opens through a
 * scroll-scrubbed mask (a medallion for Mind, a capsule for Body) while
 * its giant word glides across the frame.
 */
export default function MindBody() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q("[data-feature]").forEach((feature) => {
          const mask = feature.querySelector<HTMLElement>("[data-mask]")!;
          const photo = feature.querySelector<HTMLElement>("[data-photo]")!;
          const word = feature.querySelector<HTMLElement>("[data-word]")!;
          const copy = feature.querySelectorAll<HTMLElement>("[data-copy] > *");
          const shape = feature.dataset.feature;

          gsap.fromTo(
            mask,
            {
              clipPath:
                shape === "mind"
                  ? "inset(18% 28% 18% 28% round 999px)"
                  : "inset(30% 6% 30% 6% round 999px)",
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 22px)",
              ease: "none",
              scrollTrigger: { trigger: feature, start: "top 85%", end: "center 55%", scrub: 0.8 },
            },
          );
          gsap.fromTo(
            photo,
            { scale: 1.3, yPercent: -6 },
            {
              scale: 1,
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: feature, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
          gsap.fromTo(
            word,
            { xPercent: shape === "mind" ? 18 : -18 },
            {
              xPercent: shape === "mind" ? -6 : 6,
              ease: "none",
              scrollTrigger: { trigger: feature, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
          gsap.from(copy, {
            y: 40,
            autoAlpha: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: feature.querySelector("[data-copy]"), start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="mind-body"
      data-bg="#f7f5f0"
      aria-labelledby="mindbody-title"
      className="relative overflow-hidden px-page pb-section pt-[clamp(2rem,6vw,5rem)]"
    >
      <div className="mx-auto max-w-[90rem]">
        <header className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Label>{MIND_BODY.label}</Label>
          </div>
          <RevealText as="h2" id="mindbody-title" className="t-h1 md:col-span-9 [text-wrap:balance]">
            Where <em className="serif-accent text-terracotta">Mind</em> and <em className="serif-accent text-terracotta">Body</em> Find Their Balance.
          </RevealText>
        </header>

        <div className="mt-[clamp(5rem,10vw,9rem)] space-y-[clamp(7rem,14vw,13rem)]">
          {MIND_BODY.features.map((f, i) => {
            const photo = img(f.image);
            const flip = i % 2 === 1;
            return (
              <article key={f.key} data-feature={f.key} className="relative grid grid-cols-1 items-end gap-10 md:grid-cols-12 md:gap-6">
                <div className={clsx("relative md:col-span-7", flip && "md:order-2 md:col-start-6")}>
                  <div data-mask className="relative aspect-[4/5] overflow-hidden rounded-[22px] md:aspect-[16/12]">
                    <div data-photo className="absolute inset-0 will-change-transform">
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
                    </div>
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0c1c17]/45 via-transparent to-transparent" />
                    {/* Giant word, gliding across the frame */}
                    <span
                      data-word
                      aria-hidden
                      className={clsx(
                        "pointer-events-none absolute bottom-[-0.08em] select-none whitespace-nowrap font-[family-name:var(--font-serif)] text-[clamp(6.5rem,20vw,20rem)] italic leading-[0.8] tracking-[-0.03em] text-soft-white [text-shadow:0_10px_60px_rgba(10,24,20,0.25)]",
                        flip ? "right-[0.04em]" : "left-[0.02em]",
                      )}
                    >
                      {f.word}
                    </span>
                  </div>
                </div>

                <div data-copy className={clsx("relative md:col-span-4", flip ? "md:order-1 md:col-start-1" : "md:col-start-9")}>
                  <p className="t-mono text-charcoal/55">0{i + 1} — {f.word}</p>
                  <h3 className="t-h3 mt-5 text-[clamp(2rem,3.4vw,3.2rem)]">{f.title}</h3>
                  <p className="t-lead mt-5 max-w-[26rem] text-charcoal/75">{f.body}</p>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-charcoal/20 px-3.5 py-1.5 text-[0.82rem] text-charcoal/80 transition-colors duration-300 hover:border-charcoal hover:bg-charcoal hover:text-soft-white"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <PillButton href="#stories" variant="outline-dark">{`Explore ${f.word.toLowerCase()}`}</PillButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

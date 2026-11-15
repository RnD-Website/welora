"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { PHILOSOPHY } from "@/data/content";
import { img } from "@/lib/images";
import Label from "@/components/ui/Label";
import ScrubText from "@/components/ui/ScrubText";
import ParallaxImage from "@/components/ui/ParallaxImage";
import OrganicShape from "@/components/ui/OrganicShape";
import Aurora from "@/components/ui/Aurora";

/**
 * Section 03 — Brand introduction.
 * The manifesto inks in word by word (reference: the centred statement
 * after the hero), then the page washes to soft white for an
 * asymmetrical editorial spread with masked image reveals.
 */
export default function Philosophy() {
  const root = useRef<HTMLElement>(null);
  const tea = img("philosophy-tea");
  const light = img("philosophy-light");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Description + pillar rows rise in sequence
        gsap.from(q("[data-rise]"), {
          y: 50,
          autoAlpha: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: q("[data-copy]")[0], start: "top 80%", once: true },
        });
        // Pillar rules draw across
        gsap.from(q("[data-rule]"), {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 1.4,
          ease: "expo.inOut",
          stagger: 0.12,
          scrollTrigger: { trigger: q("[data-copy]")[0], start: "top 75%", once: true },
        });
        // Blob medallion floats against the scroll
        gsap.fromTo(
          q("[data-blob]"),
          { yPercent: 25, rotate: -6 },
          {
            yPercent: -25,
            rotate: 6,
            ease: "none",
            scrollTrigger: { trigger: q("[data-spread]")[0], start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="philosophy" aria-label={PHILOSOPHY.label} className="relative">
      {/* Manifesto */}
      <div data-bg="#e3eee6" className="relative overflow-hidden px-page pb-[clamp(5rem,10vw,9rem)] pt-[clamp(4rem,8vw,7rem)]">
        <Aurora tone="mint" className="opacity-80" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-b from-transparent to-[#fcfcfa]" />
        <div className="relative mx-auto flex max-w-[64rem] flex-col items-center text-center">
          <Label className="mb-8 md:mb-10">{PHILOSOPHY.label}</Label>
          <ScrubText
            as="h2"
            className="t-statement text-charcoal [text-wrap:balance]"
            accent={["Feeling", "Good."]}
            accentClass="serif-accent text-terracotta"
          >
            {PHILOSOPHY.heading}
          </ScrubText>
        </div>
      </div>

      {/* Asymmetrical editorial spread */}
      <div data-bg="#fcfcfa" data-spread className="relative px-page pb-section pt-[clamp(3rem,6vw,6rem)]">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-6">
          <div className="relative md:col-span-6 lg:col-span-6">
            <ParallaxImage
              src={tea.src}
              alt={tea.alt}
              reveal="up"
              speed={14}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/5] w-full rounded-[var(--radius-panel)]"
            />
            <p className="t-mono mt-4 text-charcoal/50">Fig. 01 — Room to stretch, room to breathe</p>
          </div>

          <div data-copy className="relative flex flex-col md:col-span-5 md:col-start-8 md:pt-[12vh]">
            <p data-rise className="t-lead max-w-[32rem] text-[clamp(1.15rem,1.55vw,1.5rem)] leading-[1.45] text-charcoal/85">
              {PHILOSOPHY.description}
            </p>

            <ul className="mt-12 max-w-[32rem]">
              {PHILOSOPHY.pillars.map((p, i) => (
                <li key={p} data-rise className="relative flex items-baseline justify-between py-4">
                  <span data-rule className="absolute inset-x-0 top-0 h-px bg-charcoal/15" />
                  <span className="font-[family-name:var(--font-serif)] text-[clamp(1.7rem,2.6vw,2.4rem)] italic leading-none">{p}</span>
                  <span className="t-mono text-charcoal/45">0{i + 1}</span>
                </li>
              ))}
            </ul>

            {/* Organic medallion image */}
            <div data-blob className="relative mt-16 w-[68%] self-end md:mt-24 md:w-[78%]">
              <OrganicShape className="absolute -left-[18%] -top-[16%] w-[70%] text-peach" />
              <div className="relative aspect-[5/6] overflow-hidden [animation:morph_14s_ease-in-out_infinite] motion-reduce:[animation:none] rounded-[46%_54%_58%_42%/52%_42%_58%_48%]">
                <Image src={light.src} alt={light.alt} fill sizes="(min-width: 768px) 30vw, 60vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

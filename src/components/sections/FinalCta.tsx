"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { FINAL_CTA } from "@/data/content";
import { img } from "@/lib/images";
import PillButton from "@/components/ui/PillButton";
import RevealText from "@/components/ui/RevealText";
import Label from "@/components/ui/Label";

/**
 * Section 08 — Final CTA.
 * Bookends the hero: a small organic medallion of warm light blooms
 * outward until it fills the screen, then the closing line writes
 * itself in. Followed by the reference's "Continue exploring" cards.
 */
export default function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const bg = img("cta");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, mobile: "(max-width: 767px)" }, (ctx) => {
        const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
        if (!motion) return;

        const mask = q("[data-mask]")[0];
        const photo = q("[data-photo]")[0];
        const headline = q("[data-headline]")[0];
        const after = q("[data-after]");
        const split = SplitText.create(headline, { type: "lines,words", mask: "lines", linesClass: "split-line" });

        gsap.set(after, { autoAlpha: 0, y: 30 });
        gsap.set(split.words, { yPercent: 120 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.6}`,
            pin: q("[data-pin]")[0],
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(
          mask,
          {
            clipPath: mobile
              ? "inset(30% 18% 30% 18% round 48% 52% 50% 50% / 52% 48% 52% 48%)"
              : "inset(28% 37% 28% 37% round 48% 52% 50% 50% / 52% 48% 52% 48%)",
          },
          { clipPath: "inset(0% 0% 0% 0% round 0% 0% 0% 0% / 0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" },
        )
          .fromTo(photo, { scale: 1.35, rotate: -3 }, { scale: 1, rotate: 0, duration: 1.1, ease: "power2.out" }, 0)
          .to(split.words, { yPercent: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }, 0.75)
          .to(after, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.1, ease: "power2.out" }, 1.05)
          .to({}, { duration: 0.3 });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="discover" aria-labelledby="cta-title" className="relative">
      <div data-bg="#fcfcfa">
        <div data-pin className="relative h-svh w-full overflow-hidden">
          <div data-mask className="absolute inset-0 overflow-hidden will-change-[clip-path]">
            <div data-photo className="absolute inset-0 will-change-transform">
              <Image src={bg.src} alt={bg.alt} fill loading="eager" sizes="100vw" className="object-cover" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_55%,rgba(12,24,20,0.15),rgba(12,24,20,0.5))]" />
          </div>

          <div className="relative flex h-full flex-col items-center justify-center px-page text-center text-soft-white">
            <div data-after>
              <Label tone="light" className="mb-8">An invitation</Label>
            </div>
            <h2 id="cta-title" data-headline className="t-display max-w-[12ch] [text-wrap:balance]">
              Make Space for a <em className="serif-accent">Better You.</em>
            </h2>
            <p data-after className="t-lead mt-8 max-w-[30rem] text-soft-white/85">
              {FINAL_CTA.description}
            </p>
            <div data-after className="mt-10">
              <PillButton href="#approach" variant="light" size="lg" magnetic>
                {FINAL_CTA.cta}
              </PillButton>
            </div>
          </div>
        </div>
      </div>

      {/* Continue exploring */}
      <div data-bg="#fcfcfa" className="px-page pb-[clamp(5rem,9vw,8rem)] pt-[clamp(5rem,10vw,9rem)]">
        <div className="mx-auto max-w-[90rem]">
          <RevealText as="h2" className="t-h1">Continue exploring</RevealText>
          <ul className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3">
            {FINAL_CTA.explore.map((e) => {
              const photo = img(e.image);
              return (
                <li key={e.title}>
                  <a href={e.href} className="group relative block aspect-[4/5] overflow-hidden rounded-[18px] md:aspect-[5/6]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1c17]/70 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-5 p-6 text-soft-white md:p-7">
                      <h3 className="t-h3 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">{e.title}</h3>
                      <span className="inline-flex h-9 items-center gap-2 rounded-full bg-soft-white/15 px-4 text-[0.82rem] backdrop-blur-md transition-colors duration-300 group-hover:bg-soft-white group-hover:text-charcoal">
                        Learn more
                        <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden><path d="M5 2.5 10.5 8 5 13.5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

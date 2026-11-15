"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { FOOTER } from "@/data/content";
import { img } from "@/lib/images";
import Logo from "@/components/ui/Logo";
import Aurora from "@/components/ui/Aurora";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
    </svg>
  ),
  Pinterest: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.79-.17-2 .03-2.86l1.2-5.1s-.3-.61-.3-1.52c0-1.42.82-2.48 1.85-2.48.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.02.51 1.85 1.51 1.85 1.81 0 3.21-1.91 3.21-4.67 0-2.44-1.75-4.15-4.26-4.15-2.9 0-4.6 2.18-4.6 4.42 0 .88.34 1.82.76 2.33a.3.3 0 0 1 .07.29l-.28 1.15c-.05.18-.15.22-.34.13-1.27-.59-2.06-2.45-2.06-3.94 0-3.21 2.33-6.16 6.72-6.16 3.53 0 6.27 2.51 6.27 5.87 0 3.5-2.21 6.32-5.27 6.32-1.03 0-2-.53-2.33-1.17l-.63 2.42c-.23.88-.85 1.99-1.27 2.66A10 10 0 1 0 12 2Z" />
    </svg>
  ),
};

/**
 * Section 09 — Footer.
 * Giant wordmark that rises letter-block by letter-block, mono column
 * heads (reference pattern), and a warm horizon photograph fading in
 * beneath the legal row.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const horizon = img("footer");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(q("[data-wordmark]"), {
          yPercent: 60,
          autoAlpha: 0,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
        gsap.from(q("[data-col]"), {
          y: 30,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-cols]")[0], start: "top 90%", once: true },
        });
        gsap.fromTo(
          q("[data-horizon]"),
          { yPercent: -18, scale: 1.15 },
          {
            yPercent: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-horizon-wrap]")[0], start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden bg-sage-deep text-soft-white" aria-label="Site footer">
      <Aurora tone="dark" />
      <div className="relative px-page pt-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[90rem]">
          {/* Wordmark */}
          <div className="overflow-hidden">
            <div data-wordmark>
              <Logo className="text-[clamp(5rem,24.5vw,25rem)] tracking-[-0.06em]" />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-12 border-t border-white/12 pt-10 md:mt-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[clamp(1.8rem,2.6vw,2.5rem)] leading-[1.05] tracking-[-0.03em]">Wellness, <em className="serif-accent text-peach">Reimagined.</em></p>
              <p className="mt-5 max-w-[24rem] text-[0.95rem] leading-relaxed text-soft-white/65">{FOOTER.description}</p>
              <form
                className="mt-8 flex max-w-[24rem] items-center rounded-full border border-white/20 p-1 pl-5 transition-colors focus-within:border-peach"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="newsletter" className="sr-only">Email address</label>
                <input
                  id="newsletter"
                  type="email"
                  required
                  placeholder="Your email for slow letters"
                  className="min-w-0 flex-1 bg-transparent text-[0.92rem] text-soft-white placeholder:text-soft-white/40 focus:outline-none"
                />
                <button type="submit" className="h-10 rounded-full bg-soft-white px-5 text-[0.85rem] text-charcoal transition-colors hover:bg-peach">
                  Subscribe
                </button>
              </form>
            </div>

            <nav data-cols aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
              {FOOTER.columns.map((col) => (
                <div key={col.title} data-col>
                  <p className="t-mono mb-5 flex items-center gap-2 text-soft-white/50">
                    <svg width="6" height="6" viewBox="0 0 8 8" aria-hidden><path d="M4 0 8 4 4 8 0 4Z" fill="currentColor" /></svg>
                    {col.title}
                  </p>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href} className="group relative inline-block text-[0.98rem] text-soft-white/85 transition-colors hover:text-soft-white">
                          {l.label}
                          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-peach transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div data-col>
                <p className="t-mono mb-5 flex items-center gap-2 text-soft-white/50">
                  <svg width="6" height="6" viewBox="0 0 8 8" aria-hidden><path d="M4 0 8 4 4 8 0 4Z" fill="currentColor" /></svg>
                  Connect
                </p>
                <ul className="flex flex-wrap gap-2">
                  {FOOTER.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        aria-label={s.label}
                        className="grid grid-cols-1 size-10 place-items-center rounded-full border border-white/20 text-soft-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-peach hover:bg-peach hover:text-charcoal"
                      >
                        {SOCIAL_ICONS[s.label]}
                      </a>
                    </li>
                  ))}
                </ul>
                <a href="mailto:hello@welora.com" className="mt-6 block text-[0.95rem] text-soft-white/85 underline-offset-4 hover:underline">
                  hello@welora.com
                </a>
              </div>
            </nav>
          </div>

          <div className="mt-16 flex flex-col gap-6 border-t border-white/12 py-7 text-[0.82rem] text-soft-white/55 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} WELORA. All rights reserved.</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-colors hover:text-soft-white">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Warm horizon */}
      <div data-horizon-wrap className="relative h-[clamp(12rem,26vw,24rem)] overflow-hidden" aria-hidden>
        <div data-horizon className="absolute inset-0">
          <Image src={horizon.src} alt="" fill sizes="100vw" className="object-cover object-[50%_60%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-sage-deep via-sage-deep/30 to-transparent" />
      </div>
    </footer>
  );
}

"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Scroll-based background colour transitions.
 * Any element with `data-bg="#hex"` paints the page background while it
 * occupies the middle of the viewport — the same seamless colour washes
 * the reference uses between chapters.
 */
export default function BackgroundController() {
  useGSAP(() => {
    const body = document.body;
    const sections = gsap.utils.toArray<HTMLElement>("[data-bg]");
    const initial = sections[0]?.dataset.bg ?? "#e3eee6";
    gsap.set(body, { backgroundColor: initial });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    sections.forEach((section) => {
      const color = section.dataset.bg!;
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          gsap.to(body, {
            backgroundColor: color,
            duration: reduce ? 0 : 0.9,
            ease: "power2.out",
            overwrite: "auto",
          });
          document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", color);
        },
      });
    });
  });

  return null;
}

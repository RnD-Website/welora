"use client";

import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  /** words rise from line masks (default) · chars cascade · lines slide */
  mode?: "words" | "chars" | "lines";
  delay?: number;
  stagger?: number;
  start?: string;
  /** play immediately on mount instead of on scroll */
  immediate?: boolean;
  id?: string;
};

/**
 * Masked, staggered typography reveal built on GSAP SplitText.
 * Re-splits automatically on resize/font load so line breaks stay correct.
 */
export default function RevealText({
  as: Tag = "h2",
  children,
  className,
  mode = "words",
  delay = 0,
  stagger,
  start = "top 86%",
  immediate = false,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create(el, {
          type: mode === "chars" ? "lines,words,chars" : "lines,words",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            const targets = mode === "chars" ? self.chars : mode === "lines" ? self.lines : self.words;
            return gsap.from(targets, {
              yPercent: mode === "lines" ? 100 : 115,
              rotate: mode === "chars" ? 0 : 2.5,
              opacity: mode === "chars" ? 0 : 1,
              transformOrigin: "0% 100%",
              duration: mode === "chars" ? 1 : 1.35,
              ease: "expo.out",
              delay,
              stagger: stagger ?? (mode === "chars" ? 0.022 : mode === "lines" ? 0.12 : 0.055),
              scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

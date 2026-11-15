"use client";

import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

/**
 * Statement text that "inks in" word by word as you scroll — the
 * signature reading effect from the reference's manifesto line.
 * Words listed in `accent` settle into a softer brand tone.
 */
export default function ScrubText({
  as: Tag = "p",
  children,
  className,
  accent = [],
  accentClass = "text-terracotta",
  start = "top 82%",
  end = "bottom 42%",
}: {
  as?: ElementType;
  children: string;
  className?: string;
  accent?: string[];
  accentClass?: string;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            const accents = accent.map((a) => a.toLowerCase().replace(/[^\w-]/g, ""));
            self.words.forEach((w) => {
              const clean = (w.textContent ?? "").toLowerCase().replace(/[^\w-]/g, "");
              if (accents.includes(clean)) w.classList.add(...accentClass.split(" "));
            });
            return gsap.fromTo(
              self.words,
              { opacity: 0.14, filter: "blur(2px)" },
              {
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                stagger: 0.12,
                scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
              },
            );
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

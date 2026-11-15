"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Reveal = "none" | "up" | "down" | "left" | "right" | "circle" | "center";

const clipFrom: Record<Exclude<Reveal, "none">, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  circle: "circle(0% at 50% 60%)",
  center: "inset(22% 22% 22% 22% round 999px)",
};
const clipTo: Record<Exclude<Reveal, "none">, string> = {
  up: "inset(0% 0% 0% 0%)",
  down: "inset(0% 0% 0% 0%)",
  left: "inset(0% 0% 0% 0%)",
  right: "inset(0% 0% 0% 0%)",
  circle: "circle(75% at 50% 50%)",
  center: "inset(0% 0% 0% 0% round 0px)",
};

/**
 * Editorial image with:
 *  · a clip-path mask reveal when it enters the viewport
 *  · a counter-scale "settle" on the photograph
 *  · continuous scroll parallax (speed = travel in %)
 */
export default function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  speed = 12,
  reveal = "up",
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  speed?: number;
  reveal?: Reveal;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        if (speed) {
          gsap.fromTo(
            inner.current,
            { yPercent: -speed / 2 },
            {
              yPercent: speed / 2,
              ease: "none",
              scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
        if (reveal !== "none") {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: wrap.current, start: "top 88%", once: true },
          });
          tl.fromTo(
            wrap.current,
            { clipPath: clipFrom[reveal] },
            { clipPath: clipTo[reveal], duration: 1.6, ease: "expo.inOut" },
          ).fromTo(
            inner.current!.querySelector("img"),
            { scale: 1.35 },
            { scale: 1, duration: 2, ease: "expo.out" },
            0.1,
          );
        }
      });
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={clsx("relative overflow-hidden", className)}>
      <div
        ref={inner}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `-${speed / 2 + 2}%`, bottom: `-${speed / 2 + 2}%` }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={clsx("object-cover", imgClassName)} />
      </div>
      {children}
    </div>
  );
}

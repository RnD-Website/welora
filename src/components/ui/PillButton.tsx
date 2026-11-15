"use client";

import clsx from "clsx";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: string;
  href?: string;
  onClick?: () => void;
  variant?: "dark" | "light" | "outline-light" | "outline-dark";
  size?: "sm" | "md" | "lg";
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
  ariaLabel?: string;
};

const variants = {
  dark: "bg-sage-deep text-soft-white hover:bg-terracotta shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
  light: "bg-soft-white text-charcoal hover:bg-peach shadow-[0_10px_30px_-12px_rgba(30,20,14,0.45)]",
  "outline-light": "border border-soft-white/45 text-soft-white hover:bg-soft-white hover:text-charcoal",
  "outline-dark": "border border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-soft-white",
};

const sizes = {
  sm: "h-9 px-4 text-[0.82rem]",
  md: "h-11 px-6 text-[0.92rem]",
  lg: "h-14 px-8 text-base md:h-16 md:px-10 md:text-lg",
};

/**
 * Pill CTA with the reference's "text roll" hover — the label slides up
 * and an identical copy rolls in — plus an optional magnetic pull.
 */
export default function PillButton({
  children,
  href,
  onClick,
  variant = "dark",
  size = "md",
  arrow = true,
  magnetic = false,
  className,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (!magnetic || !ref.current || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.28;
    const y = (e.clientY - r.top - r.height / 2) * 0.38;
    gsap.to(ref.current, { x, y, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = () => {
    if (!magnetic || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
  };

  const inner = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {arrow && (
        <svg
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 16 16"
          className="shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
        >
          <path d="M5 2.5 10.5 8 5 13.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
    </>
  );

  const cls = clsx(
    "group inline-flex items-center justify-center gap-2.5 rounded-full font-normal tracking-[-0.01em] transition-colors duration-300 ease-[var(--ease-soft)] will-change-transform",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <a ref={ref} href={href} className={cls} onPointerMove={onMove} onPointerLeave={onLeave} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" onClick={onClick} className={cls} onPointerMove={onMove} onPointerLeave={onLeave} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

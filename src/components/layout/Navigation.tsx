"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import clsx from "clsx";
import { NAV_LINKS } from "@/data/content";
import { useLenis } from "./SmoothScroll";
import Logo from "@/components/ui/Logo";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Floating pill navigation (reference pattern):
 *  · transparent glass over the hero, settles into a solid charcoal pill on scroll
 *  · tucks away while scrolling down, returns on scroll up
 *  · expands in-place into a full menu panel (Framer Motion layout animation)
 */
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const lenis = useLenis();
  const panelId = useId();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 60);
      const goingDown = y > lastY.current + 4;
      const goingUp = y < lastY.current - 4;
      if (goingDown && y > window.innerHeight * 0.9) setHidden(true);
      else if (goingUp || y < 80) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const go = (href: string) => {
    setOpen(false);
    const target = href === "#top" ? 0 : href;
    requestAnimationFrame(() => {
      if (lenis) lenis.scrollTo(target as string | number, { duration: 1.6 });
      else if (typeof target === "number") window.scrollTo({ top: 0 });
      else document.querySelector(target)?.scrollIntoView();
    });
  };

  const dark = solid || open;

  return (
    <MotionConfig reducedMotion="user">
      {/* Dimmed backdrop while the menu is open */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-sage-deep/35 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <header
        className={clsx(
          "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-transform duration-700 ease-[var(--ease-out-expo)] md:pt-4",
          hidden && !open && "-translate-y-[130%]",
        )}
      >
        <motion.nav
          layout
          aria-label="Main navigation"
          transition={{ layout: { duration: 0.75, ease } }}
          style={{ borderRadius: 28 }}
          className={clsx(
            "pointer-events-auto relative w-full overflow-hidden border transition-[background-color,border-color,color,box-shadow] duration-500",
            open ? "max-w-[46rem]" : "max-w-[36rem]",
            dark
              ? "border-white/[0.06] bg-sage-deep/90 text-soft-white shadow-[0_18px_50px_-20px_rgba(36,36,33,0.55)] backdrop-blur-xl"
              : "border-white/30 bg-white/10 text-soft-white backdrop-blur-md",
          )}
        >
          <motion.div layout="position" className="flex h-14 items-center justify-between pl-6 pr-2 md:h-[3.75rem]">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                go("#top");
              }}
              aria-label="WELORA — home"
              className="group flex items-center"
            >
              <Logo className="text-[1.42rem] transition-opacity duration-300 group-hover:opacity-75" />
            </a>

            <div className="flex items-center gap-1.5">
              <a
                href="#approach"
                onClick={(e) => {
                  e.preventDefault();
                  go("#approach");
                }}
                className={clsx(
                  "group hidden h-10 items-center gap-2 rounded-full px-4 text-[0.85rem] transition-colors duration-300 sm:flex",
                  dark ? "bg-soft-white text-charcoal hover:bg-peach" : "bg-soft-white/90 text-charcoal hover:bg-soft-white",
                )}
              >
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
                    Explore WELORA
                  </span>
                  <span aria-hidden className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
                    Explore WELORA
                  </span>
                </span>
              </a>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={open ? "Close navigation" : "Open navigation"}
                className={clsx(
                  "relative grid size-10 place-items-center rounded-full transition-colors duration-300",
                  dark ? "hover:bg-white/10" : "hover:bg-white/15",
                )}
              >
                <span className="relative block h-3 w-[1.15rem]">
                  <span
                    className={clsx(
                      "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-500 ease-[var(--ease-out-expo)]",
                      open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[2px]",
                    )}
                  />
                  <span
                    className={clsx(
                      "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-500 ease-[var(--ease-out-expo)]",
                      open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[2px]",
                    )}
                  />
                </span>
              </button>
            </div>
          </motion.div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                key="panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.7, ease }}
              >
                <div className="grid grid-cols-1 gap-10 px-6 pb-7 pt-4 md:grid-cols-[1.4fr_1fr] md:px-8 md:pb-9">
                  <ul className="space-y-1">
                    {NAV_LINKS.map((l, i) => (
                      <motion.li
                        key={l.label}
                        initial={{ opacity: 0, y: 26 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.8, ease, delay: 0.08 + i * 0.05 }}
                      >
                        <a
                          href={l.href}
                          onClick={(e) => {
                            e.preventDefault();
                            go(l.href);
                          }}
                          className="group flex items-baseline gap-4 py-1"
                        >
                          <span className="t-mono w-6 text-soft-white/40">0{i + 1}</span>
                          <span className="text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.05] tracking-[-0.03em] transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:text-peach">
                            {l.label}
                          </span>
                          <svg
                            aria-hidden
                            width="18"
                            height="18"
                            viewBox="0 0 16 16"
                            className="-translate-x-2 self-center text-peach opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100"
                          >
                            <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </a>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    className="flex flex-col justify-between gap-8 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div>
                      <p className="t-mono mb-3 text-soft-white/45">Wellness, Reimagined.</p>
                      <p className="max-w-[18rem] text-[0.95rem] leading-relaxed text-soft-white/75">
                        A more thoughtful approach to living well, feeling better and creating lasting balance.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="t-mono text-soft-white/45">Say hello</p>
                      <a href="mailto:hello@welora.com" className="block text-[0.95rem] text-soft-white/85 underline-offset-4 hover:underline">
                        hello@welora.com
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </MotionConfig>
  );
}

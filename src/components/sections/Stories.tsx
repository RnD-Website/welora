"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { STORIES } from "@/data/content";
import { img, VIDEO } from "@/lib/images";
import Label from "@/components/ui/Label";
import RevealText from "@/components/ui/RevealText";
import PillButton from "@/components/ui/PillButton";
import { useLenis } from "@/components/layout/SmoothScroll";

/**
 * Section 07 — Human Stories.
 * A deep-sage rounded panel over a slow cinematic film (reference:
 * "We all have a why"), with a film index on the right, and a draggable
 * editorial carousel beneath. Editorial pieces only — no testimonials,
 * no outcome claims.
 */
export default function Stories() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Panel grows into place, corners softening as it settles
        gsap.fromTo(
          q("[data-panel]"),
          { scale: 0.9, borderRadius: "48px" },
          {
            scale: 1,
            borderRadius: "28px",
            ease: "none",
            scrollTrigger: { trigger: q("[data-panel]")[0], start: "top bottom", end: "top 25%", scrub: 0.8 },
          },
        );
        gsap.fromTo(
          q("[data-film]"),
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: q("[data-panel]")[0], start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.from(q("[data-film-row]"), {
          x: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: q("[data-film-list]")[0], start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stories" data-bg="#fcfcfa" aria-labelledby="stories-title" className="relative px-[clamp(0.6rem,1.4vw,1.25rem)] pb-[clamp(4rem,8vw,7rem)]">
      <div data-panel className="relative overflow-hidden rounded-[28px] bg-sage-deep text-soft-white will-change-transform">
        {/* Cinematic background film */}
        <div data-film className="absolute -inset-y-[12%] inset-x-0">
          <video
            className="h-full w-full object-cover opacity-70 motion-reduce:hidden"
            src={VIDEO.stories.src}
            poster={VIDEO.stories.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
          <Image src={VIDEO.stories.poster} alt="" fill sizes="100vw" className="hidden object-cover opacity-70 motion-reduce:block" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,43,36,0.45)_0%,rgba(15,43,36,0.8)_55%,rgba(11,34,28,0.97)_100%)] backdrop-blur-[2px]" />

        <div className="relative px-[clamp(1.25rem,3vw,3rem)] pb-[clamp(2.5rem,4vw,4rem)] pt-[clamp(3.5rem,7vw,7rem)]">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Label tone="light">{STORIES.label}</Label>
              <RevealText as="h2" id="stories-title" className="t-h1 mt-8 max-w-[11ch]">
                Every Journey Begins <em className="serif-accent text-peach">Somewhere.</em>
              </RevealText>
              <p className="t-lead mt-8 max-w-[26rem] text-soft-white/80">{STORIES.description}</p>
              <a href="#stories-carousel" className="t-mono group mt-10 inline-flex items-center gap-3 text-soft-white/90">
                <span className="h-px w-10 bg-soft-white/50 transition-all duration-500 group-hover:w-16 group-hover:bg-soft-white" />
                Explore all stories
              </a>
            </div>

            <ol data-film-list className="space-y-3 lg:col-span-6 lg:col-start-7 lg:pt-4">
              {STORIES.films.map((f, i) => (
                <li key={f.title} data-film-row>
                  <button
                    type="button"
                    onClick={() => setPlaying(i)}
                    className="group flex w-full items-center gap-4 rounded-full py-2 pl-2 pr-5 text-left transition-colors duration-500 hover:bg-white/8"
                    aria-label={`Play film: ${f.title}`}
                  >
                    <span className="flex h-12 shrink-0 items-center gap-2.5 rounded-full border border-white/25 bg-white/8 pl-1.5 pr-4 backdrop-blur-md transition-colors duration-500 group-hover:border-peach group-hover:bg-peach group-hover:text-charcoal">
                      <span className="grid grid-cols-1 size-9 place-items-center rounded-full bg-soft-white/15 group-hover:bg-charcoal/10">
                        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                          <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="font-mono text-[0.78rem] tracking-wider">{f.duration}</span>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[clamp(1rem,1.3vw,1.2rem)] text-soft-white/90">{f.title}</span>
                    <span className="t-mono hidden text-soft-white/55 transition-colors group-hover:text-soft-white sm:inline">Watch ›</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <StoryCarousel />
        </div>
      </div>

      <FilmModal index={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

/* ------------------------------------------------------------ */

function StoryCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current || !viewport.current) return;
      const overflow = track.current.scrollWidth - viewport.current.clientWidth;
      setBounds({ left: -Math.max(0, overflow), right: 0 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, []);

  const step = (dir: 1 | -1) => {
    const card = track.current?.querySelector<HTMLElement>("[data-card]");
    if (!card) return;
    const w = card.offsetWidth + 16;
    const next = Math.min(bounds.right, Math.max(bounds.left, x.get() - dir * w));
    animate(x, next, { type: "spring", stiffness: 140, damping: 24 });
    setIndex(Math.round(-next / w));
  };

  return (
    <div id="stories-carousel" className="mt-[clamp(4rem,8vw,7rem)]">
      <div className="mb-6 flex items-end justify-between gap-6 border-t border-white/15 pt-6">
        <p className="t-mono text-soft-white/60">Journal — {String(index + 1).padStart(2, "0")} / {String(STORIES.cards.length).padStart(2, "0")}</p>
        <div className="flex gap-2">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => step(d as 1 | -1)}
              aria-label={d === -1 ? "Previous stories" : "Next stories"}
              className="grid grid-cols-1 size-11 place-items-center rounded-full border border-white/25 transition-colors duration-300 hover:bg-soft-white hover:text-charcoal"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden className={d === -1 ? "rotate-180" : ""}>
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div ref={viewport} className="-mx-1 overflow-hidden px-1" data-lenis-prevent-touch>
        <motion.div
          ref={track}
          drag="x"
          dragConstraints={bounds}
          dragElastic={0.08}
          style={{ x }}
          className="flex cursor-grab gap-4 active:cursor-grabbing"
          onDragEnd={() => {
            const card = track.current?.querySelector<HTMLElement>("[data-card]");
            if (card) setIndex(Math.round(-x.get() / (card.offsetWidth + 16)));
          }}
        >
          {STORIES.cards.map((c) => {
            const photo = img(c.image);
            return (
              <article
                key={c.title}
                data-card
                className="group relative w-[78vw] shrink-0 select-none sm:w-[44vw] lg:w-[calc((100%-3rem)/3.4)]"
              >
                <a href="#stories" draggable={false} className="block" onClick={(e) => e.preventDefault()}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      loading="eager"
                      draggable={false}
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 78vw"
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
                    <span className="t-mono absolute left-4 top-4 rounded-full bg-soft-white/90 px-3 py-1.5 text-charcoal">{c.kind}</span>
                    {c.kind === "Film" && (
                      <span className="absolute right-4 top-4 grid grid-cols-1 size-10 place-items-center rounded-full bg-soft-white/20 backdrop-blur-md">
                        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <h3 className="text-[clamp(1.2rem,1.6vw,1.55rem)] leading-[1.15] tracking-[-0.02em]">
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
                        {c.title}
                      </span>
                    </h3>
                  </div>
                  <p className="t-mono mt-3 text-soft-white/55">{c.read}</p>
                </a>
              </article>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-12 flex justify-center">
        <PillButton href="#stories" variant="outline-light">View all stories</PillButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */

function FilmModal({ index, onClose }: { index: number | null; onClose: () => void }) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (index === null) return;
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [index, lenis, onClose]);

  const film = index !== null ? STORIES.films[index] : null;

  return (
    <AnimatePresence>
      {film && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={film.title}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-[22px] bg-charcoal"
            initial={{ scale: 0.92, y: 30, clipPath: "inset(20% 20% 20% 20% round 40px)" }}
            animate={{ scale: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 22px)" }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video src={VIDEO.stories.src} poster={VIDEO.stories.poster} className="aspect-video w-full object-cover" autoPlay controls playsInline />
            <div className="flex items-center justify-between gap-4 p-5 text-soft-white">
              <div>
                <p className="t-mono text-soft-white/55">WELORA Films · {film.duration}</p>
                <p className="mt-1 text-lg">{film.title}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid grid-cols-1 size-11 place-items-center rounded-full border border-white/25 hover:bg-soft-white hover:text-charcoal"
                aria-label="Close film"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

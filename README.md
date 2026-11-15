# WELORA — Wellness, Reimagined.

A premium, cinematic, editorial wellness homepage built with **Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger + SplitText · Lenis · Framer Motion**.

Design and motion language benchmarked against compasspathways.com. The page has the same structure and interaction patterns, with WELORA's own copy, palette, imagery and brand marks.

---

## Quick start

```bash
npm install      # also downloads the photography + renders the stories film
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

### Assets

`npm install` runs `scripts/fetch-assets.mjs`, which:

1. downloads the 27 curated editorial photographs (Unsplash License: free for commercial use) into `public/images/`
2. renders the slow, cinematic stories film `public/videos/stories.mp4` with ffmpeg (bundled through `ffmpeg-static`)

The repo ships with soft brand-toned **placeholders**, so the site renders even before the assets download. Placeholders are tracked in `public/images/.placeholders.json`.

```bash
npm run assets         # fetch anything that is still a placeholder
npm run assets:force   # re-download everything
```

To swap a photo, replace the file in `public/images/` (keep the name), or change its Unsplash `id` in `src/data/assets.json` and run `npm run assets:force`.

---

## Project structure

```
src/
  app/
    layout.tsx           fonts (self-hosted), metadata, smooth-scroll shell
    page.tsx             section order
    globals.css          design tokens, fluid type scale, keyframes
    icon.svg             favicon
  components/
    layout/
      SmoothScroll.tsx         Lenis ↔ GSAP ticker bridge (+ context)
      BackgroundController.tsx scroll-driven page colour washes (data-bg)
      Navigation.tsx           floating pill → expanding menu panel
      Footer.tsx               giant wordmark, columns, horizon image
    sections/
      Hero.tsx                 02 pinned frame → blob → medallion
      Philosophy.tsx           03 word-scrub manifesto + asymmetric spread
      Approach.tsx             04 contour field + 4 depth-staggered cards
      Experience.tsx           05 pinned dash field → ring (canvas)
      ExperienceCollage.tsx    05 layered parallax + cursor image reveal
      MindBody.tsx             06 scrubbed mask features + gliding words
      Stories.tsx              07 film panel, film index, carousel, modal
      FinalCta.tsx             08 medallion bloom → full bleed + explore
    ui/
      RevealText.tsx           SplitText masked word/char/line reveals
      ScrubText.tsx            scroll-scrubbed word "inking"
      ParallaxImage.tsx        clip-path reveal + settle + parallax
      ContourBackground.tsx    procedural topographic lines
      PillButton.tsx           text-roll hover, optional magnetic pull
      Label.tsx · Logo.tsx · OrganicShape.tsx
  data/
    content.ts           ALL site copy (edit here)
    assets.json          image manifest (file, Unsplash id, alt text)
  fonts/                 Inter Tight (variable) + JetBrains Mono, self-hosted
  lib/
    gsap.ts              plugin registration + shared eases / media queries
    images.ts            typed image helper
scripts/fetch-assets.mjs
public/images · public/videos
```

## Motion map

| # | Section | Signature motion |
|---|---------|------------------|
| 01 | Navigation | Glass pill over the hero turns solid on scroll, hides on scroll down and returns on scroll up; the menu expands in place (Framer layout) |
| 02 | Hero | Photo resolves from blur and characters rise from masks. Pinned: full bleed → organic blob → circle while the headline converges and the page washes to sage |
| 03 | Philosophy | Statement inks in word by word; the background washes to soft white; image clip reveals; morphing blob medallion |
| 04 | Approach | Drifting contour field; staggered headline; cards rise from staggered depths (scrubbed) |
| 05 | Experience | Pinned canvas: drifting dashes gather into a ring with Mind/Body/Rest/Connection points; layered parallax collage; cursor-follow image reveal |
| 06 | Mind & Body | Scrubbed capsule/medallion masks open into frames; giant words glide; counter-scaled photos |
| 07 | Stories | Panel scales in with softening corners; parallax film; film list stagger; draggable carousel; film modal |
| 08 | Final CTA | Medallion blooms to full bleed; headline words rise; magnetic CTA |
| 09 | Footer | Wordmark rises; columns stagger; horizon parallax |

## Accessibility and performance

- Semantic landmarks, skip link, focus-visible rings, labelled controls, Esc closes the menu and modal
- `prefers-reduced-motion`: Lenis off, no pins or scrubs, every section renders in its final, readable state
- All GSAP work runs in `useGSAP` + `gsap.matchMedia()` for automatic cleanup and responsive re-setup
- `next/image` (AVIF/WebP, responsive `sizes`, priority hero); the canvas renders only while on screen
- Fonts self-hosted through `next/font/local`; no third-party requests at runtime

## Content note

The stories section presents editorial pieces (essays, films, guides). It contains no customer testimonials and claims no health outcomes.

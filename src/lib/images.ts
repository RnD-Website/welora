import manifest from "@/data/assets.json";

type ImageKey =
  | "hero"
  | "hero-portrait"
  | "philosophy-tea"
  | "philosophy-light"
  | "approach-mindful"
  | "approach-mental"
  | "approach-physical"
  | "approach-inner"
  | "experience-shadow"
  | "experience-ocean"
  | "experience-walk"
  | "experience-journal"
  | "experience-sleep"
  | "mind"
  | "body"
  | "stories-film"
  | "story-1"
  | "story-2"
  | "story-3"
  | "story-4"
  | "story-5"
  | "story-6"
  | "cta"
  | "explore-1"
  | "explore-2"
  | "explore-3"
  | "footer";

const byFile = new Map(manifest.images.map((i) => [i.file, i]));

/** Typed access to every local photograph + its descriptive alt text. */
export function img(key: ImageKey) {
  const entry = byFile.get(`${key}.jpg`);
  return { src: `/images/${key}.jpg`, alt: entry?.alt ?? "" };
}

export const VIDEO = {
  stories: { src: "/videos/stories.mp4", poster: "/images/stories-film.jpg" },
};

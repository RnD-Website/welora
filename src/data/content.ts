/**
 * All WELORA copy lives here so editors can update the site
 * without touching component code.
 */

export const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Our Approach", href: "#approach" },
  { label: "Wellness", href: "#mind-body" },
  { label: "Our Stories", href: "#stories" },
  { label: "About Us", href: "#philosophy" },
] as const;

export const HERO = {
  lines: ["Find Your Balance.", "Discover Your", "Wellbeing."],
  supporting:
    "Wellbeing begins with understanding yourself. Discover a more thoughtful approach to living well, feeling better, and creating lasting balance.",
};

export const PHILOSOPHY = {
  label: "The WELORA Philosophy",
  heading: "Wellness Is More Than Just Feeling Good.",
  description:
    "True wellbeing is about finding harmony between mind, body, and everyday life. At WELORA, we believe that meaningful change begins with small moments of awareness, thoughtful choices, and a deeper understanding of yourself.",
  pillars: ["Mind", "Body", "Everyday life"],
};

export const APPROACH = {
  label: "A Different Perspective",
  heading: ["A More Thoughtful", "Way to Live Well."],
  intro:
    "Four simple principles guide everything we create — gentle foundations for a life that feels steadier, lighter and more like your own.",
  principles: [
    {
      n: "01",
      title: "Mindful Living",
      body: "Build awareness through everyday moments and intentional choices.",
      image: "approach-mindful",
      tone: "bg-sage-light",
    },
    {
      n: "02",
      title: "Mental Wellbeing",
      body: "Create space for emotional awareness and a healthier mindset.",
      image: "approach-mental",
      tone: "bg-peach-light",
    },
    {
      n: "03",
      title: "Physical Balance",
      body: "Encourage movement, rest, and sustainable healthy habits.",
      image: "approach-physical",
      tone: "bg-sand",
    },
    {
      n: "04",
      title: "Inner Connection",
      body: "Develop a deeper understanding of yourself and your needs.",
      image: "approach-inner",
      tone: "bg-sage-deep",
    },
  ],
} as const;

export const EXPERIENCE = {
  label: "Discover the Difference",
  heading: "Small Changes. A More Meaningful Life.",
  description:
    "Wellbeing is not a destination. It is an ongoing journey shaped by the choices we make, the moments we embrace, and the way we care for ourselves.",
  compass: ["Mind", "Body", "Rest", "Connection"],
  sideLinks: [
    { label: "Rituals for everyday life", href: "#mind-body" },
    { label: "Explore our approach", href: "#approach" },
  ],
  moments: [
    { title: "Morning light", meta: "Begin slowly", image: "experience-shadow" },
    { title: "Mindful movement", meta: "Feel your body", image: "experience-walk" },
    { title: "Quiet reflection", meta: "Write it down", image: "experience-journal" },
    { title: "Restful evenings", meta: "Let the day go", image: "experience-sleep" },
  ],
} as const;

export const MIND_BODY = {
  label: "Whole-Person Wellness",
  heading: "Where Mind and Body Find Their Balance.",
  features: [
    {
      key: "mind",
      word: "Mind",
      title: "Mindful Mind",
      body: "Explore emotional awareness, mindfulness, reflection, and mental wellbeing.",
      tags: ["Emotional awareness", "Mindfulness", "Reflection", "Mental wellbeing"],
      image: "mind",
    },
    {
      key: "body",
      word: "Body",
      title: "Healthy Body",
      body: "Discover the importance of movement, recovery, sleep, and everyday healthy habits.",
      tags: ["Movement", "Recovery", "Sleep", "Everyday habits"],
      image: "body",
    },
  ],
} as const;

/**
 * Editorial pieces (essays, films, guides) — not customer testimonials,
 * and no health outcomes are claimed.
 */
export const STORIES = {
  label: "Real Experiences",
  heading: "Every Journey Begins Somewhere.",
  description:
    "Wellbeing looks different for everyone. Explore stories, perspectives, and experiences that inspire a more mindful way of living.",
  films: [
    { title: "A slower start: notes on morning rituals", duration: "2:14" },
    { title: "Walking without a destination", duration: "1:48" },
    { title: "What the forest teaches about pausing", duration: "3:02" },
    { title: "Learning to rest without guilt", duration: "2:36" },
  ],
  cards: [
    { kind: "Essay", title: "The quiet power of a slow morning", read: "6 min read", image: "story-1" },
    { kind: "Perspective", title: "Rest is not a reward — it is a rhythm", read: "5 min read", image: "story-2" },
    { kind: "Film", title: "Walking as a way of thinking", read: "3 min watch", image: "story-3" },
    { kind: "Guide", title: "What the ocean can teach us about breath", read: "4 min read", image: "story-4" },
    { kind: "Essay", title: "Finding stillness in movement", read: "7 min read", image: "story-5" },
    { kind: "Perspective", title: "Small rituals for full weeks", read: "5 min read", image: "story-6" },
  ],
} as const;

export const FINAL_CTA = {
  heading: "Make Space for a Better You.",
  description:
    "Take a moment to reconnect with yourself and explore a more thoughtful approach to wellbeing.",
  cta: "Discover WELORA",
  explore: [
    { title: "Our Approach", image: "explore-1", href: "#approach" },
    { title: "Mind & Body", image: "explore-2", href: "#mind-body" },
    { title: "About WELORA", image: "explore-3", href: "#philosophy" },
  ],
} as const;

export const FOOTER = {
  tagline: "Wellness, Reimagined.",
  description:
    "WELORA is a modern wellness brand dedicated to improving mental wellbeing, encouraging healthier lifestyles, and helping people discover a more balanced relationship with themselves.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "#top" },
        { label: "Our Approach", href: "#approach" },
        { label: "Wellness", href: "#mind-body" },
        { label: "Our Stories", href: "#stories" },
      ],
    },
    {
      title: "Wellness Resources",
      links: [
        { label: "Mindful Living", href: "#approach" },
        { label: "Sleep & Recovery", href: "#mind-body" },
        { label: "Movement", href: "#mind-body" },
        { label: "Journal", href: "#stories" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About Us", href: "#philosophy" },
        { label: "Our Philosophy", href: "#philosophy" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "mailto:hello@welora.com" },
      ],
    },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Pinterest", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Cookie Settings", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
};

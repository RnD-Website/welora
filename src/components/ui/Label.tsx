import clsx from "clsx";

/** Small mono eyebrow label with a diamond glyph, as in the reference. */
export default function Label({
  children,
  className,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={clsx(
        "t-mono inline-flex items-center gap-2.5",
        tone === "dark" ? "text-charcoal/70" : "text-soft-white/75",
        className,
      )}
    >
      <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden className="shrink-0">
        <path d="M4 0 8 4 4 8 0 4Z" fill="currentColor" />
      </svg>
      {children}
    </p>
  );
}

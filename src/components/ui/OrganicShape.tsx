import clsx from "clsx";

const SHAPES = [
  "M421 92c58 49 79 141 57 222-22 82-88 152-170 172-81 20-178-11-230-74C26 349 18 255 52 178 86 101 162 42 245 32c83-10 118 11 176 60Z",
  "M396 70c62 42 104 120 92 194-12 75-78 147-158 182-81 35-176 32-235-15C36 384 13 293 33 214 53 135 118 68 196 46c78-21 138-18 200 24Z",
  "M437 129c42 66 37 159-6 228-43 70-125 116-209 113-84-3-170-55-199-130C-6 265 23 168 86 106 149 44 245 16 323 31c78 15 72 32 114 98Z",
];

/** Soft organic blob — decorative brand shape (tinted via text colour). */
export default function OrganicShape({
  className,
  variant = 0,
}: {
  className?: string;
  variant?: 0 | 1 | 2;
}) {
  return (
    <svg aria-hidden viewBox="0 0 500 500" className={clsx("pointer-events-none", className)} fill="currentColor">
      <path d={SHAPES[variant]} />
    </svg>
  );
}

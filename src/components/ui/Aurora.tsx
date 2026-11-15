import clsx from "clsx";

/**
 * Soft luminous colour fields that drift slowly behind content —
 * gives flat backgrounds a modern, light-filled depth.
 */
export default function Aurora({
  className,
  tone = "mint",
}: {
  className?: string;
  tone?: "mint" | "warm" | "dark";
}) {
  const palette = {
    mint: ["rgba(242,194,168,0.55)", "rgba(143,180,155,0.45)", "rgba(255,255,255,0.9)"],
    warm: ["rgba(242,194,168,0.5)", "rgba(227,238,230,0.9)", "rgba(255,255,255,0.8)"],
    dark: ["rgba(210,100,63,0.28)", "rgba(143,180,155,0.18)", "rgba(47,93,78,0.35)"],
  }[tone];

  return (
    <div aria-hidden className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute -left-[12%] top-[8%] h-[70vmax] w-[70vmax] rounded-full blur-[90px] [animation:aurora-a_22s_ease-in-out_infinite] motion-reduce:[animation:none]"
        style={{ background: `radial-gradient(circle, ${palette[0]} 0%, transparent 62%)` }}
      />
      <div
        className="absolute -right-[18%] -bottom-[20%] h-[75vmax] w-[75vmax] rounded-full blur-[100px] [animation:aurora-b_26s_ease-in-out_infinite] motion-reduce:[animation:none]"
        style={{ background: `radial-gradient(circle, ${palette[1]} 0%, transparent 62%)` }}
      />
      <div
        className="absolute left-[30%] top-[25%] h-[45vmax] w-[45vmax] rounded-full blur-[80px] [animation:aurora-a_30s_ease-in-out_infinite_reverse] motion-reduce:[animation:none]"
        style={{ background: `radial-gradient(circle, ${palette[2]} 0%, transparent 60%)` }}
      />
    </div>
  );
}

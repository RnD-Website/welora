import clsx from "clsx";

/**
 * WELORA wordmark — brand grotesk, lowercase, with an organic "o"
 * (a soft off-round ring echoing the brand's blob shapes).
 * Size it with font-size utilities, e.g. `text-[1.4rem]`.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <span
      className={clsx("inline-flex items-baseline font-medium leading-none tracking-[-0.045em]", className)}
      aria-label="WELORA"
      role="img"
    >
      <span aria-hidden>wel</span>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="mx-[0.02em] inline-block h-[0.6em] w-[0.62em] translate-y-[0.02em] self-baseline"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.6.3c5.4-.5 9.9 3 10.2 8.2.3 5.3-3.6 9.9-9 10.4C5.3 19.4.6 15.9.3 10.6 0 5.4 4.2.8 9.6.3Zm.5 3.6C6.6 4.1 4 6.8 4.2 10.2c.2 3.3 3 5.6 6.4 5.3 3.4-.3 5.9-3.1 5.7-6.4-.2-3.3-2.9-5.5-6.2-5.2Z"
        />
      </svg>
      <span aria-hidden>ra</span>
    </span>
  );
}

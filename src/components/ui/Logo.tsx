import { cn } from "@/lib/utils";

/**
 * JuniorLinks logo mark — a J-shaped golf flagstick with pennant.
 * The J motif doubles as a golf pin: vertical stick, right-curving hook
 * at the base (mimicking the J letterform), and a triangular pennant at top.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background tile */}
      <rect width="44" height="44" rx="11" fill="#15803d" />

      {/* Subtle top-right highlight circle for depth */}
      <circle cx="38" cy="6" r="14" fill="white" fillOpacity="0.06" />

      {/* J-shaped flagstick: vertical shaft curving right at the base */}
      <path
        d="M21 8 L21 27 Q21 36 30 36"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Pennant flag — right-pointing triangle off the top of the stick */}
      <path d="M21 8 L32 13 L21 18 Z" fill="white" />

      {/* Golf hole cup at the tip of the J hook */}
      <circle cx="30" cy="36" r="2.2" fill="white" fillOpacity="0.55" />
      <circle cx="30" cy="36" r="1" fill="white" />
    </svg>
  );
}

/** Full lockup: mark + wordmark */
export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const textSize =
    size === "sm"
      ? "text-base"
      : size === "lg"
      ? "text-2xl"
      : "text-lg";

  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <LogoMark className={iconSize} />
      <span className={cn("font-semibold tracking-tight leading-none", textSize)}>
        <span className="text-gray-700">Junior</span>
        <span className="text-green-700 font-extrabold">Links</span>
      </span>
    </span>
  );
}

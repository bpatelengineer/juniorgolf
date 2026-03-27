import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = { xs: "h-6 w-6 text-xs", sm: "h-8 w-8 text-sm", md: "h-10 w-10 text-base", lg: "h-14 w-14 text-lg" };
const pxSizes = { xs: 24, sm: 32, md: 40, lg: 56 };

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 font-semibold text-green-700", sizes[size], className)}>
      {src ? (
        <Image src={src} alt={name ?? "Avatar"} fill className="object-cover" sizes={`${pxSizes[size]}px`} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";

type Variant = "green" | "blue" | "yellow" | "red" | "gray" | "purple";

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  green: "bg-green-50 text-green-700 ring-1 ring-green-200/80",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
  yellow: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
  red: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
  gray: "bg-gray-50 text-gray-600 ring-1 ring-gray-200/80",
  purple: "bg-purple-50 text-purple-700 ring-1 ring-purple-200/80",
};

export function Badge({ variant = "gray", className, children }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight", variants[variant], className)}>
      {children}
    </span>
  );
}

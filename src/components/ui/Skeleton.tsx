import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Skeleton className="mb-3 h-40 w-full rounded-lg" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

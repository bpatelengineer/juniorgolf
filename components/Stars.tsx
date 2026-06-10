export default function Stars({
  rating,
  count,
}: {
  rating: number | null;
  count?: number;
}) {
  if (rating === null) {
    return <span className="text-xs text-stone-400">No reviews yet</span>;
  }
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="text-amber-500" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
        {"★".repeat(rounded)}
        <span className="text-stone-300">{"★".repeat(5 - rounded)}</span>
      </span>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-stone-500">({count})</span>
      )}
    </span>
  );
}

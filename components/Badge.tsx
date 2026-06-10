const STYLES: Record<string, string> = {
  green: "bg-green-100 text-green-900",
  amber: "bg-amber-100 text-amber-900",
  stone: "bg-stone-100 text-stone-700",
  blue: "bg-sky-100 text-sky-900",
};

export default function Badge({
  children,
  color = "stone",
}: {
  children: React.ReactNode;
  color?: keyof typeof STYLES;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[color]}`}
    >
      {children}
    </span>
  );
}

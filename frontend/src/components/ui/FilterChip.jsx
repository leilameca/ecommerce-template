export default function FilterChip({
  isActive = false,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={[
        "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-zinc-950 text-white shadow-[0_16px_40px_rgba(24,24,27,0.16)] hover:text-white [&_*]:text-inherit"
          : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const variantClassName = {
    primary:
      "border border-[var(--color-primary,#111)] bg-[var(--color-primary,#111)] text-white hover:opacity-90 [&_*]:text-inherit",
    secondary:
      "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
    ghost: "border border-transparent bg-transparent text-zinc-600 hover:text-zinc-950",
    danger:
      "border border-rose-300 bg-white text-rose-700 hover:bg-rose-50",
  }[variant];

  const sizeClassName = {
    sm: "min-h-10 px-4 py-2 text-sm",
    md: "min-h-11 px-4 py-2.5 text-sm",
    lg: "min-h-12 px-5 py-3 text-sm",
  }[size];

  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-md text-center leading-5 font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variantClassName,
        sizeClassName,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

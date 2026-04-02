export default function SelectField({
  label,
  children,
  className = "",
  selectClassName = "",
  ...props
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`.trim()}>
      {label ? (
        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
          {label}
        </span>
      ) : null}

      <select
        className={[
          "h-11 rounded-md border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 outline-none transition-colors duration-200 focus:border-zinc-950",
          selectClassName,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

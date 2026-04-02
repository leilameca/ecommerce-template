export default function TextareaField({
  label,
  className = "",
  textareaClassName = "",
  rows = 4,
  ...props
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`.trim()}>
      {label ? (
        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
          {label}
        </span>
      ) : null}

      <textarea
        rows={rows}
        className={[
          "rounded-md border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition-colors duration-200 placeholder:text-zinc-400 focus:border-zinc-950",
          textareaClassName,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}

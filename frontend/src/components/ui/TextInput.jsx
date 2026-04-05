export default function TextInput({
  label,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <label className={`flex min-w-0 flex-col gap-2 ${className}`.trim()}>
      {label ? (
        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
          {label}
        </span>
      ) : null}

      <input
        className={[
          "h-11 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 outline-none transition-colors duration-200 placeholder:text-zinc-400 focus:border-zinc-950",
          inputClassName,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}

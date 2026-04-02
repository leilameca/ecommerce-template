export default function SurfaceMessage({ title, description, tone = "default" }) {
  const toneClassName =
    tone === "error"
      ? "border-rose-200 bg-rose-50/70 text-rose-900"
      : "border-zinc-200/80 bg-white text-zinc-900";

  return (
    <div className={`rounded-[2rem] border p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] ${toneClassName}`}>
      <h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-current/75">
          {description}
        </p>
      ) : null}
    </div>
  );
}

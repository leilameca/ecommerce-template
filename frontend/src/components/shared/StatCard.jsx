export default function StatCard({ label, value, hint }) {
  return (
    <article className="border border-zinc-200/80 bg-white p-5">
      <div className="text-[10px] font-medium uppercase tracking-[0.26em] text-zinc-400">
        {label}
      </div>

      <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">
        {value}
      </div>

      {hint ? <p className="mt-2 text-sm leading-6 text-zinc-500">{hint}</p> : null}
    </article>
  );
}

export default function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-5 border-b border-zinc-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <div className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          {eyebrow}
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export default function RoutePlaceholder({ title, description }) {
  return (
    <section className="px-2 py-8 text-zinc-950 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-zinc-200/80 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-12">
        <span className="text-xs font-medium uppercase tracking-[0.32em] text-zinc-400">
          Ecommerce Frontend
        </span>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}

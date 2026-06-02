import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "../../routes/route-paths";

const fallbackTones = [
  "from-stone-100 to-stone-200/70",
  "from-zinc-100 to-zinc-200/70",
  "from-neutral-100 to-neutral-200/70",
];

export default function HomeCategoryCard({ category, index = 0 }) {
  const imageUrl = category.image?.url || "";
  const imageAlt = category.image?.alt || category.name;
  const gradientTone = fallbackTones[index % fallbackTones.length];
  const categoryLink = `${ROUTE_PATHS.catalog}?category=${category.slug}`;

  return (
    <article className="overflow-hidden border border-zinc-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <Link to={categoryLink} className="block">
        <div className="relative aspect-[6/5] overflow-hidden bg-zinc-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${gradientTone}`} />
          )}

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </Link>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <div className="space-y-2">
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            Featured Category
          </div>

          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
            {category.name}
          </h3>

          <p className="line-clamp-3 text-sm leading-7 text-zinc-600">
            {category.description ||
              "A refined collection prepared for clean merchandising and premium storefront storytelling."}
          </p>
        </div>

        <Link
          to={categoryLink}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-950 transition-colors duration-200 hover:text-zinc-600"
        >
          Shop collection
          <span aria-hidden="true">+</span>
        </Link>
      </div>
    </article>
  );
}

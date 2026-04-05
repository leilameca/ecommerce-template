import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "../../hooks/useCart";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { ROUTE_PATHS } from "../../routes/route-paths";

const getLinkClassName = ({ isActive }) => {
  return [
    "inline-flex items-center gap-2 text-sm tracking-[-0.01em] transition-colors duration-200",
    isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-950",
  ].join(" ");
};

function NavIcon({ name, className = "h-4 w-4" }) {
  const commonProps = {
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };

  if (name === "layers") {
    return (
      <svg {...commonProps}>
        <path d="M12 3 4 7l8 4 8-4-8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 17 8 4 8-4" />
      </svg>
    );
  }

  if (name === "star") {
    return (
      <svg {...commonProps}>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </svg>
    );
  }

  if (name === "bag") {
    return (
      <svg {...commonProps}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg {...commonProps}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </svg>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { config } = useStoreConfig();
  const { t } = useLanguage();
  const storeName = config.storeName || "Commerce Studio";
  const navigationLinks = [
    { label: t("nav_shop"), to: ROUTE_PATHS.catalog, icon: "grid" },
    {
      label: t("nav_collections"),
      to: { pathname: ROUTE_PATHS.home, hash: "#collections" },
      icon: "layers",
    },
    {
      label: t("nav_featured"),
      to: { pathname: ROUTE_PATHS.home, hash: "#featured" },
      icon: "star",
    },
  ];

  return (
    <div className="relative flex min-w-0 items-center justify-between gap-3 py-4 sm:gap-4 sm:py-5">
      <Link
        to={ROUTE_PATHS.home}
        className="min-w-0 max-w-[calc(100%-5.5rem)] sm:max-w-[min(50vw,18rem)] lg:max-w-none"
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="truncate text-base font-semibold tracking-[-0.03em] text-zinc-950 sm:text-lg">
          {storeName}
        </div>
      </Link>

      <nav className="hidden min-w-0 items-center gap-5 lg:flex xl:gap-8">
        {navigationLinks.map((item) => (
          <NavLink
            key={typeof item.to === "string" ? item.to : item.label}
            to={item.to}
            className={getLinkClassName}
          >
            <NavIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden items-center gap-4 lg:flex xl:gap-6">
        <LanguageSwitcher compact />

        <Link
          to={ROUTE_PATHS.cart}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-950"
        >
          <NavIcon name="bag" />
          {t("nav_bag")} {itemCount > 0 ? `(${itemCount})` : ""}
        </Link>

        <Link
          to={ROUTE_PATHS.checkout}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-950 transition-opacity duration-200 hover:opacity-60"
        >
          <NavIcon name="arrow" />
          {t("nav_checkout")}
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:hidden">
        <Link
          to={ROUTE_PATHS.cart}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors duration-200 hover:text-zinc-950"
          onClick={() => setIsMenuOpen(false)}
        >
          <NavIcon name="bag" />
          {itemCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1 text-[10px] font-medium text-white">
              {itemCount}
            </span>
          ) : null}
          <span className="sr-only">{t("nav_bag")}</span>
        </Link>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </span>
        </button>
      </div>

      {isMenuOpen ? (
        <div className="absolute inset-x-0 top-full z-30 pt-3 lg:hidden">
          <nav className="mx-auto flex max-h-[calc(100vh-6rem)] max-w-[1440px] flex-col gap-4 overflow-y-auto rounded-[1.5rem] border border-zinc-200/80 bg-white/96 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-3 border-b border-zinc-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-[-0.02em] text-zinc-950">
                  {storeName}
                </div>
                <div className="mt-1 text-xs text-zinc-500">{t("nav_checkout")}</div>
              </div>

              <LanguageSwitcher compact />
            </div>

            {navigationLinks.map((item) => (
              <NavLink
                key={typeof item.to === "string" ? item.to : item.label}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm transition-colors duration-200",
                    isActive
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:text-zinc-950",
                  ].join(" ")
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </NavLink>
            ))}

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                to={ROUTE_PATHS.cart}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900"
                onClick={() => setIsMenuOpen(false)}
              >
                <NavIcon name="bag" />
                {t("nav_bag")} {itemCount > 0 ? `(${itemCount})` : ""}
              </Link>

              <Link
                to={ROUTE_PATHS.checkout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-950 bg-zinc-950 px-4 py-3 text-sm font-medium text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <NavIcon name="arrow" />
                {t("nav_checkout")}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

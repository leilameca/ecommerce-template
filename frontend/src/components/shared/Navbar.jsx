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
        <path d="M6 8h12l-1 11H7L6 8Z" />
        <path d="M9 8a3 3 0 1 1 6 0" />
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
    <div className="flex items-center justify-between gap-4 py-4 sm:py-5">
      <Link
        to={ROUTE_PATHS.home}
        className="min-w-0"
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="truncate text-base font-semibold tracking-[-0.03em] text-zinc-950 sm:text-lg">
          {storeName}
        </div>
      </Link>

        <nav className="hidden items-center gap-8 lg:flex">
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

      <div className="hidden items-center gap-6 lg:flex">
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

      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
        className="inline-flex h-10 w-10 items-center justify-center text-zinc-900 lg:hidden"
        onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
        </span>
      </button>

      {isMenuOpen ? (
        <div className="absolute inset-x-0 top-full border-b border-zinc-200/80 bg-white px-4 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:px-6 lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-4">
            <LanguageSwitcher compact />

            {navigationLinks.map((item) => (
              <NavLink
                key={typeof item.to === "string" ? item.to : item.label}
                to={item.to}
                className={getLinkClassName}
                onClick={() => setIsMenuOpen(false)}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </NavLink>
            ))}

            <Link
              to={ROUTE_PATHS.cart}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-950"
              onClick={() => setIsMenuOpen(false)}
            >
              <NavIcon name="bag" />
              {t("nav_bag")} {itemCount > 0 ? `(${itemCount})` : ""}
            </Link>

            <Link
              to={ROUTE_PATHS.checkout}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-950"
              onClick={() => setIsMenuOpen(false)}
            >
              <NavIcon name="arrow" />
              {t("nav_checkout")}
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

import { Link } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function StoreFooter() {
  const { config } = useStoreConfig();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const storeName = config.storeName || "Commerce Studio";

  return (
    <footer className="border-t border-zinc-200/80 bg-white">
      <div className="mx-auto grid max-w-[1380px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,0.7fr))] lg:px-10 lg:py-16">
        <div className="max-w-md">
          <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            {storeName}
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
            {t("footer_tagline")}
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-600">
            {t("footer_copy")}
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">
            {t("footer_shop")}
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
            <Link to={ROUTE_PATHS.home} className="transition-colors hover:text-zinc-950">
              {t("footer_home")}
            </Link>
            <Link
              to={ROUTE_PATHS.catalog}
              className="transition-colors hover:text-zinc-950"
            >
              {t("footer_catalog")}
            </Link>
            <Link to={ROUTE_PATHS.cart} className="transition-colors hover:text-zinc-950">
              {t("footer_cart")}
            </Link>
            <Link
              to={ROUTE_PATHS.checkout}
              className="transition-colors hover:text-zinc-950"
            >
              {t("footer_checkout")}
            </Link>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">
            {t("footer_store")}
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
            <Link
              to={ROUTE_PATHS.adminLogin}
              className="transition-colors hover:text-zinc-950"
            >
              {t("footer_admin")}
            </Link>
            <div>{t("footer_currency")}: {config.currency || "USD"}</div>
            {config.whatsappNumber ? <div>{t("footer_whatsapp")}: {config.whatsappNumber}</div> : null}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200/80">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-2 px-4 py-4 text-sm text-zinc-500 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>{currentYear} {storeName}. {t("footer_rights")}</p>
          <p>{t("footer_brand")}</p>
        </div>
      </div>
    </footer>
  );
}

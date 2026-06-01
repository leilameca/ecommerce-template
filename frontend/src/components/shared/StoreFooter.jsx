import { Link } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { getLocalizedText } from "../../lib/localize-config";
import { ROUTE_PATHS } from "../../routes/route-paths";

function SocialIcon({ href, label, children }) {
  if (!href) return null;
  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noreferrer" aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-950">
      {children}
    </a>
  );
}

export default function StoreFooter() {
  const { config } = useStoreConfig();
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const storeName = config.storeName || "Commerce Studio";
  const hasSocial = config.socialLinks?.instagram || config.socialLinks?.facebook || config.socialLinks?.tiktok;
  const hasContact = config.contactEmail || config.phone || config.whatsappNumber;

  return (
    <footer className="border-t border-zinc-200/80 bg-white">
      <div className="mx-auto grid max-w-[1380px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.6fr))] lg:px-10 lg:py-16">
        <div className="max-w-md">
          <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            {storeName}
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
            {getLocalizedText(config.heroTitle, language) || t("footer_tagline")}
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-600">
            {getLocalizedText(config.heroCopy, language) || t("footer_copy")}
          </p>

          {hasSocial ? (
            <div className="mt-6 flex items-center gap-2">
              <SocialIcon href={config.socialLinks?.instagram} label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href={config.socialLinks?.facebook} label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href={config.socialLinks?.tiktok} label="TikTok">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </SocialIcon>
            </div>
          ) : null}
        </div>

        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">
            {t("footer_shop")}
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
            <Link to={ROUTE_PATHS.home} className="transition-colors hover:text-zinc-950">{t("footer_home")}</Link>
            <Link to={ROUTE_PATHS.catalog} className="transition-colors hover:text-zinc-950">{t("footer_catalog")}</Link>
            <Link to={ROUTE_PATHS.cart} className="transition-colors hover:text-zinc-950">{t("footer_cart")}</Link>
            <Link to={ROUTE_PATHS.checkout} className="transition-colors hover:text-zinc-950">{t("footer_checkout")}</Link>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">
            {t("footer_info")}
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
            <Link to={ROUTE_PATHS.about} className="transition-colors hover:text-zinc-950">{t("footer_about")}</Link>
            <Link to={ROUTE_PATHS.contact} className="transition-colors hover:text-zinc-950">{t("footer_contact_link")}</Link>
            <Link to={ROUTE_PATHS.faq} className="transition-colors hover:text-zinc-950">{t("footer_faq")}</Link>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">
            {t("footer_legal")}
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
            <Link to={ROUTE_PATHS.privacy} className="transition-colors hover:text-zinc-950">{t("footer_privacy")}</Link>
            <Link to={ROUTE_PATHS.terms} className="transition-colors hover:text-zinc-950">{t("footer_terms")}</Link>
            <Link to={ROUTE_PATHS.shippingPolicy} className="transition-colors hover:text-zinc-950">{t("footer_shipping_policy")}</Link>
          </div>
        </div>

        {hasContact ? (
          <div>
            <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">
              {t("footer_contact_link")}
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
              {config.contactEmail ? (
                <a href={`mailto:${config.contactEmail}`} className="transition-colors hover:text-zinc-950">{config.contactEmail}</a>
              ) : null}
              {config.phone && config.phone !== config.whatsappNumber ? (
                <div>{config.phone}</div>
              ) : null}
              {config.whatsappNumber ? (
                <a href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="transition-colors hover:text-zinc-950">
                  WhatsApp: {config.whatsappNumber}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-zinc-200/80">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-2 px-4 py-4 text-sm text-zinc-500 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>{currentYear} {storeName}. {t("footer_rights")}</p>
          <div className="flex flex-wrap gap-4">
            <Link to={ROUTE_PATHS.privacy} className="hover:text-zinc-950 transition-colors">{t("footer_privacy")}</Link>
            <Link to={ROUTE_PATHS.terms} className="hover:text-zinc-950 transition-colors">{t("footer_terms")}</Link>
            <Link to={ROUTE_PATHS.adminDashboard} className="hover:text-zinc-950 transition-colors opacity-50">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

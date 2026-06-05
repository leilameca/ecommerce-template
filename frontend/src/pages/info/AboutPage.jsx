import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";
import PageSEO from "../../components/shared/PageSEO";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { getLocalizedText } from "../../lib/localize-config";
import { ROUTE_PATHS } from "../../routes/route-paths";

const values = [
  { key: "v1", icon: "✦" },
  { key: "v2", icon: "◆" },
  { key: "v3", icon: "●" },
];

export default function AboutPage() {
  const { t, language } = useLanguage();
  const { config } = useStoreConfig();
  const storeName = config.storeName || "Commerce Studio";

  const pageTitle = getLocalizedText(config.aboutTitle, language) || t("about_title");
  const pageCopy = getLocalizedText(config.aboutCopy, language) || t("about_copy", { store: storeName });
  const missionTitle = getLocalizedText(config.aboutMissionTitle, language) || t("about_mission_title");
  const missionCopy = getLocalizedText(config.aboutMissionCopy, language) || t("about_mission_copy");

  return (
    <div className="space-y-8 sm:space-y-12">
      <PageSEO title={pageTitle} description={pageCopy} />

      <section className="max-w-3xl">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          {t("about_eyebrow")}
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-5xl">
          {pageTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
          {pageCopy}
        </p>
      </section>

      <div className="rounded-[2rem] p-8 text-white sm:p-12" style={{ backgroundColor: "var(--color-primary, #111)" }}>
        <div className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/50">
          {t("about_mission_label")}
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
          {missionTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
          {missionCopy}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-2xl">
          {t("about_values_title")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {values.map(({ key, icon }) => (
            <div key={key} className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)]">
              <div className="text-2xl" style={{ color: "var(--color-primary, #111)" }}>{icon}</div>
              <h3 className="mt-4 text-base font-semibold tracking-[-0.03em] text-zinc-950">
                {t(`about_${key}_title`)}
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-600">
                {t(`about_${key}_copy`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4 border-t border-zinc-200/80 pt-8">
        <Link to={ROUTE_PATHS.catalog}>
          <Button size="lg">{t("about_cta")}</Button>
        </Link>
        <Link to={ROUTE_PATHS.contact} className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
          {t("about_contact_link")} →
        </Link>
      </div>
    </div>
  );
}

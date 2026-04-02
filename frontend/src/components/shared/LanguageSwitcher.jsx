import { useLanguage } from "../../hooks/useLanguage";

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center border border-zinc-300 bg-white ${
        compact ? "" : "gap-1"
      }`}
      aria-label={t("common_language")}
    >
      <button
        type="button"
        className={`px-3 py-2 text-xs font-medium transition-colors duration-200 ${
          language === "es"
            ? "bg-zinc-950 text-white"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
        }`}
        onClick={() => setLanguage("es")}
      >
        ES
      </button>

      <button
        type="button"
        className={`px-3 py-2 text-xs font-medium transition-colors duration-200 ${
          language === "en"
            ? "bg-zinc-950 text-white"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
        }`}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}

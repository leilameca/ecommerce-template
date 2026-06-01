import { useState } from "react";
import { Link } from "react-router-dom";

import PageSEO from "../../components/shared/PageSEO";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { getLocalizedText } from "../../lib/localize-config";
import { ROUTE_PATHS } from "../../routes/route-paths";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200/80 last:border-0">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium leading-6 text-zinc-950">{question}</span>
        <span className="mt-0.5 shrink-0 text-zinc-400 transition-transform duration-200" style={{ transform: open ? "rotate(45deg)" : "none" }}>
          ✕
        </span>
      </button>
      {open ? (
        <p className="pb-5 text-sm leading-7 text-zinc-600">{answer}</p>
      ) : null}
    </div>
  );
}

export default function FaqPage() {
  const { t, language } = useLanguage();
  const { config } = useStoreConfig();

  const configFaq =
    Array.isArray(config.faqItems) && config.faqItems.length > 0
      ? config.faqItems.map((item) => ({
          question: getLocalizedText(item.question, language),
          answer: getLocalizedText(item.answer, language),
        }))
      : null;

  const faqList =
    configFaq ||
    FAQ_KEYS.map((key) => ({
      question: t(`faq_${key}_q`),
      answer: t(`faq_${key}_a`),
    }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageSEO title={t("faq_title")} description={t("faq_copy")} />

      <section className="max-w-2xl">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          {t("faq_eyebrow")}
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
          {t("faq_title")}
        </h1>
        <p className="mt-2 text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8">
          {t("faq_copy")}
        </p>
      </section>

      <div className="rounded-[2rem] border border-zinc-200/80 bg-white px-5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:px-8">
        {faqList.map((item, index) => (
          <FaqItem
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-zinc-200/80 bg-zinc-50/80 p-5 sm:p-6">
        <div className="text-sm font-medium text-zinc-950">{t("faq_still_questions")}</div>
        <p className="mt-1 text-sm text-zinc-600">{t("faq_contact_us_copy")}</p>
        <Link
          to={ROUTE_PATHS.contact}
          className="mt-4 inline-flex items-center text-sm font-medium text-zinc-950 hover:underline"
        >
          {t("faq_contact_link")} →
        </Link>
      </div>
    </div>
  );
}

import { createContext, useEffect, useMemo, useState } from "react";

import { translations } from "../i18n/translations";

const STORAGE_KEY = "ecommerce-template-language";
const DEFAULT_LANGUAGE = "es";

export const LanguageContext = createContext(null);

const interpolate = (template, params = {}) => {
  return Object.entries(params).reduce((message, [key, value]) => {
    return message.replaceAll(`{${key}}`, String(value));
  }, template);
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LANGUAGE;
    }

    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = useMemo(() => {
    const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];

    const t = (key, params = {}) => {
      const template =
        dictionary[key] ||
        translations.en[key] ||
        key;

      return interpolate(template, params);
    };

    return {
      language,
      setLanguage,
      t,
      isSpanish: language === "es",
      isEnglish: language === "en",
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

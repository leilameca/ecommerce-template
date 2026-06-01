import { createContext, useEffect, useMemo, useState } from "react";

import { getStoreConfig } from "../services/api/store-config.service";

const FONT_MAP = {
  default: { heading: null, body: null, google: null },
  editorial: {
    heading: "'Playfair Display', Georgia, serif",
    body: "Inter, 'Helvetica Neue', sans-serif",
    google: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
  },
  minimal: {
    heading: "'DM Sans', 'Helvetica Neue', sans-serif",
    body: "'DM Sans', 'Helvetica Neue', sans-serif",
    google: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap",
  },
  classic: {
    heading: "'Lora', Georgia, serif",
    body: "'Nunito', 'Helvetica Neue', sans-serif",
    google: "https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito:wght@400;500;600&display=swap",
  },
  bold: {
    heading: "'Montserrat', 'Helvetica Neue', sans-serif",
    body: "'Montserrat', 'Helvetica Neue', sans-serif",
    google: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
  },
};

const defaultStoreConfig = {
  storeName: "Commerce Studio",
  heroTitle: "",
  heroCopy: "",
  logoUrl: "",
  heroImage: "",
  whatsappNumber: "",
  currency: "USD",
  primaryColor: "#111111",
  secondaryColor: "#f5f5f5",
  backgroundColor: "#ffffff",
  fontFamily: "default",
  editorialTitle: "",
  editorialCopy: "",
  editorialPoint1Title: "",
  editorialPoint1Copy: "",
  editorialPoint2Title: "",
  editorialPoint2Copy: "",
  enableWhatsappCheckout: true,
  enableOnlinePayment: false,
  paymentMethods: ["whatsapp", "cash_on_delivery"],
  contactEmail: "",
  phone: "",
  socialLinks: { instagram: "", facebook: "", tiktok: "" },
};

export const StoreConfigContext = createContext(null);

export function StoreConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultStoreConfig);
  const [isLoading, setIsLoading] = useState(true);

  const applyTheme = (cfg) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", cfg.primaryColor || "#111111");
    root.style.setProperty("--color-secondary", cfg.secondaryColor || "#f5f5f5");
    root.style.setProperty("--color-background", cfg.backgroundColor || "#ffffff");

    const font = FONT_MAP[cfg.fontFamily] || FONT_MAP.default;

    // Remove any previously injected Google Fonts link
    const existing = document.getElementById("store-google-fonts");
    if (existing) existing.remove();

    if (font.google) {
      const link = document.createElement("link");
      link.id = "store-google-fonts";
      link.rel = "stylesheet";
      link.href = font.google;
      document.head.appendChild(link);
    }

    root.style.setProperty(
      "--font-heading",
      font.heading || "Inter, 'Helvetica Neue', 'Segoe UI', sans-serif"
    );
    root.style.setProperty(
      "--font-body",
      font.body || "Inter, 'Helvetica Neue', 'Segoe UI', sans-serif"
    );
  };

  const refreshConfig = async () => {
    setIsLoading(true);

    try {
      const response = await getStoreConfig();
      const next = { ...defaultStoreConfig, ...(response?.data || {}) };
      setConfig(next);
      applyTheme(next);
    } catch (error) {
      setConfig(defaultStoreConfig);
      applyTheme(defaultStoreConfig);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  const value = useMemo(
    () => ({
      config,
      isLoading,
      refreshConfig,
    }),
    [config, isLoading]
  );

  return (
    <StoreConfigContext.Provider value={value}>
      {children}
    </StoreConfigContext.Provider>
  );
}

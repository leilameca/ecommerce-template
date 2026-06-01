import { createContext, useEffect, useMemo, useState } from "react";

import { getStoreConfig } from "../services/api/store-config.service";

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

  const applyColors = (cfg) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", cfg.primaryColor || "#111111");
    root.style.setProperty("--color-secondary", cfg.secondaryColor || "#f5f5f5");
  };

  const refreshConfig = async () => {
    setIsLoading(true);

    try {
      const response = await getStoreConfig();
      const next = { ...defaultStoreConfig, ...(response?.data || {}) };
      setConfig(next);
      applyColors(next);
    } catch (error) {
      setConfig(defaultStoreConfig);
      applyColors(defaultStoreConfig);
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

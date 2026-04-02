import { createContext, useEffect, useMemo, useState } from "react";

import { getStoreConfig } from "../services/api/store-config.service";

const defaultStoreConfig = {
  storeName: "Commerce Studio",
  logoUrl: "",
  heroImage: "",
  whatsappNumber: "",
  currency: "USD",
  primaryColor: "#111111",
  secondaryColor: "#f5f5f5",
  enableWhatsappCheckout: true,
  enableOnlinePayment: false,
  paymentMethods: ["whatsapp", "cash_on_delivery"],
};

export const StoreConfigContext = createContext(null);

export function StoreConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultStoreConfig);
  const [isLoading, setIsLoading] = useState(true);

  const refreshConfig = async () => {
    setIsLoading(true);

    try {
      const response = await getStoreConfig();
      setConfig({
        ...defaultStoreConfig,
        ...(response?.data || {}),
      });
    } catch (error) {
      setConfig(defaultStoreConfig);
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

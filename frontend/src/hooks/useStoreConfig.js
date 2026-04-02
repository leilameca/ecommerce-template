import { useContext } from "react";

import { StoreConfigContext } from "../contexts/StoreConfigContext";

export function useStoreConfig() {
  const context = useContext(StoreConfigContext);

  if (!context) {
    throw new Error("useStoreConfig must be used inside StoreConfigProvider.");
  }

  return context;
}

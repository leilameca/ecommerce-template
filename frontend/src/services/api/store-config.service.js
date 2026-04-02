import { apiRequest } from "./client";

export function getStoreConfig() {
  return apiRequest("/store-config");
}

export function upsertStoreConfig(payload) {
  return apiRequest("/store-config", {
    method: "PUT",
    body: payload,
  });
}

import { apiRequest } from "./client";

export function validateCoupon(code, orderSubtotal) {
  return apiRequest("/coupons/validate", {
    method: "POST",
    body: { code, orderSubtotal },
  });
}

export function getCoupons() {
  return apiRequest("/coupons");
}

export function createCoupon(payload) {
  return apiRequest("/coupons", { method: "POST", body: payload });
}

export function toggleCoupon(id) {
  return apiRequest(`/coupons/${id}/toggle`, { method: "PATCH" });
}

export function deleteCoupon(id) {
  return apiRequest(`/coupons/${id}`, { method: "DELETE" });
}

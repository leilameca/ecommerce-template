import { apiRequest } from "./client";

export function createStripeSession(orderId) {
  return apiRequest("/stripe/create-session", {
    method: "POST",
    body: { orderId },
  });
}

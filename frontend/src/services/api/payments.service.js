import { apiRequest } from "./client";

export function createPaypalOrder(amount, currency) {
  return apiRequest("/payments/paypal/create-order", {
    method: "POST",
    body: { amount, currency },
  });
}

export function capturePaypalOrder(paypalOrderId, orderData, token) {
  return apiRequest("/payments/paypal/capture-order", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: { paypalOrderId, ...orderData },
  });
}

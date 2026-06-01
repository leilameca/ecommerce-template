import { apiRequest, buildQueryString } from "./client";

export function createOrder(payload, customerToken = null) {
  return apiRequest("/orders", {
    method: "POST",
    body: payload,
    headers: customerToken ? { Authorization: `Bearer ${customerToken}` } : undefined,
  });
}

export function getOrders(params = {}) {
  return apiRequest(`/orders${buildQueryString(params)}`);
}

export function getOrderById(orderId) {
  return apiRequest(`/orders/${orderId}`);
}

export function updateOrderStatus(orderId, payload) {
  return apiRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function getPublicOrder(orderId) {
  return apiRequest(`/orders/public/${orderId}`);
}

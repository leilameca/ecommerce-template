import { apiRequest, buildQueryString } from "./client";

export function createOrder(payload) {
  return apiRequest("/orders", {
    method: "POST",
    body: payload,
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

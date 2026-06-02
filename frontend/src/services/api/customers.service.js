import { apiRequest } from "./client";

const customerAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

export function registerCustomer(name, email, password, phone = "") {
  return apiRequest("/customers/register", {
    method: "POST",
    body: { name, email, password, phone },
  });
}

export function loginCustomer(email, password) {
  return apiRequest("/customers/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getCustomerProfile(token) {
  return apiRequest("/customers/me", {
    headers: customerAuthHeader(token),
  });
}

export function getCustomerOrders(token) {
  return apiRequest("/customers/orders", {
    headers: customerAuthHeader(token),
  });
}

export function requestPasswordReset(email) {
  return apiRequest("/customers/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export function resetPassword(token, password) {
  return apiRequest("/customers/reset-password", {
    method: "POST",
    body: { token, password },
  });
}

export function updateCustomerProfile(token, data) {
  return apiRequest("/customers/me", {
    method: "PUT",
    headers: customerAuthHeader(token),
    body: data,
  });
}

export function changeCustomerPassword(token, currentPassword, newPassword) {
  return apiRequest("/customers/me/password", {
    method: "PUT",
    headers: customerAuthHeader(token),
    body: { currentPassword, newPassword },
  });
}

export function verifyEmail(token) {
  return apiRequest(`/customers/verify-email?token=${token}`);
}

export function resendVerification(email) {
  return apiRequest("/customers/resend-verification", {
    method: "POST",
    body: { email },
  });
}

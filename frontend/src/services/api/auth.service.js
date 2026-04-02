import { apiRequest } from "./client";

export function loginAdmin(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function getCurrentAdmin() {
  return apiRequest("/auth/me");
}

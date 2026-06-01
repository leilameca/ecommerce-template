import { apiRequest } from "./client";

export function getUsers() {
  return apiRequest("/users");
}

export function createUser(payload) {
  return apiRequest("/users", { method: "POST", body: payload });
}

export function updateUser(userId, payload) {
  return apiRequest(`/users/${userId}`, { method: "PUT", body: payload });
}

export function deleteUser(userId) {
  return apiRequest(`/users/${userId}`, { method: "DELETE" });
}

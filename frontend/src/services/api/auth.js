import { getAccessToken } from "./auth-storage";
import { API_BASE_URL } from "./client";

export const ALLOWED_ADMIN_ROLES = ["super-admin", "admin", "manager"];

const AUTH_API_BASE_URL = `${API_BASE_URL}/auth`;

function buildError(message) {
  return new Error(message || "Authentication request failed.");
}

function isJsonResponse(response) {
  return response.headers.get("content-type")?.includes("application/json");
}

async function parseResponse(response) {
  if (isJsonResponse(response)) {
    return response.json();
  }

  const rawResponse = await response.text();

  return rawResponse ? { message: rawResponse } : null;
}

export function isAllowedAdminRole(role) {
  return ALLOWED_ADMIN_ROLES.includes(role);
}

export async function login(email, password) {
  const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw buildError(data?.message || "Login failed.");
  }

  return { data };
}

export async function getCurrentUser(token = getAccessToken()) {
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${AUTH_API_BASE_URL}/me`, {
    method: "GET",
    headers,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw buildError(data?.message || "Could not load current user.");
  }

  return { data };
}

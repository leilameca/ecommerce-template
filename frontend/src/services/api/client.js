import { getAccessToken } from "./auth-storage";


export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";


export class ApiClientError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.data = data;
  }
}

const buildUrl = (path) => {
  return `${API_BASE_URL}${path}`;
};

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;

  headers.set("Accept", "application/json");

  if (!isFormData && !headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body:
      !isFormData &&
      options.body !== undefined &&
      headers.get("Content-Type") === "application/json"
        ? JSON.stringify(options.body)
        : options.body,
  });

  const rawResponse = await response.text();
  let data = null;

  if (rawResponse) {
    try {
      data = JSON.parse(rawResponse);
    } catch (error) {
      data = {
        message: rawResponse,
      };
    }
  }

  if (!response.ok) {
    throw new ApiClientError(
      data?.message || "Request failed.",
      response.status,
      data
    );
  }

  return data;
}

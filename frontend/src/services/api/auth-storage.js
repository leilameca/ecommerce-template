const ACCESS_TOKEN_KEY = "ecommerce.accessToken";

const isBrowser = typeof window !== "undefined";

export function getAccessToken() {
  if (!isBrowser) {
    return "";
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function setAccessToken(token) {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

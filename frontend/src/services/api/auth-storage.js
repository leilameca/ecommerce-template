const ACCESS_TOKEN_KEY = "token";
const USER_KEY = "user";

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

  if (!token) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
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

export function getStoredUser() {
  if (!isBrowser) {
    return null;
  }

  const storedValue = window.localStorage.getItem(USER_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user) {
  if (!isBrowser) {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(USER_KEY);
    return;
  }

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(USER_KEY);
}

export function clearAuthSession() {
  clearAccessToken();
  clearStoredUser();
}

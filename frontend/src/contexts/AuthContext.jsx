import { createContext, useEffect, useMemo, useState } from "react";

import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from "../services/api/auth-storage";
import { getCurrentUser, isAllowedAdminRole, login as loginRequest } from "../services/api/auth";

export const AuthContext = createContext(null);

const ADMIN_ACCESS_ERROR = "You do not have permission to access the admin area.";

function normalizeUser(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  const role = typeof user.role === "string" ? user.role.trim() : "";

  if (!isAllowedAdminRole(role)) {
    return null;
  }

  return {
    ...user,
    role,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAccessToken());
  const [user, setUserState] = useState(() => normalizeUser(getStoredUser()));
  const [isLoading, setIsLoading] = useState(() => Boolean(getAccessToken()));

  const syncUser = (nextUser) => {
    setUserState((currentUser) => {
      const resolvedUser =
        typeof nextUser === "function" ? nextUser(currentUser) : nextUser;
      const normalizedUser = normalizeUser(resolvedUser);

      if (normalizedUser) {
        setStoredUser(normalizedUser);
      } else {
        setStoredUser(null);
      }

      return normalizedUser;
    });
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      const currentToken = getAccessToken();

      if (!currentToken) {
        if (!isMounted) {
          return;
        }

        setToken("");
        syncUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(currentToken);
        const currentUser = normalizeUser(response?.data?.data?.user);

        if (!currentUser) {
          throw new Error(ADMIN_ACCESS_ERROR);
        }

        if (!isMounted) {
          return;
        }

        setToken(currentToken);
        syncUser(currentUser);
      } catch (error) {
        clearAuthSession();

        if (!isMounted) {
          return;
        }

        setToken("");
        syncUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await loginRequest(
      credentials.email?.trim() || "",
      credentials.password || ""
    );
    const nextToken = response?.data?.data?.token || "";
    const currentUser = normalizeUser(response?.data?.data?.user);

    if (!nextToken) {
      throw new Error("Authentication token was not returned by the server.");
    }

    if (!currentUser) {
      clearAuthSession();
      setToken("");
      syncUser(null);
      throw new Error(ADMIN_ACCESS_ERROR);
    }

    setAccessToken(nextToken);
    setStoredUser(currentUser);
    setToken(nextToken);
    syncUser(currentUser);

    return response;
  };

  const logout = () => {
    clearAuthSession();
    setToken("");
    syncUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      hasAdminAccess: Boolean(token && user && isAllowedAdminRole(user.role)),
      login,
      logout,
      setUser: syncUser,
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { createContext, useEffect, useMemo, useState } from "react";

import { clearAccessToken, getAccessToken, setAccessToken } from "../services/api/auth-storage";
import { getCurrentAdmin, loginAdmin } from "../services/api/auth.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentAdmin();
        setUser(response?.data?.user || null);
      } catch (error) {
        clearAccessToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const login = async (credentials) => {
    const response = await loginAdmin(credentials);
    const token = response?.data?.token || "";
    const currentUser = response?.data?.user || null;

    if (token) {
      setAccessToken(token);
    }

    setUser(currentUser);

    return response;
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token: getAccessToken(),
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser,
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

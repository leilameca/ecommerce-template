import { createContext, useEffect, useMemo, useState } from "react";

import {
  getCustomerProfile,
  loginCustomer as apiLogin,
  registerCustomer as apiRegister,
} from "../services/api/customers.service";

const CUSTOMER_TOKEN_KEY = "ecommerce.customer.token";
const CUSTOMER_USER_KEY = "ecommerce.customer.user";

const readToken = () => {
  try { return localStorage.getItem(CUSTOMER_TOKEN_KEY) || ""; } catch { return ""; }
};

const readCustomer = () => {
  try { return JSON.parse(localStorage.getItem(CUSTOMER_USER_KEY)); } catch { return null; }
};

const persist = (token, customer) => {
  localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(customer));
};

const clear = () => {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_USER_KEY);
};

export const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [token, setToken] = useState(() => readToken());
  const [customer, setCustomer] = useState(() => readCustomer());
  const [isLoading, setIsLoading] = useState(() => Boolean(readToken()));

  useEffect(() => {
    const storedToken = readToken();

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    getCustomerProfile(storedToken)
      .then((res) => {
        if (!mounted) return;
        const c = res?.data;
        if (c) {
          setToken(storedToken);
          setCustomer(c);
        } else {
          clear();
          setToken("");
          setCustomer(null);
        }
      })
      .catch(() => {
        clear();
        if (mounted) {
          setToken("");
          setCustomer(null);
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const register = async ({ name, email, password, phone = "" }) => {
    const res = await apiRegister(name, email, password, phone);
    const { token: t, customer: c } = res?.data || {};
    if (!t) throw new Error("No token returned.");
    persist(t, c);
    setToken(t);
    setCustomer(c);
    return res;
  };

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const { token: t, customer: c } = res?.data || {};
    if (!t) throw new Error("No token returned.");
    persist(t, c);
    setToken(t);
    setCustomer(c);
    return res;
  };

  const logout = () => {
    clear();
    setToken("");
    setCustomer(null);
  };

  const value = useMemo(
    () => ({
      customer,
      token,
      isLoading,
      isAuthenticated: Boolean(token && customer),
      register,
      login,
      logout,
    }),
    [customer, token, isLoading]
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

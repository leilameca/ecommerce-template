import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { StoreConfigProvider } from "../contexts/StoreConfigContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <StoreConfigProvider>
          <CartProvider>{children}</CartProvider>
        </StoreConfigProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

import { createContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "ecommerce.cart.v2";

const makeCartItemId = (productId, selectedVariants = {}) => {
  const variantStr = Object.keys(selectedVariants).sort().map((k) => `${k}:${selectedVariants[k]}`).join("|");
  return variantStr ? `${productId}__${variantStr}` : productId;
};

const getStoredCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getStoredCart());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, selectedVariants = {}) => {
    const cartItemId = makeCartItemId(product._id, selectedVariants);

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.cartItemId === cartItemId);

      if (existing) {
        return currentItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
            : item
        );
      }

      return [
        ...currentItems,
        {
          cartItemId,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock || quantity),
          imageUrl: product.images?.[0]?.url || "",
          imageAlt: product.images?.[0]?.alt || product.name,
          selectedVariants,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || quantity)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (cartItemId) => {
    setItems((currentItems) => currentItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      isEmpty: items.length === 0,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

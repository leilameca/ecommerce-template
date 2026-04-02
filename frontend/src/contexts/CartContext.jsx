import { createContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "ecommerce.cart";

const getStoredCart = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch (error) {
    return [];
  }
};

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getStoredCart());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === product._id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, item.stock),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock || quantity),
          imageUrl: product.images?.[0]?.url || "",
          imageAlt: product.images?.[0]?.alt || product.name,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.max(1, Math.min(quantity, item.stock || quantity)),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

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

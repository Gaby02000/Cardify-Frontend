import React, { createContext, useContext } from "react";
import { useCart as useCartHook } from "../hooks/useCart";
import type { GiftcardCartItem } from "../hooks/useCart";

interface CartContextValue {
  cartItems: GiftcardCartItem[];
  loading: boolean;
  addToCart: ReturnType<typeof useCartHook>["addToCart"];
  updateItem: ReturnType<typeof useCartHook>["updateItem"];
  removeItem: ReturnType<typeof useCartHook>["removeItem"];
  clearCart: ReturnType<typeof useCartHook>["clearCart"];
  fetchCart: ReturnType<typeof useCartHook>["fetchCart"];
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    cartItems,
    loading,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    fetchCart,
  } = useCartHook();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

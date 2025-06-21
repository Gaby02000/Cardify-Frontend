// src/context/CartContext.tsx
import { createContext, useContext } from "react";
import { useCart, GiftcardCartItem } from "../hooks/useCart";

interface CartContextValue {
  cartItems: GiftcardCartItem[];
  loading: boolean;
  addToCart: ReturnType<typeof useCart>["addToCart"];
  updateItem: ReturnType<typeof useCart>["updateItem"];
  removeItem: ReturnType<typeof useCart>["removeItem"];
  clearCart: ReturnType<typeof useCart>["clearCart"];
  fetchCart: ReturnType<typeof useCart>["fetchCart"];
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext debe usarse dentro de CartProvider");
  }
  return context;
};

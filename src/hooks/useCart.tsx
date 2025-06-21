// src/hooks/useCart.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface GiftcardCartItem {
  id?: number;
  giftcardId: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

const CART_STORAGE_KEY = "cart";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<GiftcardCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(false);

  const saveToLocalStorage = (items: GiftcardCartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  };

  const loadFromLocalStorage = (): GiftcardCartItem[] => {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const fetchCartFromBackend = async () => {
    try {
      const res = await axios.get("/apis/cart", { withCredentials: true });

      const backendItems: GiftcardCartItem[] = res.data.items.map((item: any) => ({
        id: item.id,
        giftcardId: item.gift_card_id,
        title: item.gift_card.title,
        price: item.gift_card.price,
        image: item.gift_card.image,
        quantity: item.quantity,
      }));

      setCartItems(backendItems);
      setUseBackend(true);
    } catch (error: any) {
      // Si no está logueado (ej: 401), usar localStorage
      console.warn("Usando localStorage para carrito", error?.response?.status);
      const localItems = loadFromLocalStorage();
      setCartItems(localItems);
      setUseBackend(false);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: GiftcardCartItem) => {
    if (useBackend) {
      try {
        await axios.post(
          "/apis/cart/add-item",
          {
            gift_card_id: item.giftcardId,
            quantity: item.quantity,
          },
          { withCredentials: true }
        );
        await fetchCartFromBackend();
      } catch (error) {
        console.error("Error agregando giftcard al carrito (backend)", error);
      }
    } else {
      const updated = [...cartItems];
      const existing = updated.find((i) => i.giftcardId === item.giftcardId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        updated.push(item);
      }
      setCartItems(updated);
      saveToLocalStorage(updated);
    }
  };

  const updateItem = async (cartItemId: number, quantity: number) => {
    if (useBackend) {
      try {
        await axios.put(
          `/apis/cart-item/${cartItemId}`,
          { quantity },
          { withCredentials: true }
        );
        await fetchCartFromBackend();
      } catch (error) {
        console.error("Error actualizando item (backend)", error);
      }
    } else {
      const updated = cartItems.map((item) =>
        item.giftcardId === cartItemId ? { ...item, quantity } : item
      );
      setCartItems(updated);
      saveToLocalStorage(updated);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (useBackend) {
      try {
        await axios.delete(`/apis/cart-item/${cartItemId}`, {
          withCredentials: true,
        });
        await fetchCartFromBackend();
      } catch (error) {
        console.error("Error eliminando item (backend)", error);
      }
    } else {
      const updated = cartItems.filter((item) => item.giftcardId !== cartItemId);
      setCartItems(updated);
      saveToLocalStorage(updated);
    }
  };

  const clearCart = async () => {
    if (useBackend) {
      try {
        await axios.post("/apis/cart/clear", {}, { withCredentials: true });
        setCartItems([]);
      } catch (error) {
        console.error("Error al vaciar carrito (backend)", error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  useEffect(() => {
    fetchCartFromBackend();
  }, []);

  return {
    cartItems,
    loading,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    fetchCart: fetchCartFromBackend,
  };
};

// src/hooks/useCart.ts
import { useEffect, useState } from "react";
import api, { getSessionId } from "../lib/api";
import { useToast } from "../context/ToastContext";

export interface GiftcardCartItem {
  id?: number;
  giftcardId: number;
  title: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  stock?: number;
}

const CART_STORAGE_KEY = "cart";

const mapBackendItems = (cart: any): GiftcardCartItem[] =>
  cart?.cart_items?.map((item: any) => {
    const gc = item.gift_card ?? {};
    const listPrice = Number(gc.price);
    const finalPrice = Number(gc.final_price ?? gc.price);
    return {
      id: item.id,
      giftcardId: item.gift_card_id,
      title: gc.title,
      price: finalPrice,
      originalPrice: gc.has_discount && finalPrice < listPrice ? listPrice : undefined,
      image: gc.image,
      quantity: item.quantity,
      stock: gc.stock,
    };
  }) ?? [];

export const useCart = () => {
  const toast = useToast();
  const [cartItems, setCartItems] = useState<GiftcardCartItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {
      const res = await api.get(`/cart`, {
        params: { session_id: getSessionId() },
      });

      const items = mapBackendItems(res.data.cart);
      setCartItems(items);
      saveToLocalStorage(items);
    } catch (error: any) {
      console.warn("Carrito: fallback a localStorage", error?.response?.status);
      setCartItems(loadFromLocalStorage());
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: GiftcardCartItem) => {
    try {
      await api.post(`/cart/add-item`, {
        gift_card_id: item.giftcardId,
        quantity: item.quantity,
        session_id: getSessionId(),
      });
      toast.success(`Agregado: ${item.title}`);
      await fetchCartFromBackend();
    } catch (error: any) {
      console.error("Error agregando giftcard al carrito", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "No se pudo agregar al carrito"
      );
    }
  };

  const updateItem = async (cartItemId: number, quantity: number) => {
    try {
      await api.put(`/cart-item/${cartItemId}`, {
        quantity,
        session_id: getSessionId(),
      });
      await fetchCartFromBackend();
    } catch (error: any) {
      console.error("Error actualizando item", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "No se pudo actualizar el carrito"
      );
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await api.delete(`/cart-item/${cartItemId}`, {
        data: { session_id: getSessionId() },
      });
      await fetchCartFromBackend();
    } catch (error) {
      console.error("Error eliminando item", error);
      toast.error("No se pudo quitar el producto");
    }
  };

  const clearCart = async () => {
    try {
      await api.post(`/cart/clear`, { session_id: getSessionId() });
    } catch (error) {
      console.error("Error al vaciar carrito", error);
    } finally {
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

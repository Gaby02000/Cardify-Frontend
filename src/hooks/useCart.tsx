// src/hooks/useCart.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface GiftcardCartItem {
  giftcardId: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<GiftcardCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!localStorage.getItem("auth_token"); // ajustá si usás otro sistema

  const fetchCartFromBackend = async () => {
    try {
      const res = await axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const backendItems: GiftcardCartItem[] = res.data.cart_items.map((item: any) => ({
        giftcardId: item.gift_card_id,
        title: item.gift_card.title,
        price: item.gift_card.price,
        image: item.gift_card.image,
        quantity: item.quantity,
      }));
      setCartItems(backendItems);
    } catch (error) {
      console.error("Error cargando el carrito del backend", error);
    } finally {
      setLoading(false);
    }
  };

  const syncLocalCartToBackend = async () => {
    const local = localStorage.getItem("cart");
    if (!local) return;

    const localItems: GiftcardCartItem[] = JSON.parse(local);
    try {
      for (const item of localItems) {
        await axios.post(
          "/api/cart/add",
          {
            gift_card_id: item.giftcardId,
            quantity: item.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
      }
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error sincronizando carrito local al backend", error);
    }
  };

  const addToCart = async (item: GiftcardCartItem) => {
    if (isAuthenticated) {
      try {
        await axios.post(
          "/api/cart/add",
          {
            gift_card_id: item.giftcardId,
            quantity: item.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
        fetchCartFromBackend();
      } catch (error) {
        console.error("Error agregando giftcard al carrito", error);
      }
    } else {
      setCartItems((prev) => {
        const index = prev.findIndex((i) => i.giftcardId === item.giftcardId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index].quantity += item.quantity;
          return updated;
        }
        return [...prev, item];
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await axios.delete("/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        setCartItems([]);
      } catch (error) {
        console.error("Error al vaciar el carrito", error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  };

  // Al iniciar, cargamos según el estado de autenticación
  useEffect(() => {
    if (isAuthenticated) {
      syncLocalCartToBackend().then(fetchCartFromBackend);
    } else {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Si no está autenticado, guardamos en localStorage cada vez que cambie
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  return {
    cartItems,
    loading,
    addToCart,
    clearCart,
  };
};

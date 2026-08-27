// src/components/CheckoutButton.tsx
import { useState } from "react";
import { CreditCard } from "lucide-react";
import api, { getSessionId, getToken } from "../lib/api";
import type { GiftcardCartItem } from "../hooks/useCart";

export default function CheckoutButton({ cartData }: { cartData?: GiftcardCartItem[] }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cartData || cartData.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    if (!getToken()) {
      alert("Debes iniciar sesión para confirmar la compra.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/orders`, {
        items: cartData.map((i) => ({
          gift_card_id: i.giftcardId,
          quantity: i.quantity,
        })),
        session_id: getSessionId(),
      });

      // Checkout Pro: redirigimos al link de pago de Mercado Pago.
      const url: string | undefined =
        res.data.init_point || res.data.sandbox_init_point;

      if (url) {
        window.location.href = url;
      } else {
        alert("No se recibió el link de pago de Mercado Pago.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "No se pudo iniciar el pago."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary btn-block btn-lg"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner" /> Procesando…
        </>
      ) : (
        <>
          <CreditCard size={18} /> Confirmar compra
        </>
      )}
    </button>
  );
}

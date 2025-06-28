// src/components/CheckoutButton.tsx
import { useState, useEffect } from "react";
import type { GiftcardCartItem } from "../hooks/useCart";

// Definir 'window.MercadoPago'
declare global {
  interface Window {
    MercadoPago: any;
  }
}

const apiUrl = import.meta.env.VITE_API_URL;
const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;

export default function CheckoutButton({ cartData }: { cartData?: GiftcardCartItem[] }) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cartData || cartData.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    setLoading(true);

    try {
      const payload = cartData.map((item) => ({
        gift_card_id: item.giftcardId,
        quantity: item.quantity,
      }));

      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
          "x-vercel-protection-bypass": import.meta.env.protectionBypassToken,
        },
        body: JSON.stringify({ items: payload }), // Asume que tu backend espera { items: [...] }
      });

      const data = await res.json();

      if (res.ok && data.preference_id) {
        setPreferenceId(data.preference_id);
      } else {
        alert("Error al crear la orden: " + (data?.message || "desconocido"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error interno al intentar procesar la orden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (preferenceId && window.MercadoPago) {
      const mp = new window.MercadoPago(publicKey, { locale: "es-AR" });

      mp.bricks().create("wallet", "wallet_container", {
        initialization: { preferenceId },
        customization: {
          texts: {
            valueProp: "smart_option",
          },
        },
      });
    }
  }, [preferenceId]);

  return (
    <div style={{ marginTop: "1rem" }}>
      {!preferenceId ? (
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius)",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Procesando..." : "Confirmar Compra"}
        </button>
      ) : (
        <div id="wallet_container" />
      )}
    </div>
  );
}

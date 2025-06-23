// src/components/CheckoutButton.tsx
import { useState, useEffect } from "react";

// Agregar este bloque para evitar el error "Property 'MercadoPago' does not exist on type 'Window'"
declare global {
  interface Window {
    MercadoPago: any;
  }
}

const apiUrl = import.meta.env.VITE_API_URL;
const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY; // Asegurate de tener esto en tu .env

export default function CheckoutButton({ cartData }: { cartData?: any }) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartData || {}),
      });

      const data = await res.json();

      if (res.ok && data.preference_id) {
        setPreferenceId(data.preference_id);
      } else {
        alert("Error al crear orden: " + (data?.message || "desconocido"));
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
      // Inicializar el SDK
      const mp = new window.MercadoPago(publicKey, {
        locale: "es-AR",
      });

      // Renderizar el botón de pago
      mp.bricks().create("wallet", "wallet_container", {
        initialization: {
          preferenceId,
        },
        customization: {
          texts: {
            valueProp: "smart_option",
          },
        },
      });
    }
  }, [preferenceId]);

  return (
    <div>
      {!preferenceId ? (
        <button onClick={handleCheckout} disabled={loading}>
          {loading ? "Procesando..." : "Confirmar Compra"}
        </button>
      ) : (
        <div id="wallet_container" />
      )}
    </div>
  );
}

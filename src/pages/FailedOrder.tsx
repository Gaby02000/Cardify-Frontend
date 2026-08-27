// src/pages/FailedOrder.tsx
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import "./OrderStatus.css";

const FailedOrder = () => {
  const [params] = useSearchParams();
  const { fetchCart } = useCart();

  const orderId = params.get("external_reference");
  const paymentId = params.get("payment_id") || params.get("collection_id");

  useEffect(() => {
    // Registramos el rechazo en el backend (no bloquea la vista).
    if (orderId) {
      api.post(`/orders/${orderId}/confirm`, { payment_id: paymentId }).catch(() => {});
    }
    fetchCart(); // el carrito sigue intacto: se puede reintentar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <main className="ostatus ostatus--fail">
      <div className="ostatus__blob" />
      <div className="ostatus__card">
        <span className="ostatus__icon">
          <XCircle size={34} />
        </span>
        <h1>No pudimos procesar tu compra</h1>
        <p>
          El pago no se completó y no se hizo ningún cargo. Tu carrito quedó
          intacto, así que podés volver a intentarlo cuando quieras.
        </p>
        <Link to="/" className="btn btn-ghost btn-block btn-lg">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
};

export default FailedOrder;

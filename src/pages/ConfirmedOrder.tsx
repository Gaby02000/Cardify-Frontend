// src/pages/ConfirmedOrder.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PartyPopper, Loader2, Clock, XCircle, Copy, Check } from "lucide-react";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import "./OrderStatus.css";

type Code = { gift_card: string; code: string };
type Phase = "loading" | "paid" | "pending" | "failed";

const ConfirmedOrder = () => {
  const [params] = useSearchParams();
  const { fetchCart } = useCart();
  const [phase, setPhase] = useState<Phase>("loading");
  const [codes, setCodes] = useState<Code[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const orderId = params.get("external_reference");
  const paymentId = params.get("payment_id") || params.get("collection_id");

  useEffect(() => {
    if (!orderId) {
      setPhase("failed");
      return;
    }
    let alive = true;

    api
      .post(`/orders/${orderId}/confirm`, { payment_id: paymentId })
      .then((res) => {
        if (!alive) return;
        const status = res.data.status as string;
        if (status === "pagado") {
          setCodes(res.data.codes ?? []);
          setPhase("paid");
        } else if (status === "rechazado" || status === "reembolsado") {
          setPhase("failed");
        } else {
          setPhase("pending");
        }
      })
      .catch(() => alive && setPhase("pending"))
      .finally(() => fetchCart());

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1600);
  };

  const modifier =
    phase === "paid" ? "ostatus--ok" : phase === "failed" ? "ostatus--fail" : "ostatus--wait";

  return (
    <main className={`ostatus ${modifier}`}>
      <div className="ostatus__blob" />
      <div className="ostatus__card">
        {phase === "loading" && (
          <>
            <span className="ostatus__icon">
              <Loader2 size={32} className="ostatus__spin" />
            </span>
            <h1>Confirmando tu pago…</h1>
            <p>Estamos verificando la transacción con Mercado Pago.</p>
          </>
        )}

        {phase === "paid" && (
          <>
            <span className="ostatus__icon">
              <PartyPopper size={34} />
            </span>
            <h1>¡Pago confirmado!</h1>
            <p>Gracias por tu compra. También te enviamos los códigos por email.</p>

            {codes.length > 0 && (
              <ul className="ostatus__codes">
                {codes.map((c, i) => (
                  <li key={i}>
                    <span className="ostatus__code-gc">{c.gift_card}</span>
                    <button className="ostatus__code" onClick={() => copy(c.code)}>
                      <code>{c.code}</code>
                      {copied === c.code ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Link to="/" className="btn btn-primary btn-block btn-lg">
              Volver al inicio
            </Link>
          </>
        )}

        {phase === "pending" && (
          <>
            <span className="ostatus__icon">
              <Clock size={32} />
            </span>
            <h1>Estamos procesando tu pago</h1>
            <p>
              En cuanto se acredite vas a recibir los códigos por email. Podés
              cerrar esta página.
            </p>
            <Link to="/" className="btn btn-ghost btn-block btn-lg">
              Volver al inicio
            </Link>
          </>
        )}

        {phase === "failed" && (
          <>
            <span className="ostatus__icon">
              <XCircle size={32} />
            </span>
            <h1>El pago no se completó</h1>
            <p>No se realizó ningún cargo. Podés intentar la compra de nuevo.</p>
            <Link to="/" className="btn btn-ghost btn-block btn-lg">
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </main>
  );
};

export default ConfirmedOrder;

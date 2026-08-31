// src/pages/MyOrders.tsx
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Package, RefreshCw } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useMyOrders } from "../hooks/useMyOrders";
import type { MyOrder } from "../hooks/useMyOrders";
import "./MyOrders.css";

const money = (n: number | string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(n));

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

type Variant = "ok" | "wait" | "fail" | "muted";

const statusInfo = (status: string): { label: string; variant: Variant } => {
  switch (status) {
    case "pagado":
      return { label: "Pagado", variant: "ok" };
    case "completed":
    case "shipped":
      return { label: "Completado", variant: "ok" };
    case "rechazado":
    case "cancelled":
      return { label: "Rechazado", variant: "fail" };
    case "reembolsado":
    case "refunded":
      return { label: "Reembolsado", variant: "muted" };
    default:
      return { label: "Pendiente", variant: "wait" };
  }
};

const OrderCard = ({ order }: { order: MyOrder }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const { label, variant } = statusInfo(order.status);

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <article className="myorders__card">
      <header className="myorders__head">
        <div>
          <span className="myorders__id">Orden {order.number}</span>
          <span className="myorders__date">{fmtDate(order.created_at)}</span>
        </div>
        <span className={`myorders__badge myorders__badge--${variant}`}>{label}</span>
      </header>

      <ul className="myorders__items">
        {order.items.map((it, i) => (
          <li key={i}>
            <span className="myorders__item-title">{it.title}</span>
            <span className="myorders__item-qty">×{it.quantity}</span>
            <span className="myorders__item-price">{money(it.price)}</span>
          </li>
        ))}
      </ul>

      {order.codes.length > 0 && (
        <div className="myorders__codes">
          <p className="eyebrow">Tus códigos</p>
          <ul>
            {order.codes.map((c, i) => (
              <li key={i}>
                <span className="myorders__code-gc">{c.gift_card}</span>
                <button className="myorders__code" onClick={() => copy(c.code)}>
                  <code>{c.code}</code>
                  {copied === c.code ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="myorders__foot">
        <span>Total</span>
        <b>{money(order.total_price)}</b>
      </footer>
    </article>
  );
};

const MyOrders = () => {
  const { user } = useUser();
  const { orders, loading, error } = useMyOrders();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="myorders section">
      <div className="container">
        <Link to="/" className="myorders__back">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <h1 className="myorders__title">Mis compras</h1>
        <p className="myorders__sub">Tu historial de órdenes y los códigos de cada gift card.</p>

        {loading && (
          <div className="myorders__state">
            <span className="spinner" /> Cargando tus compras…
          </div>
        )}

        {!loading && error && (
          <div className="myorders__state myorders__state--err">
            <RefreshCw size={18} /> No se pudieron cargar tus compras. Probá de nuevo.
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="myorders__empty">
            <Package size={40} strokeWidth={1.5} />
            <p>Todavía no hiciste ninguna compra.</p>
            <Link to="/" className="btn btn-primary">Ver gift cards</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="myorders__list">
            {orders.map((o) => (
              <OrderCard key={o.number} order={o} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;

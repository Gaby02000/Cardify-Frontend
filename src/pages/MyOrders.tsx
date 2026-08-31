// src/pages/MyOrders.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useMyOrders } from "../hooks/useMyOrders";
import type { MyOrder } from "../hooks/useMyOrders";
import "./MyOrders.css";

const PER_PAGE = 10;

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

const STATUS_OPTS = [
  { value: "", label: "Todos los estados" },
  { value: "pagado", label: "Pagado" },
  { value: "pendiente", label: "Pendiente" },
  { value: "rechazado", label: "Rechazado" },
  { value: "reembolsado", label: "Reembolsado" },
];

const SORT_OPTS = [
  { value: "date-desc", label: "Más recientes" },
  { value: "date-asc", label: "Más antiguas" },
  { value: "total-desc", label: "Mayor importe" },
  { value: "total-asc", label: "Menor importe" },
] as const;

const sortParams = (v: string): { sort: "" | "total"; direction: "asc" | "desc" } => {
  switch (v) {
    case "date-asc":
      return { sort: "", direction: "asc" };
    case "total-desc":
      return { sort: "total", direction: "desc" };
    case "total-asc":
      return { sort: "total", direction: "asc" };
    default:
      return { sort: "", direction: "desc" };
  }
};

function pageWindow(current: number, last: number): (number | "dots")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const wanted = new Set([1, last, current, current - 1, current + 1]);
  const nums = [...wanted].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b);
  const out: (number | "dots")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("dots");
    out.push(n);
  });
  return out;
}

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

  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortValue, setSortValue] = useState("date-desc");
  const [page, setPage] = useState(1);

  const { sort, direction } = sortParams(sortValue);

  useEffect(() => {
    setPage(1);
  }, [status, dateFrom, dateTo, sortValue]);

  const { orders, meta, loading, error } = useMyOrders({
    page,
    perPage: PER_PAGE,
    status,
    dateFrom,
    dateTo,
    sort,
    direction,
  });

  const hasFilters = Boolean(status || dateFrom || dateTo || sortValue !== "date-desc");
  const firstLoad = loading && orders.length === 0 && !error;

  const clearAll = () => {
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setSortValue("date-desc");
  };

  const goto = (p: number) => {
    if (p < 1 || p > meta.lastPage || p === meta.currentPage) return;
    setPage(p);
    document.getElementById("myorders-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pages = useMemo(
    () => pageWindow(meta.currentPage, meta.lastPage),
    [meta.currentPage, meta.lastPage]
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="myorders section">
      <div className="container" id="myorders-top">
        <Link to="/" className="myorders__back">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <h1 className="myorders__title">Mis compras</h1>
        <p className="myorders__sub">Tu historial de órdenes y los códigos de cada gift card.</p>

        {/* --- Filtros / orden --- */}
        <div className="myo-toolbar">
          <select
            className="myo-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filtrar por estado"
          >
            {STATUS_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className="myo-date">
            <span>Desde</span>
            <input
              type="date"
              className="myo-input"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>

          <label className="myo-date">
            <span>Hasta</span>
            <input
              type="date"
              className="myo-input"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>

          <select
            className="myo-select"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
            aria-label="Ordenar"
          >
            {SORT_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* --- Resumen --- */}
        <div className="myo-resultbar">
          <span>
            {error
              ? "No se pudieron cargar tus compras."
              : firstLoad
              ? "Cargando…"
              : meta.total === 0
              ? "Sin resultados"
              : `Mostrando ${meta.from}–${meta.to} de ${meta.total}`}
          </span>
          {hasFilters && (
            <button className="myo-chip-clear" onClick={clearAll}>
              <SlidersHorizontal size={14} /> Limpiar filtros
            </button>
          )}
        </div>

        {firstLoad && (
          <div className="myorders__state">
            <span className="spinner" /> Cargando tus compras…
          </div>
        )}

        {!firstLoad && error && (
          <div className="myorders__state myorders__state--err">
            <RefreshCw size={18} /> No se pudieron cargar tus compras. Probá de nuevo.
          </div>
        )}

        {!firstLoad && !error && meta.total === 0 && (
          <div className="myorders__empty">
            <Package size={40} strokeWidth={1.5} />
            <p>
              {hasFilters
                ? "No hay compras con esos filtros."
                : "Todavía no hiciste ninguna compra."}
            </p>
            <Link to="/" className="btn btn-primary">
              Ver gift cards
            </Link>
          </div>
        )}

        {!error && meta.total > 0 && (
          <div className={`myorders__list ${loading ? "is-busy" : ""}`}>
            {orders.map((o) => (
              <OrderCard key={o.number} order={o} />
            ))}
          </div>
        )}

        {!error && meta.lastPage > 1 && (
          <nav className="myo-pagination" aria-label="Paginación">
            <button
              className="myo-page"
              onClick={() => goto(meta.currentPage - 1)}
              disabled={meta.currentPage <= 1}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>

            {pages.map((p, i) =>
              p === "dots" ? (
                <span key={`dots-${i}`} className="myo-page myo-page--dots">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={`myo-page ${p === meta.currentPage ? "is-active" : ""}`}
                  onClick={() => goto(p)}
                  aria-current={p === meta.currentPage ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              className="myo-page"
              onClick={() => goto(meta.currentPage + 1)}
              disabled={meta.currentPage >= meta.lastPage}
              aria-label="Página siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
};

export default MyOrders;

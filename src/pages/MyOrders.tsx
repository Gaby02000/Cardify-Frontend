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

// Agrupa las variantes históricas de estado bajo el valor canónico del filtro.
const STATUS_GROUPS: Record<string, string[]> = {
  pagado: ["pagado", "completed", "shipped", "authorized"],
  pendiente: ["pendiente", "pending", "processing", "in_process"],
  rechazado: ["rechazado", "rejected", "cancelled"],
  reembolsado: ["reembolsado", "refunded", "charged_back"],
};

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
  const offline = typeof navigator !== "undefined" && !navigator.onLine;

  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortValue, setSortValue] = useState("date-desc");
  const [page, setPage] = useState(1);

  const { sort, direction } = sortParams(sortValue);

  // Se trae TODO el historial una vez (o del cache); a partir de acá se
  // filtra, ordena y pagina en memoria, sin más pedidos a la red.
  const { orders: allOrders, loading, error, fromCache } = useMyOrders(user?.id);

  useEffect(() => {
    setPage(1);
  }, [status, dateFrom, dateTo, sortValue]);

  const filtered = useMemo(() => {
    let list = allOrders;

    if (status) {
      const group = STATUS_GROUPS[status] ?? [status];
      list = list.filter((o) => group.includes(o.status));
    }
    if (dateFrom) list = list.filter((o) => o.created_at.slice(0, 10) >= dateFrom);
    if (dateTo) list = list.filter((o) => o.created_at.slice(0, 10) <= dateTo);

    const dir = direction === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const diff =
        sort === "total"
          ? Number(a.total_price) - Number(b.total_price)
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return diff * dir || (a.number - b.number) * dir;
    });
  }, [allOrders, status, dateFrom, dateTo, sort, direction]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, lastPage);
  const from = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const to = Math.min(currentPage * PER_PAGE, total);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const hasFilters = Boolean(status || dateFrom || dateTo || sortValue !== "date-desc");
  const firstLoad = loading && allOrders.length === 0 && !error;

  const clearAll = () => {
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setSortValue("date-desc");
  };

  const goto = (p: number) => {
    if (p < 1 || p > lastPage || p === currentPage) return;
    setPage(p);
    document.getElementById("myorders-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pages = useMemo(
    () => pageWindow(currentPage, lastPage),
    [currentPage, lastPage]
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

        {fromCache && !error && (
          <p className="myo-cache-note">
            Mostrando datos guardados en este dispositivo; pueden estar
            desactualizados.
          </p>
        )}

        {/* --- Resumen --- */}
        <div className="myo-resultbar">
          <span>
            {error
              ? offline
                ? "Sin conexión y todavía no guardamos tus compras."
                : "No se pudieron cargar tus compras."
              : firstLoad
              ? "Cargando…"
              : total === 0
              ? "Sin resultados"
              : `Mostrando ${from}–${to} de ${total}`}
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
            <RefreshCw size={18} />{" "}
            {offline
              ? "Estás sin conexión y todavía no abriste tus compras estando conectado, así que no hay nada guardado."
              : "No se pudieron cargar tus compras. Probá de nuevo."}
          </div>
        )}

        {!firstLoad && !error && total === 0 && (
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

        {!error && total > 0 && (
          <div className="myorders__list">
            {pageItems.map((o) => (
              <OrderCard key={o.number} order={o} />
            ))}
          </div>
        )}

        {!error && lastPage > 1 && (
          <nav className="myo-pagination" aria-label="Paginación">
            <button
              className="myo-page"
              onClick={() => goto(currentPage - 1)}
              disabled={currentPage <= 1}
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
                  className={`myo-page ${p === currentPage ? "is-active" : ""}`}
                  onClick={() => goto(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              className="myo-page"
              onClick={() => goto(currentPage + 1)}
              disabled={currentPage >= lastPage}
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

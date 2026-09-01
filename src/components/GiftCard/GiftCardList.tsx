import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import GiftcardItem from "./GiftCardItem";
import { useGiftcards } from "../../hooks/useGiftcards";
import type { GiftcardSort } from "../../hooks/useGiftcards";
import { useCategories } from "../../hooks/useCategories";
import "./GiftCard.css";

const PER_PAGE = 10;

type SortDef = {
  value: string;
  label: string;
  sort: GiftcardSort;
  direction: "asc" | "desc";
};

const SORTS: SortDef[] = [
  { value: "", label: "Destacadas", sort: "", direction: "asc" },
  { value: "price-asc", label: "Precio: menor a mayor", sort: "price", direction: "asc" },
  { value: "price-desc", label: "Precio: mayor a menor", sort: "price", direction: "desc" },
  { value: "title-asc", label: "Nombre: A → Z", sort: "title", direction: "asc" },
  { value: "title-desc", label: "Nombre: Z → A", sort: "title", direction: "desc" },
  { value: "stock-desc", label: "Más stock", sort: "stock", direction: "desc" },
];

function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

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

const GiftcardList = () => {
  const { categories } = useCategories();
  const offline = typeof navigator !== "undefined" && !navigator.onLine;

  // Se trae TODO el catálogo una vez (o del cache). A partir de acá,
  // buscar / filtrar / ordenar / paginar es en memoria.
  const { giftcards: all, loading, error, fromCache } = useGiftcards();

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput);
  const [category, setCategory] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [page, setPage] = useState(1);

  const sortDef = SORTS.find((s) => s.value === sortValue) ?? SORTS[0];

  useEffect(() => {
    setPage(1);
  }, [search, category, sortValue]);

  const filtered = useMemo(() => {
    let list = all;

    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter((g) =>
        `${g.title} ${g.description}`.toLowerCase().includes(term)
      );
    }
    if (category) {
      list = list.filter((g) => String(g.id_category) === category);
    }

    const dir = sortDef.direction === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      let diff: number;
      switch (sortDef.sort) {
        case "price":
          diff = Number(a.price) - Number(b.price);
          break;
        case "stock":
          diff = a.stock - b.stock;
          break;
        case "title":
          diff = a.title.localeCompare(b.title, "es");
          break;
        default:
          return b.id - a.id; // "Destacadas": novedades primero
      }
      return diff * dir || b.id - a.id;
    });
  }, [all, search, category, sortDef.sort, sortDef.direction]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, lastPage);
  const from = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const to = Math.min(currentPage * PER_PAGE, total);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const hasFilters = Boolean(searchInput || category || sortValue);
  const firstLoad = loading && all.length === 0 && !error;

  const clearAll = () => {
    setSearchInput("");
    setCategory("");
    setSortValue("");
  };

  const goto = (p: number) => {
    if (p < 1 || p > lastPage || p === currentPage) return;
    setPage(p);
    document.getElementById("giftcards")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pages = useMemo(() => pageWindow(currentPage, lastPage), [currentPage, lastPage]);

  return (
    <div>
      {/* --- Filtros / orden --- */}
      <div className="gc-toolbar">
        <div className="gc-search">
          <Search size={17} />
          <input
            className="input"
            type="text"
            inputMode="search"
            placeholder="Buscar gift cards…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              className="gc-search__clear"
              onClick={() => setSearchInput("")}
              aria-label="Limpiar búsqueda"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="gc-selects">
          <select
            className="gc-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="gc-select"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
            aria-label="Ordenar"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fromCache && !error && (
        <p className="gc-cache-note">
          Mostrando el catálogo guardado en este dispositivo; puede estar
          desactualizado.
        </p>
      )}

      {/* --- Resumen --- */}
      <div className="gc-resultbar">
        <span>
          {error
            ? offline
              ? "Sin conexión y todavía no guardamos el catálogo."
              : "No se pudieron cargar las gift cards."
            : firstLoad
            ? "Cargando…"
            : total === 0
            ? "Sin resultados"
            : `Mostrando ${from}–${to} de ${total}`}
        </span>
        {hasFilters && (
          <button className="gc-chip-clear" onClick={clearAll}>
            <SlidersHorizontal size={14} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* --- Grid --- */}
      {firstLoad ? (
        <div className="gc-grid">
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div key={i} className="skeleton gc-skeleton" />
          ))}
        </div>
      ) : error || total === 0 ? (
        <p className="gc-empty">
          {error
            ? offline
              ? "Estás sin conexión y todavía no abriste la tienda estando conectado, así que no hay catálogo guardado."
              : "Hubo un problema al cargar las gift cards. Probá de nuevo."
            : "No encontramos gift cards con esos filtros."}
        </p>
      ) : (
        <div className="gc-grid">
          {pageItems.map((g) => (
            <GiftcardItem key={g.id} giftcard={g} />
          ))}
        </div>
      )}

      {/* --- Paginación --- */}
      {!error && lastPage > 1 && (
        <nav className="gc-pagination" aria-label="Paginación">
          <button
            className="gc-page"
            onClick={() => goto(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {pages.map((p, i) =>
            p === "dots" ? (
              <span key={`dots-${i}`} className="gc-page gc-page--dots">
                …
              </span>
            ) : (
              <button
                key={p}
                className={`gc-page ${p === currentPage ? "is-active" : ""}`}
                onClick={() => goto(p)}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            className="gc-page"
            onClick={() => goto(currentPage + 1)}
            disabled={currentPage >= lastPage}
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default GiftcardList;

// src/components/Catalog/CatalogBrowser.tsx
// Cambia entre "Por categoría" (vista por defecto) y "Todo el catálogo"
// (lista completa con buscador, filtros y paginación).
import { lazy, Suspense, useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import CategoryGrid from "./CategoryGrid";
import "./CatalogBrowser.css";

const GiftCardList = lazy(() => import("../GiftCard/GiftCardList"));

type Mode = "categoria" | "todo";
const STORE_KEY = "catalog-view";

const readMode = (): Mode => {
  try {
    return localStorage.getItem(STORE_KEY) === "todo" ? "todo" : "categoria";
  } catch {
    return "categoria";
  }
};

const CatalogBrowser = () => {
  const [mode, setMode] = useState<Mode>(readMode);
  // Una vez abierta la lista completa, se mantiene montada (oculta) para no
  // perder la búsqueda / página al volver.
  const [seenTodo, setSeenTodo] = useState(mode === "todo");

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, mode);
    } catch {
      /* noop */
    }
  }, [mode]);

  const pick = (next: Mode) => {
    if (next === "todo") setSeenTodo(true);
    setMode(next);
  };

  return (
    <div className="catalog">
      <div
        className="catalog__switch"
        role="tablist"
        aria-label="Vista del catálogo"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "categoria"}
          className={`catalog__tab ${mode === "categoria" ? "is-active" : ""}`}
          onClick={() => pick("categoria")}
        >
          <LayoutGrid size={16} /> Por categoría
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "todo"}
          className={`catalog__tab ${mode === "todo" ? "is-active" : ""}`}
          onClick={() => pick("todo")}
        >
          <List size={16} /> Todo el catálogo
        </button>
      </div>

      <div hidden={mode !== "categoria"}>
        <CategoryGrid />
      </div>

      {seenTodo && (
        <div hidden={mode !== "todo"}>
          <Suspense
            fallback={<div className="catalog__loading" aria-hidden="true" />}
          >
            <GiftCardList />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default CatalogBrowser;

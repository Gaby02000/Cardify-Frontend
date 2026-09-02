// src/components/Catalog/CategoryGrid.tsx
// Vista por categoría: una tarjeta grande por categoría, con la imagen de
// una de sus gift cards ya precargada (loading eager + <link rel=preload>).
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { useGiftcards } from "../../hooks/useGiftcards";
import { money } from "../../lib/money";
import "./CategoryGrid.css";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/apis\/?$/, "");

const resolveImage = (image?: string | null) => {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
};

// Cuántas imágenes se precargan de entrada (primera fila aprox.).
const PRELOAD = 6;

interface CatCard {
  id: number;
  name: string;
  image: string | null;
  count: number;
  from: number | null;
}

const CategoryGrid = () => {
  const { categories, loading: catsLoading } = useCategories();
  const { giftcards, loading: gcLoading, error } = useGiftcards();

  const cards = useMemo<CatCard[]>(
    () =>
      categories.map((c) => {
        const items = giftcards.filter(
          (g) => String(g.id_category) === String(c.id)
        );
        // Imagen representativa: la del ítem más nuevo con stock e imagen.
        const byNewest = [...items].sort((a, b) => b.id - a.id);
        const hero =
          byNewest.find((g) => g.stock > 0 && g.image) ??
          byNewest.find((g) => g.image);
        const prices = items
          .map((g) => Number(g.final_price ?? g.price))
          .filter((n) => n > 0);

        return {
          id: c.id,
          name: c.name,
          image: resolveImage(c.icon) ?? resolveImage(hero?.image) ?? null,
          count: items.length,
          from: prices.length ? Math.min(...prices) : null,
        };
      }),
    [categories, giftcards]
  );

  // Precarga real de las primeras imágenes con <link rel="preload">.
  useEffect(() => {
    const hrefs = cards
      .map((c) => c.image)
      .filter((src): src is string => Boolean(src))
      .slice(0, PRELOAD);

    const links = hrefs.map((href) => {
      const el = document.createElement("link");
      el.rel = "preload";
      el.as = "image";
      el.href = href;
      el.setAttribute("fetchpriority", "high");
      document.head.appendChild(el);
      return el;
    });

    return () => links.forEach((el) => el.remove());
  }, [cards]);

  const loading = catsLoading && categories.length === 0;

  if (loading) {
    return (
      <div className="catgrid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton catgrid__sk" />
        ))}
      </div>
    );
  }

  if (!cards.length) {
    return (
      <p className="catgrid__empty">
        {error
          ? "No se pudieron cargar las categorías. Probá de nuevo con conexión."
          : "Todavía no hay categorías para mostrar."}
      </p>
    );
  }

  return (
    <div className="catgrid">
      {cards.map((c, i) => (
        <Link key={c.id} to={`/categoria/${c.id}`} className="catcard">
          <div className="catcard__media">
            {c.image ? (
              <img
                src={c.image}
                alt={c.name}
                width={480}
                height={300}
                loading={i < PRELOAD ? "eager" : "lazy"}
                fetchPriority={i < PRELOAD ? "high" : "auto"}
                decoding="async"
              />
            ) : (
              <span className="catcard__ph">
                <Package size={30} strokeWidth={1.2} />
              </span>
            )}
          </div>
          <div className="catcard__body">
            <h3 className="catcard__name">{c.name}</h3>
            <p className="catcard__meta">
              {gcLoading && c.count === 0
                ? "Cargando…"
                : `${c.count} ${c.count === 1 ? "tarjeta" : "tarjetas"}` +
                  (c.from != null ? ` · desde ${money(c.from)}` : "")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;

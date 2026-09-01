// src/pages/CategoryPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  Zap,
  Check,
  Package,
} from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { useGiftcards } from "../hooks/useGiftcards";
import { useCart } from "../context/CartContext";
import type { GiftCard } from "../components/GiftCard/types";
import "./CategoryPage.css";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/apis\/?$/, "");

const resolveImage = (image?: string) => {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
};

const money = (n: number | string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n));

const CategoryPage = () => {
  const { id } = useParams();
  const { categories, loading: catsLoading } = useCategories();
  const { giftcards, loading: gcLoading, error } = useGiftcards();
  const { addToCart } = useCart();

  const category = useMemo(
    () => categories.find((c) => String(c.id) === id),
    [categories, id]
  );

  const options = useMemo<GiftCard[]>(
    () =>
      giftcards
        .filter((g) => String(g.id_category) === id)
        .sort((a, b) => Number(a.price) - Number(b.price)),
    [giftcards, id]
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  // Al cargar las opciones (o cambiar de categoría), seleccionar la más barata.
  useEffect(() => {
    if (options.length && !options.some((o) => o.id === selectedId)) {
      setSelectedId(options[0].id);
      setQty(1);
    }
  }, [options, selectedId]);

  const selected = options.find((o) => o.id === selectedId) ?? null;

  const heroImg =
    resolveImage(category?.icon) ?? resolveImage(options[0]?.image) ?? null;

  const catsReady = !catsLoading || categories.length > 0;
  const gcReady = !gcLoading || giftcards.length > 0;

  // Ya cargaron las categorías y esta no existe.
  if (catsReady && categories.length > 0 && !category) {
    return <Navigate to="/" replace />;
  }

  const outOfStock = !selected || selected.stock <= 0;
  const atMax = selected != null && qty >= selected.stock;

  const handleAdd = () => {
    if (!selected || outOfStock) return;
    addToCart({
      giftcardId: selected.id,
      title: selected.title,
      price: Number(selected.price),
      quantity: qty,
      image: selected.image,
      stock: selected.stock,
    });
  };

  return (
    <main className="catp section">
      <div className="container">
        <Link to="/" className="catp__back">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <div className="catp__grid">
          {/* --- Imagen --- */}
          <div className="catp__media">
            {heroImg ? (
              <img src={heroImg} alt={category?.name ?? ""} loading="lazy" />
            ) : (
              <span className="catp__media-ph">
                <Package size={54} strokeWidth={1.1} />
              </span>
            )}
          </div>

          {/* --- Detalle --- */}
          <div className="catp__detail">
            <h1 className="catp__title">
              {category?.name ?? (catsReady ? "Categoría" : "Cargando…")}
            </h1>

            <div className="catp__badges">
              <span className="badge">
                <Zap size={13} /> Entrega inmediata
              </span>
              <span className="badge">
                <ShieldCheck size={13} /> Pago seguro
              </span>
            </div>

            {!gcReady ? (
              <div className="catp__opts">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton catp__opt-sk" />
                ))}
              </div>
            ) : error && options.length === 0 ? (
              <p className="catp__empty">
                No se pudo cargar el catálogo. Probá de nuevo con conexión.
              </p>
            ) : options.length === 0 ? (
              <p className="catp__empty">
                Esta categoría todavía no tiene tarjetas disponibles.
              </p>
            ) : (
              <>
                <div className="catp__opts">
                  {options.map((o) => {
                    const active = o.id === selectedId;
                    const soldout = o.stock <= 0;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        className={`catp__opt ${active ? "is-active" : ""} ${
                          soldout ? "is-soldout" : ""
                        }`}
                        onClick={() => {
                          setSelectedId(o.id);
                          setQty(1);
                        }}
                        disabled={soldout}
                      >
                        <span className="catp__opt-name">
                          {o.title}
                          {active && <Check size={13} />}
                        </span>
                        <span className="catp__opt-price">
                          {soldout ? "Sin stock" : money(o.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selected && (
                  <div className="catp__buy">
                    <div className="catp__price">
                      <span className="catp__price-label">Precio</span>
                      <b>{money(selected.price)}</b>
                      <span className="catp__price-note">
                        Impuestos incluidos · {selected.title}
                      </span>
                    </div>

                    <div className="catp__row">
                      <div className="catp__qty">
                        <button
                          type="button"
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          disabled={qty <= 1}
                          aria-label="Restar uno"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty((q) => q + 1)}
                          disabled={atMax}
                          aria-label="Sumar uno"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-lg catp__add"
                        onClick={handleAdd}
                        disabled={outOfStock}
                      >
                        {outOfStock ? "Sin stock" : "Agregar al carrito"}
                      </button>
                    </div>

                    {selected.stock > 0 && selected.stock <= 5 && (
                      <p className="catp__stock">¡Quedan {selected.stock}!</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;

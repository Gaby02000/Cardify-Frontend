import React, { useState } from "react";
import { Info, Plus, RotateCcw } from "lucide-react";
import type { GiftCard } from "./types";
import { useCart } from "../../context/CartContext";
import "./GiftCard.css";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/apis\/?$/, "");

const resolveImage = (image?: string) => {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
};

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

interface Props {
  giftcard: GiftCard;
}

const GiftcardItem: React.FC<Props> = ({ giftcard }) => {
  const [flipped, setFlipped] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const { addToCart } = useCart();

  const img = resolveImage(giftcard.image);
  const lowStock = giftcard.stock > 0 && giftcard.stock <= 5;
  const outOfStock = giftcard.stock <= 0;

  return (
    <article className={`gc ${flipped ? "is-flipped" : ""}`}>
      <div className="gc__flipper">
        {/* Front */}
        <div className="gc__face gc__face--front">
          <div className="gc__media">
            {giftcard.category?.name && (
              <span className="badge badge-lime gc__chip">{giftcard.category.name}</span>
            )}
            <button
              className="gc__info"
              onClick={() => setFlipped(true)}
              aria-label="Ver detalle"
            >
              <Info size={16} />
            </button>
            {img && imgOk && (
              <img
                src={img}
                alt={giftcard.title}
                loading="lazy"
                onError={() => setImgOk(false)}
              />
            )}
          </div>

          <div className="gc__body">
            <h3 className="gc__title">{giftcard.title}</h3>

            <div className="gc__meta">
              <span className="gc__price">{money(giftcard.price)}</span>
              {giftcard.amount && (
                <span className="gc__balance">Saldo {money(Number(giftcard.amount))}</span>
              )}
            </div>

            <span className={`gc__stock ${lowStock ? "is-low" : ""}`}>
              {outOfStock
                ? "Sin stock"
                : lowStock
                ? `¡Quedan ${giftcard.stock}!`
                : "En stock"}
            </span>

            <button
              className="btn btn-primary btn-block"
              disabled={outOfStock}
              onClick={() =>
                addToCart({
                  giftcardId: giftcard.id,
                  title: giftcard.title,
                  price: giftcard.price,
                  quantity: 1,
                  image: giftcard.image,
                })
              }
            >
              <Plus size={16} /> Agregar
            </button>
          </div>
        </div>

        {/* Back */}
        <div className="gc__face gc__face--back">
          <h3>{giftcard.title}</h3>
          <p>{giftcard.description || "Sin descripción disponible."}</p>
          <p>
            <strong>{money(giftcard.price)}</strong>
            {giftcard.amount && ` · saldo ${money(Number(giftcard.amount))}`}
          </p>
          <button className="btn btn-ghost" onClick={() => setFlipped(false)}>
            <RotateCcw size={15} /> Volver
          </button>
        </div>
      </div>
    </article>
  );
};

export default GiftcardItem;

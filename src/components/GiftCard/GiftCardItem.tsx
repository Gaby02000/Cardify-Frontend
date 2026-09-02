import React, { useState } from "react";
import { Info, Plus, RotateCcw } from "lucide-react";
import type { GiftCard } from "./types";
import { useCart } from "../../context/CartContext";
import { money } from "../../lib/money";
import "./GiftCard.css";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/apis\/?$/, "");

const resolveImage = (image?: string) => {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
};


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

  const listPrice = Number(giftcard.price);
  const finalPrice = Number(giftcard.final_price ?? giftcard.price);
  const hasDiscount = Boolean(giftcard.has_discount) && finalPrice < listPrice;

  return (
    <article className={`gc ${flipped ? "is-flipped" : ""}`}>
      <div className="gc__flipper">
        {/* Front */}
        <div className="gc__face gc__face--front">
          <div className="gc__media">
            {giftcard.category?.name && (
              <span className="badge badge-lime gc__chip">{giftcard.category.name}</span>
            )}
            {hasDiscount && (
              <span className="gc__off">-{giftcard.discount_percent}%</span>
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
              <span className="gc__price">
                {money(finalPrice)}
                {hasDiscount && <s className="gc__price-old">{money(listPrice)}</s>}
              </span>
            </div>

            {(outOfStock || lowStock) && (
              <span className={`gc__stock ${lowStock ? "is-low" : ""}`}>
                {outOfStock ? "Sin stock" : `¡Quedan ${giftcard.stock}!`}
              </span>
            )}

            <button
              className="btn btn-primary btn-block"
              disabled={outOfStock}
              onClick={() =>
                addToCart({
                  giftcardId: giftcard.id,
                  title: giftcard.title,
                  price: finalPrice,
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
          <h3 className="gc__back-title">{giftcard.title}</h3>
          {giftcard.category?.name && (
            <span className="gc__back-cat">{giftcard.category.name}</span>
          )}
          <div className="gc__back-price">
            <b>{money(finalPrice)}</b>
            {hasDiscount && <s>{money(listPrice)}</s>}
          </div>
          <button className="btn btn-ghost" onClick={() => setFlipped(false)}>
            <RotateCcw size={15} /> Volver
          </button>
        </div>
      </div>
    </article>
  );
};

export default GiftcardItem;

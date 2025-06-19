import React, { useState } from "react";
import type { GiftCard } from "./types";
import { useCart } from "../../hooks/useCart";

interface Props {
  giftcard: GiftCard;
}

const GiftcardItem: React.FC<Props> = ({ giftcard }) => {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();

  return (
    <div
      style={{
        perspective: 1000,
        width: "100%",
        maxWidth: 250,
        height: 350,
      }}
    >
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          textAlign: "center",
          transition: "transform 0.8s",
          transformStyle: "preserve-3d",
          cursor: "pointer",
          borderRadius: "var(--radius)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          backgroundColor: "var(--color-surface)",
          boxShadow: "0 4px 15px rgba(187, 134, 252, 0.4)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "var(--radius)",
            padding: "var(--spacing-md)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={giftcard.image || "https://via.placeholder.com/150"}
              alt={giftcard.title}
              style={{
                width: 150,
                height: 150,
                borderRadius: 12,
                objectFit: "cover",
              }}
            />
            {giftcard.originalPrice && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "crimson",
                  color: "white",
                  fontSize: 12,
                  padding: "2px 6px",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                Ahorra ${giftcard.originalPrice - giftcard.price}
              </span>
            )}
            {giftcard.popular && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-bg)",
                  fontSize: 12,
                  padding: "2px 6px",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                ⭐ Popular
              </span>
            )}
          </div>

          <div>
            <h2>{giftcard.title}</h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
              <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "var(--color-primary)" }}>
                ${giftcard.price}
              </span>
              {giftcard.originalPrice && (
                <span style={{ textDecoration: "line-through", color: "var(--color-muted)", fontSize: "0.9rem" }}>
                  ${giftcard.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                giftcardId: giftcard.id,
                title: giftcard.title,
                price: giftcard.price,
                quantity: 1,
                image: giftcard.image,
              });
            }}
          >
            Agregar al carrito
          </button>
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "var(--radius)",
            backgroundColor: "var(--color-primary-dark)",
            color: "var(--color-text)",
            padding: "var(--spacing-md)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Detalle de {giftcard.title}</h2>
          <p>Precio: ${giftcard.price}</p>
          <p>{giftcard.description || "Sin descripción disponible."}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFlipped(false);
            }}
            style={{
              marginTop: "var(--spacing-md)",
              padding: "8px 16px",
              borderRadius: "var(--radius)",
              border: "none",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-bg)",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftcardItem;

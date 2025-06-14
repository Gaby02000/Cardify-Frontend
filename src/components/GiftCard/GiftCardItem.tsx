import React, { useState } from "react";
import type { GiftCard } from "./types";

interface Props {
  giftcard: GiftCard;
}

const GiftcardItem: React.FC<Props> = ({ giftcard }) => {
  const [flipped, setFlipped] = useState(false);

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
          boxShadow: "0 4px 15px rgba(154, 93, 232, 0.5)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "var(--spacing-md)",
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={giftcard.image || "https://via.placeholder.com/150"}
            alt={giftcard.title}
            style={{
              width: 150,
              height: 150,
              borderRadius: 12,
              marginBottom: "var(--spacing-md)",
              transition: "transform 0.3s ease",
            }}
          />
          <h2>{giftcard.title}</h2>
          <p style={{ marginTop: "var(--spacing-sm)", fontSize: 18 }}>
            Precio: ${giftcard.price}
          </p>
          <p
            style={{
              marginTop: "var(--spacing-md)",
              fontSize: 14,
              color: "var(--color-muted)",
            }}
          >
            (Click en la tarjeta para ver detalle)
          </p>
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "var(--radius)",
            backgroundColor: "var(--color-primary-dark)",
            color: "var(--color-text)",
            transform: "rotateY(180deg)",
            padding: "var(--spacing-md)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)",
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

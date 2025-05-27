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
        width: 250,
        height: 350,
        margin: 15,
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
          borderRadius: 16,
          boxShadow: "0 4px 15px rgba(154, 93, 232, 0.5)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          backgroundColor: "#1e1e1e",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {/* Front side */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={giftcard.iconUrl || "https://via.placeholder.com/150"}
            alt={giftcard.title}
            style={{
              width: 150,
              height: 150,
              borderRadius: 12,
              marginBottom: 20,
              transition: "transform 0.3s ease",
            }}
          />
          <h2>{giftcard.title}</h2>
          <p style={{ marginTop: 8, fontSize: 18 }}>Precio: ${giftcard.price}</p>
          <p style={{ marginTop: 12, fontSize: 14, color: "#aaa" }}>
            (Click en la tarjeta para ver detalle)
          </p>
        </div>

        {/* Back side */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: 16,
            backgroundColor: "#3a1e7e",
            color: "#eee",
            transform: "rotateY(180deg)",
            padding: 20,
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
              e.stopPropagation(); // para que no gire al hacer click en el botón
              setFlipped(false);
            }}
            style={{
              marginTop: 20,
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#BB86FC",
              color: "#1e1e1e",
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

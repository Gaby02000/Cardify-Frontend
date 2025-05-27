// giftcard/giftcarddetail.tsx
import React from "react";
import type{ GiftCard } from "./types";

interface Props {
  giftcard: GiftCard;
}

const GiftcardDetail: React.FC<Props> = ({ giftcard }) => {
  return (
    <div style={{ padding: 20, border: "1px solid #ccc" }}>
      <h2>{giftcard.title}</h2>
      <img
        src={`http://localhost:8000/${giftcard.image}`}
        alt={giftcard.title}
        style={{ maxWidth: 300 }}
      />
      <p><strong>Descripción:</strong> {giftcard.description}</p>
      <p><strong>Precio:</strong> ${giftcard.price}</p>
      <p><strong>Monto:</strong> {giftcard.amount}</p>
      <p><strong>Stock disponible:</strong> {giftcard.stock}</p>
      <p><strong>Categoría:</strong> {giftcard.category.name}</p>
      <p><em>Creado: {new Date(giftcard.created_at).toLocaleString()}</em></p>
    </div>
  );
};

export default GiftcardDetail;

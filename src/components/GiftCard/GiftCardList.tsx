import React, { useEffect, useState } from "react";
import type { GiftCard, GiftcardPagination } from "./types";
import GiftcardItem from "./GiftCardItem";

const GiftcardList = () => {
  const [giftcards, setGiftcards] = useState<GiftCard[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/giftcards`)
      .then((res) => res.json())
      .then((data: GiftcardPagination) => {
        setGiftcards(data.data);
      });
  }, []);

  if (!giftcards.length) return <div>Cargando giftcards...</div>;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#121212",
        padding: 40,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gridAutoRows: "1fr",       // filas que se ajustan automáticamente para llenar altura
        gap: 30,
        justifyItems: "stretch",   // que las tarjetas ocupen todo el ancho disponible de su celda
        alignContent: "stretch",   // que el grid llene todo el alto posible
        overflowY: "auto",         // scroll vertical si hay muchas tarjetas
      }}
    >
      {giftcards.map((giftcard) => (
        <GiftcardItem key={giftcard.id} giftcard={giftcard} />
      ))}
    </div>
  );
};

export default GiftcardList;

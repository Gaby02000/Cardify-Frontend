import { useEffect, useState } from "react";
import type { GiftCard, GiftcardPagination } from "../components/GiftCard/types";
const apiUrl = import.meta.env.VITE_API_URL;

export function useGiftcards() {
  const [giftcards, setGiftcards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/giftcards`)
      .then((res) => {
        if (!res.ok) throw new Error("Error de servidor");
        return res.json();
      })
      .then((data: GiftcardPagination) => {
        setGiftcards(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar giftcards:", error);
        setLoading(false);
      });
  }, []);

  return { giftcards, loading };
}

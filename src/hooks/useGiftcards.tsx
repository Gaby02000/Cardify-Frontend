import { useEffect, useState } from "react";
import type { GiftCard, GiftcardPagination } from "../components/GiftCard/types";

const apiUrl = import.meta.env.VITE_API_URL;

export interface GiftcardQuery {
  page?: number;
  perPage?: number;
  category?: string; // id de categoría; "" = todas
  search?: string;
  sort?: "" | "price" | "title" | "stock";
  direction?: "asc" | "desc";
}

export interface GiftcardMeta {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
}

const EMPTY_META: GiftcardMeta = {
  currentPage: 1,
  lastPage: 1,
  total: 0,
  from: 0,
  to: 0,
};

export function useGiftcards(query: GiftcardQuery = {}) {
  const {
    page = 1,
    perPage = 10,
    category = "",
    search = "",
    sort = "",
    direction = "asc",
  } = query;

  const [giftcards, setGiftcards] = useState<GiftCard[]>([]);
  const [meta, setMeta] = useState<GiftcardMeta>(EMPTY_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    if (category) params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    if (sort) {
      params.set("sort", sort);
      params.set("direction", direction);
    }

    const ctrl = new AbortController();
    setLoading(true);
    setError(false);

    fetch(`${apiUrl}/giftcards?${params.toString()}`, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Error de servidor");
        return res.json();
      })
      .then((data: GiftcardPagination) => {
        setGiftcards(data.data ?? []);
        setMeta({
          currentPage: data.current_page ?? 1,
          lastPage: data.last_page ?? 1,
          total: data.total ?? 0,
          from: data.from ?? 0,
          to: data.to ?? 0,
        });
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error("Error al cargar giftcards:", err);
        setError(true);
        setGiftcards([]);
        setMeta(EMPTY_META);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [page, perPage, category, search, sort, direction]);

  return { giftcards, meta, loading, error };
}

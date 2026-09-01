// src/hooks/useGiftcards.tsx
// Trae TODO el catálogo una sola vez y lo guarda en localStorage. El
// buscador / filtro / orden / paginación se hacen en memoria en la lista,
// así se puede navegar y filtrar sin conexión una vez cargado.
import { useCallback, useEffect, useState } from "react";
import type { GiftCard, GiftcardPagination } from "../components/GiftCard/types";

const apiUrl = import.meta.env.VITE_API_URL;

export type GiftcardSort = "" | "price" | "title" | "stock";

export const GIFTCARDS_CACHE_KEY = "giftcards";

type CacheShape = { savedAt: string; giftcards: GiftCard[] };

function readCache(): GiftCard[] | null {
  try {
    const raw = localStorage.getItem(GIFTCARDS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    return Array.isArray(parsed?.giftcards) ? parsed.giftcards : null;
  } catch {
    return null;
  }
}

function writeCache(giftcards: GiftCard[]) {
  try {
    const payload: CacheShape = { savedAt: new Date().toISOString(), giftcards };
    localStorage.setItem(GIFTCARDS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* storage lleno / bloqueado */
  }
}

export function useGiftcards() {
  const [giftcards, setGiftcards] = useState<GiftCard[]>(() => readCache() ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(false);

    try {
      const all: GiftCard[] = [];
      let page = 1;
      let lastPage = 1;

      do {
        const res = await fetch(
          `${apiUrl}/giftcards?per_page=1000&page=${page}`,
          { signal }
        );
        if (!res.ok) throw new Error("Error de servidor");
        const data: GiftcardPagination = await res.json();
        all.push(...(data.data ?? []));
        lastPage = data.last_page ?? 1;
        page += 1;
      } while (page <= lastPage);

      setGiftcards(all);
      setFromCache(false);
      writeCache(all);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === "AbortError") return;
      const cached = readCache();
      if (cached) {
        setGiftcards(cached);
        setFromCache(true);
      } else {
        setError(true);
        setGiftcards([]);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  return { giftcards, loading, error, fromCache, refetch: () => load() };
}

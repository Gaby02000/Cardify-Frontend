// src/hooks/useMyOrders.tsx
// Trae TODO el historial de compras del usuario una sola vez y lo guarda en
// localStorage. El filtrado / orden / paginación se hace en memoria en la
// página, así se puede manipular sin conexión sin pegarle a la red.
import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";

export interface MyOrderCode {
  gift_card: string;
  code: string;
}

export interface MyOrderItem {
  title: string;
  image?: string | null;
  quantity: number;
  price: number | string;
  line_total?: number | string;
}

export interface MyOrder {
  number: number; // correlativo por usuario (1, 2, 3...), no el id real
  status: string;
  total_price: number | string;
  created_at: string;
  codes: MyOrderCode[];
  items: MyOrderItem[];
}

export const ORDERS_CACHE_KEY = "my-orders";

type CacheShape = { userId: number; savedAt: string; orders: MyOrder[] };

function readCache(userId?: number): MyOrder[] | null {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(ORDERS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (!parsed || parsed.userId !== userId || !Array.isArray(parsed.orders)) {
      return null;
    }
    return parsed.orders;
  } catch {
    return null;
  }
}

const idle: (cb: () => void) => void =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? (cb) => window.requestIdleCallback(cb, { timeout: 2000 })
    : (cb) => setTimeout(cb, 1);

function writeCache(userId: number, orders: MyOrder[]) {
  idle(() => {
    try {
      const payload: CacheShape = {
        userId,
        savedAt: new Date().toISOString(),
        orders,
      };
      localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(payload));
    } catch {
      /* storage lleno / bloqueado: seguimos solo en memoria */
    }
  });
}

export function clearOrdersCache() {
  try {
    localStorage.removeItem(ORDERS_CACHE_KEY);
  } catch {
    /* noop */
  }
}

export function useMyOrders(userId?: number) {
  const [orders, setOrders] = useState<MyOrder[]>(() => readCache(userId) ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!userId) return;
      setLoading(true);
      setError(false);

      try {
        const all: MyOrder[] = [];
        let page = 1;
        let lastPage = 1;

        do {
          const { data } = await api.get(`/orders`, {
            params: { per_page: 1000, page },
            signal,
          });
          all.push(...((data?.data ?? []) as MyOrder[]));
          lastPage = data?.last_page ?? 1;
          page += 1;
        } while (page <= lastPage);

        setOrders(all);
        setFromCache(false);
        writeCache(userId, all);
      } catch (err: unknown) {
        if ((err as { code?: string })?.code === "ERR_CANCELED") return;
        const cached = readCache(userId);
        if (cached) {
          setOrders(cached);
          setFromCache(true);
        } else {
          setError(true);
          setOrders([]);
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  return { orders, loading, error, fromCache, refetch: () => load() };
}

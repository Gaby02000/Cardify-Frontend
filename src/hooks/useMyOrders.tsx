// src/hooks/useMyOrders.tsx
import { useEffect, useState } from "react";
import api from "../lib/api";

export interface MyOrderCode {
  gift_card: string;
  code: string;
}

export interface MyOrderItem {
  title: string;
  quantity: number;
  price: number | string;
}

export interface MyOrder {
  number: number; // correlativo por usuario (1, 2, 3...), no el id real
  status: string;
  total_price: number | string;
  created_at: string;
  codes: MyOrderCode[];
  items: MyOrderItem[];
}

export function useMyOrders() {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(false);

    api
      .get("/orders", { signal: ctrl.signal })
      .then((res) => setOrders(res.data.orders ?? []))
      .catch((err) => {
        if (err?.code === "ERR_CANCELED") return;
        console.error("No se pudieron cargar las compras", err);
        setError(true);
        setOrders([]);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, []);

  return { orders, loading, error };
}

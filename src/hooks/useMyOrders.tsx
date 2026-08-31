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

export interface MyOrdersQuery {
  page?: number;
  perPage?: number;
  status?: string; // "" = todos
  dateFrom?: string; // yyyy-mm-dd
  dateTo?: string; // yyyy-mm-dd
  sort?: "" | "total"; // "" = fecha
  direction?: "asc" | "desc";
}

export interface MyOrdersMeta {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
}

const EMPTY_META: MyOrdersMeta = {
  currentPage: 1,
  lastPage: 1,
  total: 0,
  from: 0,
  to: 0,
};

export function useMyOrders(query: MyOrdersQuery = {}) {
  const {
    page = 1,
    perPage = 10,
    status = "",
    dateFrom = "",
    dateTo = "",
    sort = "",
    direction = "desc",
  } = query;

  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [meta, setMeta] = useState<MyOrdersMeta>(EMPTY_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    if (status) params.set("status", status);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (sort) params.set("sort", sort);
    params.set("direction", direction);

    const ctrl = new AbortController();
    setLoading(true);
    setError(false);

    api
      .get(`/orders?${params.toString()}`, { signal: ctrl.signal })
      .then((res) => {
        const d = res.data ?? {};
        setOrders(d.data ?? []);
        setMeta({
          currentPage: d.current_page ?? 1,
          lastPage: d.last_page ?? 1,
          total: d.total ?? 0,
          from: d.from ?? 0,
          to: d.to ?? 0,
        });
      })
      .catch((err) => {
        if (err?.code === "ERR_CANCELED") return;
        console.error("No se pudieron cargar las compras", err);
        setError(true);
        setOrders([]);
        setMeta(EMPTY_META);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [page, perPage, status, dateFrom, dateTo, sort, direction]);

  return { orders, meta, loading, error };
}

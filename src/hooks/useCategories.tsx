// src/hooks/useCategories.tsx
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;
const CACHE_KEY = "categories";

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

function readCache(): Category[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const normalize = (data: unknown): Category[] => {
  if (Array.isArray(data)) return data as Category[];
  if (data && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: Category[] }).data;
  }
  return [];
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(() => readCache());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();

    fetch(`${apiUrl}/categories`, { signal: ctrl.signal })
      .then((res) => res.json())
      .then((data) => {
        const list = normalize(data);
        setCategories(list);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {
          /* noop */
        }
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Categorías: usando copia guardada", err?.message);
        setCategories(readCache());
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, []);

  return { categories, loading };
};

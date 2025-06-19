// src/hooks/useCategories.tsx
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/categories`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Categorías recibidas:", data); // 👈 LOG
        // Ajustar esto según lo que devuelva tu API
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Formato inesperado:", data);
          setCategories([]);
        }
      })
      .catch((err) => console.error("Error cargando categorías", err))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
};

// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula usuario persistente
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (name = "Usuario Demo") => {
    const fakeUser = { id: 1, name };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };
};

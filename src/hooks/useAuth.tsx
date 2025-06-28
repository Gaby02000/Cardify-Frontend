// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  const { user, setUser, logout } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/user`, {
          withCredentials: true,
        });
        setUser(res.data.user); // ✅ Extrae solo el objeto user
      } catch (err) {
        // Usuario no autenticado
        console.log("No hay sesión activa.");
        setUser(null); // Por claridad
      }
    };

    if (!user) {
      fetchUser();
    }
  }, []);

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    logout,
  };
};

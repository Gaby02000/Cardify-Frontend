// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import api, { getToken, clearToken } from "../lib/api";
import { syncPushSubscription } from "../lib/push";

export const useAuth = () => {
  const { user, setUser, logout: doLogout } = useUser();

  // Cuando hay usuario (login o sesión ya activa), vinculamos la
  // suscripción push de este dispositivo a la cuenta.
  useEffect(() => {
    if (user) syncPushSubscription();
  }, [user?.id]);

  useEffect(() => {
    const revalidate = async () => {
      if (!getToken()) {
        // No hay token: aseguramos que no quede un usuario cacheado huérfano.
        if (user) setUser(null);
        return;
      }

      try {
        const res = await api.get(`/user`);
        setUser(res.data.user);
      } catch (err: any) {
        // Solo cerramos sesión si el backend rechaza el token (401).
        // Ante un error de red / servidor caído mantenemos la sesión cacheada.
        if (err?.response?.status === 401) {
          clearToken();
          setUser(null);
        }
      }
    };

    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = !!user;

  const logout = async () => {
    try {
      if (getToken()) await api.post(`/logout`, {});
    } catch {
      /* aunque falle en el server, limpiamos localmente */
    } finally {
      doLogout();
    }
  };

  return {
    user,
    isAuthenticated,
    logout,
  };
};

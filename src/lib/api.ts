// src/lib/api.ts
// Instancia de axios compartida: agrega el token Bearer a cada request.
import axios from "axios";

export const TOKEN_KEY = "token";
const SESSION_ID_KEY = "session_id";
const USER_KEY = "auth_user";

/** UUID persistente para identificar el carrito de invitado en el backend. */
export const getSessionId = (): string => {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/** Cache del usuario para que el refresh no dependa de la red para mostrarse logueado. */
export const getCachedUser = <T = unknown>(): T | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
export const setCachedUser = (user: unknown) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
export const clearCachedUser = () => localStorage.removeItem(USER_KEY);

/** Borra toda la sesión local (token + usuario cacheado + historial de compras). */
export const clearSession = () => {
  clearToken();
  clearCachedUser();
  try {
    localStorage.removeItem("my-orders");
  } catch {
    /* noop */
  }
};

const baseURL = (import.meta.env.VITE_API_URL ?? "").trim();

const api = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  clearSession,
  getCachedUser,
  setCachedUser,
  clearCachedUser,
} from "../lib/api";

type User = {
  id: number;
  name: string;
  email: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Se inicializa con el usuario cacheado: al refrescar se ve logueado al instante.
  const [user, setUserState] = useState<User>(() => getCachedUser<User>());

  const setUser = (next: User) => {
    if (next) {
      setCachedUser(next);
    } else {
      clearCachedUser();
    }
    setUserState(next);
  };

  const logout = () => {
    clearSession();
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
};

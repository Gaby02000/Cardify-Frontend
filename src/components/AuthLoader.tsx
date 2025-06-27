import { useAuth } from "../hooks/useAuth";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  // Esto inicializa la sesión
  useAuth();
  return <>{children}</>;
}

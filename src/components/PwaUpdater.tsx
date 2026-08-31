// src/components/PwaUpdater.tsx
// Registra el service worker y aplica automáticamente la versión nueva
// cuando hay una (avisando con un toast breve).
import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useToast } from "../context/ToastContext";

export default function PwaUpdater() {
  const toast = useToast();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Chequea si hay una versión nueva publicada cada hora.
      if (registration) {
        setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 60 * 1000);
      }
    },
  });

  useEffect(() => {
    if (!needRefresh) return;
    toast.info("Hay una versión nueva de Cardify, actualizando…");
    const t = setTimeout(() => updateServiceWorker(true), 1200);
    return () => clearTimeout(t);
  }, [needRefresh, updateServiceWorker, toast]);

  return null;
}

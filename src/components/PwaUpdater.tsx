// src/components/PwaUpdater.tsx
// Registra el service worker y avisa (vía toast) cuando la PWA queda lista
// sin conexión o cuando hay una versión nueva para aplicar.
import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useToast } from "../context/ToastContext";

export default function PwaUpdater() {
  const toast = useToast();
  const {
    offlineReady: [offlineReady, setOfflineReady],
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
    if (!offlineReady) return;
    toast.success("Cardify quedó lista para usarse sin conexión.");
    setOfflineReady(false);
  }, [offlineReady, setOfflineReady, toast]);

  useEffect(() => {
    if (!needRefresh) return;
    toast.info("Hay una versión nueva de Cardify, actualizando…");
    const t = setTimeout(() => updateServiceWorker(true), 1200);
    return () => clearTimeout(t);
  }, [needRefresh, updateServiceWorker, toast]);

  return null;
}

// src/lib/push.ts
// Alta/baja de notificaciones Web Push contra el backend.
import api from "./api";

const VAPID_PUBLIC_KEY = (import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "").trim();

export const pushSupported = (): boolean =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

/** La VAPID public key viene en base64url; el navegador la necesita como Uint8Array. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

async function getVapidKey(): Promise<string> {
  if (VAPID_PUBLIC_KEY) return VAPID_PUBLIC_KEY;
  const { data } = await api.get("/push/public-key");
  return (data?.key as string) ?? "";
}

async function getSubscription(): Promise<PushSubscription | null> {
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

export async function isSubscribed(): Promise<boolean> {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  return !!(await getSubscription());
}

export async function subscribeToPush(): Promise<void> {
  if (!pushSupported()) {
    throw new Error("Tu navegador no soporta notificaciones.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("No diste permiso para las notificaciones.");
  }

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();

  if (!sub) {
    const key = await getVapidKey();
    if (!key) throw new Error("Falta configurar la VAPID public key.");
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    });
  }

  const json = sub.toJSON();
  await api.post("/push/subscribe", {
    endpoint: json.endpoint,
    keys: json.keys,
    contentEncoding:
      (window.PushManager as unknown as { supportedContentEncodings?: string[] })
        .supportedContentEncodings?.[0] ?? "aes128gcm",
  });
}

/**
 * Re-registra la suscripción actual (si existe) para que el backend la
 * asocie al usuario logueado. Silencioso y best-effort: se llama después
 * de iniciar sesión para que las push de compra encuentren el dispositivo.
 */
export async function syncPushSubscription(): Promise<void> {
  try {
    if (!pushSupported() || Notification.permission !== "granted") return;
    const sub = await getSubscription();
    if (!sub) return;
    const json = sub.toJSON();
    await api.post("/push/subscribe", {
      endpoint: json.endpoint,
      keys: json.keys,
      contentEncoding:
        (window.PushManager as unknown as { supportedContentEncodings?: string[] })
          .supportedContentEncodings?.[0] ?? "aes128gcm",
    });
  } catch {
    /* best-effort */
  }
}

export async function unsubscribeFromPush(): Promise<void> {
  const sub = await getSubscription();
  if (!sub) return;
  const { endpoint } = sub;
  try {
    await sub.unsubscribe();
  } catch {
    /* seguimos igual: damos de baja en el backend */
  }
  try {
    await api.post("/push/unsubscribe", { endpoint });
  } catch {
    /* la baja local ya ocurrió */
  }
}

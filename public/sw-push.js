/* eslint-disable no-undef */
// Handlers de Web Push. Este archivo lo importa el service worker generado
// por vite-plugin-pwa (workbox.importScripts).

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_e) {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Cardify";
  const options = {
    body: data.body || "",
    icon: data.icon || "/pwa-192x192.png",
    badge: "/pwa-64x64.png",
    image: data.image || undefined,
    tag: data.tag || "cardify-promo",
    renotify: true,
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana de la PWA abierta, la reusamos.
        for (const client of clientList) {
          if ("focus" in client) {
            if ("navigate" in client) {
              client.navigate(target).catch(() => {});
            }
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(target);
        }
        return undefined;
      })
  );
});

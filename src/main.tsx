// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Preconnect al backend para acortar la primera carga de datos.
try {
  const apiOrigin = new URL(import.meta.env.VITE_API_URL ?? "", location.href).origin;
  if (apiOrigin && apiOrigin !== location.origin) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = apiOrigin;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
} catch {
  /* VITE_API_URL vacío o inválido: no pasa nada */
}

import PwaUpdater from "./components/PwaUpdater";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { CookieConsentProvider } from "./context/CookieConsentContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <PwaUpdater />
      <CookieConsentProvider>
        <ConfirmProvider>
          <UserProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </UserProvider>
        </ConfirmProvider>
      </CookieConsentProvider>
    </ToastProvider>
  </StrictMode>
);

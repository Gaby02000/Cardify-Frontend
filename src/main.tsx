// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
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

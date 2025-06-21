// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext"; // Asegurate de tenerlo creado

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </UserProvider>
  </StrictMode>
);

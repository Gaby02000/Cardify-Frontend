import { useState } from "react";
import CartDrawer from "../Cart/CartDrawer";

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          backgroundColor: "var(--color-surface)",
          padding: "var(--spacing-md) var(--spacing-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--color-muted)",
        }}
      >
        <h2
          style={{
            color: "var(--color-primary)",
            fontWeight: "bold",
            fontSize: "var(--font-size-title)",
          }}
        >
          <a href="#hero" style={{ textDecoration: "none", color: "inherit" }}>
            Cardify
          </a>
        </h2>
        {/* Navigation Links */}
        <div style={{ flex: 2, display: "flex", justifyContent: "center" }}>
          <ul style={{ display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }}>
            <li><a href="#hero" style={link}>Home</a></li>
            <li><a href="#categories" style={link}>Categorías</a></li>
            <li><a href="#giftcards" style={link}>GiftCards</a></li>
            <li><a href="#footer" style={link}>Contacto</a></li>
          </ul>
        </div>

        {/* Auth + Cart */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button style={btn}>Login</button>
          <button style={btn} onClick={() => setCartOpen(true)}>
            Mi Carrito 🛒
          </button>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

const btn = {
  padding: "0.5rem 1rem",
  backgroundColor: "var(--color-primary)",
  border: "none",
  borderRadius: "var(--radius)",
  color: "var(--color-bg)",
  cursor: "pointer",
  fontWeight: "bold" as const,
};

const link = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

export default Navbar;

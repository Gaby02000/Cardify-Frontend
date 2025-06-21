import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 nuevo import
import CartDrawer from "../Cart/CartDrawer";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const navigate = useNavigate(); // 👈 hook de navegación
  const { user, logout } = useUser();

  // Detectar tamaño de pantalla en tiempo real
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = (
    <>
      <a href="#hero" style={linkStyle}>Home</a>
      <a href="#categories" style={linkStyle}>Categorías</a>
      <a href="#giftcards" style={linkStyle}>GiftCards</a>
      <a href="#footer" style={linkStyle}>Contacto</a>
    </>
  );

  return (
    <>
      <nav
        style={{
          backgroundColor: "var(--color-surface)",
          padding: "1rem",
          borderBottom: "1px solid var(--color-muted)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Logo */}
          <h2 style={{ color: "var(--color-primary)", fontWeight: "bold", fontSize: "1.5rem" }}>
            <a href="#hero" style={{ textDecoration: "none", color: "inherit" }}>Cardify</a>
          </h2>

          {/* Desktop nav */}
          {isDesktop && (
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <div style={{ display: "flex", gap: "1.5rem" }}>{navLinks}</div>
              {user ? (
                <button style={buttonStyle} onClick={logout}>Cerrar sesión</button>
              ) : (
                <button style={buttonStyle} onClick={() => navigate("/login")}>Login</button>
              )}
              <button style={buttonStyle} onClick={() => setCartOpen(true)}>Mi Carrito 🛒</button>
            </div>
          )}

          {/* Mobile hamburger */}
          {!isDesktop && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                color: "var(--color-text)",
                cursor: "pointer",
              }}
            >
              ☰
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {!isDesktop && menuOpen && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {navLinks}
            {user ? (
                <button style={buttonStyle} onClick={logout}>Cerrar sesión</button>
              ) : (
                <button style={buttonStyle} onClick={() => navigate("/login")}>Login</button>
            )}
            <button style={buttonStyle} onClick={() => setCartOpen(true)}>Mi Carrito 🛒</button>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-bg)",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold" as const,
  cursor: "pointer",
};

export default Navbar;
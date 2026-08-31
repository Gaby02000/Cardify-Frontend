import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut, LogIn, Receipt } from "lucide-react";
import CartDrawer from "../Cart/CartDrawer";
import PushOptIn from "../PushOptIn";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#categorias", label: "Categorías" },
  { href: "#giftcards", label: "Gift Cards" },
  { href: "#footer", label: "Contacto" },
];

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { cartItems } = useCart();

  const count = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const AuthButton = ({ block = false }: { block?: boolean }) =>
    user ? (
      <button
        className={`btn btn-ghost ${block ? "btn-block" : ""}`}
        onClick={() => {
          logout();
          setMenuOpen(false);
        }}
      >
        <LogOut size={16} /> Salir
      </button>
    ) : (
      <button
        className={`btn btn-primary ${block ? "btn-block" : ""}`}
        onClick={() => {
          navigate("/login");
          setMenuOpen(false);
        }}
      >
        <LogIn size={16} /> Ingresar
      </button>
    );

  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <a href="#inicio" className="nav__brand" aria-label="Cardify inicio">
            <span className="nav__mark">◆</span>
            Cardify
          </a>

          <nav className="nav__links">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav__link">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <PushOptIn />

            <button
              className="nav__cart"
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrito (${count})`}
            >
              <ShoppingCart size={19} />
              {count > 0 && <span className="nav__cart-count">{count}</span>}
            </button>

            <span className="nav__auth">
              {user && (
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate("/mis-compras")}
                >
                  <Receipt size={16} /> Mis compras
                </button>
              )}
              <AuthButton />
            </span>

            <button
              className="nav__burger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menú"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="nav__menu">
            <div className="container nav__menu-inner">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="nav__link"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              {user && (
                <button
                  className="btn btn-ghost btn-block"
                  onClick={() => {
                    navigate("/mis-compras");
                    setMenuOpen(false);
                  }}
                >
                  <Receipt size={16} /> Mis compras
                </button>
              )}
              <PushOptIn block />
              <AuthButton block />
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;

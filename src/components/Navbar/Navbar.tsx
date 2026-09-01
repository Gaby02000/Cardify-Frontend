import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  LogIn,
  Receipt,
  UserCog,
  ChevronDown,
} from "lucide-react";
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

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userWrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useUser();
  const { cartItems } = useCart();

  const count = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const onHome = pathname === "/";
  const linkHref = (hash: string) => (onHome ? hash : `/${hash}`);
  const brandHref = onHome ? "#inicio" : "/";

  // Cerrar el menú de usuario al click afuera o con Escape.
  useEffect(() => {
    if (!userMenu) return;
    const onDown = (e: MouseEvent) => {
      if (!userWrapRef.current?.contains(e.target as Node)) setUserMenu(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setUserMenu(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenu]);

  const go = (to: string) => {
    navigate(to);
    setUserMenu(false);
    setMenuOpen(false);
  };

  const AuthButton = ({ block = false }: { block?: boolean }) =>
    user ? (
      <button
        className={`btn btn-ghost ${block ? "btn-block" : ""}`}
        onClick={() => {
          logout();
          setMenuOpen(false);
        }}
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    ) : (
      <button
        className={`btn btn-primary ${block ? "btn-block" : ""}`}
        onClick={() => go("/login")}
      >
        <LogIn size={16} /> Ingresar
      </button>
    );

  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <a href={brandHref} className="nav__brand" aria-label="Cardify inicio">
            <span className="nav__mark">◆</span>
            Cardify
          </a>

          <nav className="nav__links">
            {links.map((l) => (
              <a key={l.href} href={linkHref(l.href)} className="nav__link">
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
              {user ? (
                <div className="nav__user-wrap" ref={userWrapRef}>
                  <button
                    className="nav__user"
                    onClick={() => setUserMenu((o) => !o)}
                    aria-haspopup="menu"
                    aria-expanded={userMenu}
                  >
                    <span className="nav__avatar">{initials(user.name)}</span>
                    <span className="nav__user-name">{user.name}</span>
                    <ChevronDown
                      size={15}
                      className={`nav__user-chev ${userMenu ? "is-open" : ""}`}
                    />
                  </button>

                  {userMenu && (
                    <div className="nav__dropdown" role="menu">
                      <div className="nav__dropdown-head">
                        <span className="nav__dropdown-name">{user.name}</span>
                        <span className="nav__dropdown-email">{user.email}</span>
                      </div>
                      <button
                        className="nav__dropdown-item"
                        role="menuitem"
                        onClick={() => go("/mi-cuenta")}
                      >
                        <UserCog size={15} /> Mi cuenta
                      </button>
                      <button
                        className="nav__dropdown-item"
                        role="menuitem"
                        onClick={() => go("/mis-compras")}
                      >
                        <Receipt size={15} /> Mis compras
                      </button>
                      <div className="nav__dropdown-sep" />
                      <button
                        className="nav__dropdown-item nav__dropdown-item--danger"
                        role="menuitem"
                        onClick={() => {
                          logout();
                          setUserMenu(false);
                        }}
                      >
                        <LogOut size={15} /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <AuthButton />
              )}
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
                  href={linkHref(l.href)}
                  className="nav__link"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              ))}

              {user && (
                <div className="nav__menu-user">
                  <span className="nav__avatar">{initials(user.name)}</span>
                  <span className="nav__menu-user-info">
                    <b>{user.name}</b>
                    <small>{user.email}</small>
                  </span>
                </div>
              )}

              {user && (
                <>
                  <button
                    className="btn btn-ghost btn-block"
                    onClick={() => go("/mi-cuenta")}
                  >
                    <UserCog size={16} /> Mi cuenta
                  </button>
                  <button
                    className="btn btn-ghost btn-block"
                    onClick={() => go("/mis-compras")}
                  >
                    <Receipt size={16} /> Mis compras
                  </button>
                </>
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

// src/components/Cart/CartDrawer.tsx
import { useEffect } from "react";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CheckoutButton from "../CheckoutButton";
import "./CartDrawer.css";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/apis\/?$/, "");
const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
const thumb = (image?: string) =>
  !image ? undefined : /^https?:\/\//.test(image) ? image : `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const { cartItems, loading, clearCart, removeItem } = useCart();

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div
        className={`drawer__overlay ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label="Carrito"
        aria-hidden={!open}
      >
        <header className="drawer__head">
          <h2>
            Tu carrito <span className="drawer__count">· {totalItems}</span>
          </h2>
          <button className="drawer__close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        <div className="drawer__body">
          {loading ? (
            <div className="drawer__empty">Cargando…</div>
          ) : cartItems.length === 0 ? (
            <div className="drawer__empty">
              <ShoppingBag size={40} strokeWidth={1.5} />
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="drawer__item" key={item.id ?? item.giftcardId}>
                {thumb(item.image) ? (
                  <img className="drawer__thumb" src={thumb(item.image)} alt="" />
                ) : (
                  <span className="drawer__thumb" />
                )}
                <div>
                  <h4>{item.title}</h4>
                  <small>
                    {item.quantity} × {money(item.price)}
                  </small>
                </div>
                <div className="drawer__line">
                  <b>{money(item.price * item.quantity)}</b>
                  {item.id != null && (
                    <button
                      className="drawer__remove"
                      onClick={() => removeItem(item.id!)}
                      aria-label={`Quitar ${item.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="drawer__foot">
            <div className="drawer__total">
              <span>Total</span>
              <b>{money(totalPrice)}</b>
            </div>
            <CheckoutButton cartData={cartItems} />
            <button className="btn btn-danger btn-block" onClick={clearCart}>
              <Trash2 size={15} /> Vaciar carrito
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;

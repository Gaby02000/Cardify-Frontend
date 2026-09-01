// src/components/Cart/CartDrawer.tsx
import { useEffect, useState } from "react";
import { X, Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useConfirm } from "../../context/ConfirmContext";
import type { GiftcardCartItem } from "../../hooks/useCart";
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
  const { cartItems, loading, clearCart, removeItem, updateItem } = useCart();
  const confirm = useConfirm();
  const [pending, setPending] = useState<Set<number>>(new Set());

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

  const setBusy = (id: number, on: boolean) =>
    setPending((s) => {
      const next = new Set(s);
      on ? next.add(id) : next.delete(id);
      return next;
    });

  const changeQty = async (item: GiftcardCartItem, nextQty: number) => {
    if (item.id == null || pending.has(item.id)) return;
    setBusy(item.id, true);
    try {
      if (nextQty < 1) await removeItem(item.id);
      else await updateItem(item.id, nextQty);
    } finally {
      setBusy(item.id, false);
    }
  };

  const handleRemove = async (item: GiftcardCartItem) => {
    if (item.id == null || pending.has(item.id)) return;
    setBusy(item.id, true);
    try {
      await removeItem(item.id);
    } finally {
      setBusy(item.id, false);
    }
  };

  const handleClear = async () => {
    const ok = await confirm({
      title: "¿Vaciar el carrito?",
      message: "Se van a quitar todos los productos que agregaste.",
      confirmText: "Vaciar",
      cancelText: "Cancelar",
      danger: true,
    });
    if (ok) clearCart();
  };

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
            cartItems.map((item) => {
              const busy = item.id != null && pending.has(item.id);
              const atMax = item.stock != null && item.quantity >= item.stock;
              return (
                <div className="drawer__item" key={item.id ?? item.giftcardId}>
                  {thumb(item.image) ? (
                    <img className="drawer__thumb" src={thumb(item.image)} alt="" />
                  ) : (
                    <span className="drawer__thumb" />
                  )}

                  <div className="drawer__info">
                    <h4>{item.title}</h4>
                    <small>
                      {item.originalPrice && (
                        <s className="drawer__old">{money(item.originalPrice)}</s>
                      )}
                      {money(item.price)} c/u
                    </small>

                    {item.id != null && (
                      <div className="drawer__qty">
                        <button
                          onClick={() => changeQty(item, item.quantity - 1)}
                          disabled={busy || item.quantity <= 1}
                          aria-label="Quitar uno"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => changeQty(item, item.quantity + 1)}
                          disabled={busy || atMax}
                          aria-label="Agregar uno"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="drawer__line">
                    <b>{money(item.price * item.quantity)}</b>
                    {item.id != null && (
                      <button
                        className="drawer__remove"
                        onClick={() => handleRemove(item)}
                        disabled={busy}
                        aria-label={`Quitar ${item.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="drawer__foot">
            <div className="drawer__total">
              <span>Total</span>
              <b>{money(totalPrice)}</b>
            </div>
            <CheckoutButton cartData={cartItems} />
            <button className="btn btn-danger btn-block" onClick={handleClear}>
              <Trash2 size={15} /> Vaciar carrito
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;

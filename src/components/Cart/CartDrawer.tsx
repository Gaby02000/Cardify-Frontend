import { useCart } from "../../hooks/useCart";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const { cartItems, loading } = useCart();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Prevenir scroll del fondo cuando está abierto
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: open ? 0 : "-100%",
        height: "100%",
        width: "320px",
        backgroundColor: "var(--color-surface)",
        boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.3)",
        transition: "right 0.3s ease-in-out",
        zIndex: 1000,
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ color: "var(--color-primary)" }}>Shopping Cart</h2>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-text)",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <p style={{ color: "var(--color-muted)", marginBottom: "1rem" }}>
        {totalItems} item{totalItems !== 1 && "s"} in your cart
      </p>

      {loading ? (
        <p style={{ color: "var(--color-text)" }}>Cargando...</p>
      ) : cartItems.length === 0 ? (
        <p style={{ color: "var(--color-muted)", marginTop: "2rem" }}>
          Your cart is empty
        </p>
      ) : (
        <>
          <ul
            style={{
              flex: 1,
              overflowY: "auto",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {cartItems.map((item) => (
              <li
                key={item.giftcardId}
                style={{
                  marginBottom: "1rem",
                  borderBottom: "1px solid var(--color-muted)",
                  paddingBottom: "0.5rem",
                }}
              >
                <strong>{item.title}</strong>
                <br />
                {item.quantity} × ${item.price}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1rem" }}>
            <button
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-bg)",
                border: "none",
                borderRadius: "var(--radius)",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              Continuar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDrawer;

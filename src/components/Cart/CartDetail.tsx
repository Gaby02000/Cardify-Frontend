import { useCart } from "../../hooks/useCart";
import CheckoutButton from "../CheckoutButton"; // ajustá el path si es necesario

const CartView = () => {
  const { cartItems, loading } = useCart();

  if (loading) return <p>Cargando carrito...</p>;
  if (cartItems.length === 0) return <p>Tu carrito está vacío.</p>;

  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>Mi Carrito</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.giftcardId} style={{ marginBottom: "1rem" }}>
            <strong>{item.title}</strong> - {item.quantity} × ${item.price}
          </li>
        ))}
      </ul>
      <p><strong>Total:</strong> ${total}</p>
      <CheckoutButton />
    </div>
  );
};

export default CartView;

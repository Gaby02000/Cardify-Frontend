// src/components/CheckoutButton.tsx

//import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const CheckoutButton = () => {
  // const { cartItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      // Crear la orden directamente (el backend tomará el carrito del usuario autenticado)
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        credentials: "include", // importante para enviar la cookie de sesión de Sanctum (cuando lo tengas)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        navigate("/order-failed");
        return;
      }
      //const order = await res.json();

      //alert("Orden creada exitosamente!");
      //clearCart();
      navigate("/order-confirmed");
    } catch (err) {
      console.error(err);
      alert("Error al procesar la orden");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        width: "100%",
        marginTop: "0.5rem",
        padding: "0.5rem",
        backgroundColor: "#ccc",
        color: "#000",
        border: "none",
        borderRadius: "var(--radius)",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      Confirmar compra
    </button>
  );
};

export default CheckoutButton;

// src/pages/ConfirmedOrder.tsx
import { Link } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import "./OrderStatus.css";

const ConfirmedOrder = () => (
  <main className="ostatus ostatus--ok">
    <div className="ostatus__blob" />
    <div className="ostatus__card">
      <span className="ostatus__icon">
        <PartyPopper size={34} />
      </span>
      <h1>¡Gracias por tu compra!</h1>
      <p>
        Tu orden fue procesada con éxito. En unos minutos vas a recibir un email
        con tus códigos de gift card.
      </p>
      <Link to="/" className="btn btn-primary btn-block btn-lg">
        Volver al inicio
      </Link>
    </div>
  </main>
);

export default ConfirmedOrder;

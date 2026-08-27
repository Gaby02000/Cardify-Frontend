// src/pages/FailedOrder.tsx
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import "./OrderStatus.css";

const FailedOrder = () => (
  <main className="ostatus ostatus--fail">
    <div className="ostatus__blob" />
    <div className="ostatus__card">
      <span className="ostatus__icon">
        <XCircle size={34} />
      </span>
      <h1>No pudimos procesar tu compra</h1>
      <p>
        El pago no se completó. No te preocupes: no se hizo ningún cargo. Podés
        intentarlo de nuevo cuando quieras.
      </p>
      <Link to="/" className="btn btn-ghost btn-block btn-lg">
        Volver al inicio
      </Link>
    </div>
  </main>
);

export default FailedOrder;

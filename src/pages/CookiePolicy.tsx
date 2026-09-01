// src/pages/CookiePolicy.tsx
import { Link } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useCookieConsent } from "../context/CookieConsentContext";
import "./Legal.css";

const CookiePolicy = () => {
  const { openPreferences } = useCookieConsent();

  return (
    <main className="legal section">
      <div className="container legal__wrap">
        <Link to="/" className="legal__back">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <h1 className="legal__title">Política de cookies</h1>
        <p className="legal__updated">Última actualización: agosto 2026</p>

        <h2>¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que un sitio web guarda en tu
          dispositivo cuando lo visitás. Sirven para que el sitio funcione, para
          recordar tus preferencias y, si lo autorizás, para entender cómo se usa.
        </p>

        <h2>Cookies que usamos</h2>
        <ul className="legal__list">
          <li>
            <b>Esenciales.</b> Necesarias para el funcionamiento del sitio: mantener
            tu sesión iniciada, recordar el carrito y proteger las operaciones. No se
            pueden desactivar.
          </li>
          <li>
            <b>Experiencia de usuario.</b> Recuerdan preferencias como el tema o
            ajustes de la interfaz para mejorar tu navegación. Son opcionales.
          </li>
          <li>
            <b>Análisis de tráfico.</b> Nos permiten medir, de forma agregada y
            anónima, qué páginas se visitan y cómo se usa el sitio para mejorarlo.
            Son opcionales.
          </li>
        </ul>

        <h2>Tu consentimiento</h2>
        <p>
          Al ingresar por primera vez te mostramos un aviso para que aceptes todas
          las cookies, las rechaces (dejando solo las esenciales) o elijas por
          categoría. Podés cambiar tu decisión en cualquier momento.
        </p>

        <button className="btn btn-soft" onClick={openPreferences}>
          <SlidersHorizontal size={16} /> Abrir preferencias de cookies
        </button>

        <h2>Cómo desactivarlas desde el navegador</h2>
        <p>
          Además de nuestro panel de preferencias, podés bloquear o eliminar cookies
          desde la configuración de tu navegador. Tené en cuenta que si desactivás
          las esenciales, algunas funciones del sitio pueden dejar de funcionar.
        </p>

        <h2>Contacto</h2>
        <p>
          Si tenés dudas sobre esta política, escribinos a{" "}
          <a href="mailto:hola@cardify.app">hola@cardify.app</a>.
        </p>
      </div>
    </main>
  );
};

export default CookiePolicy;

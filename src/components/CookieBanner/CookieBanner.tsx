// src/components/CookieBanner/CookieBanner.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { useCookieConsent } from "../../context/CookieConsentContext";
import "./CookieBanner.css";

const CookieBanner = () => {
  const {
    decided,
    prefsOpen,
    consent,
    openPreferences,
    closePreferences,
    save,
    acceptAll,
    rejectAll,
  } = useCookieConsent();

  const [ux, setUx] = useState(consent?.ux ?? false);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);

  useEffect(() => {
    if (prefsOpen) {
      setUx(consent?.ux ?? false);
      setAnalytics(consent?.analytics ?? false);
    }
  }, [prefsOpen, consent]);

  useEffect(() => {
    if (!prefsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePreferences();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prefsOpen, closePreferences]);

  const showBanner = !decided && !prefsOpen;

  if (!showBanner && !prefsOpen) return null;

  return (
    <>
      {showBanner && (
        <div className="cookie" role="region" aria-label="Aviso de cookies">
          <div className="container cookie__inner">
            <div className="cookie__body">
              <Cookie size={20} className="cookie__icon" aria-hidden />
              <p className="cookie__text">
                Usamos cookies esenciales para que nuestro sitio funcione. Con su
                consentimiento, también podremos usar cookies no esenciales para
                mejorar la experiencia del usuario y analizar el tráfico del sitio
                web. Al hacer clic en <b>“Aceptar todo”</b>, acepta el uso de
                cookies de nuestro sitio web tal como se describe en nuestra{" "}
                <Link to="/politica-de-cookies" className="cookie__link">
                  Política de cookies
                </Link>
                . Puede cambiar sus ajustes de cookies en cualquier momento
                haciendo clic en <b>“Preferencias”</b>.
              </p>
            </div>

            <div className="cookie__actions">
              <button className="btn btn-ghost" onClick={rejectAll}>
                Rechazar
              </button>
              <button className="btn btn-ghost" onClick={openPreferences}>
                Preferencias
              </button>
              <button className="btn btn-primary" onClick={acceptAll}>
                Aceptar todo
              </button>
            </div>
          </div>
        </div>
      )}

      {prefsOpen && (
        <div className="ckmodal__overlay" onClick={closePreferences}>
          <div
            className="ckmodal"
            role="dialog"
            aria-modal="true"
            aria-label="Preferencias de cookies"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ckmodal__close"
              onClick={closePreferences}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <h2 className="ckmodal__title">Preferencias de cookies</h2>
            <p className="ckmodal__desc">
              Elegí qué cookies querés permitir. Las esenciales no se pueden
              desactivar porque el sitio no funcionaría sin ellas. Podés leer más
              en la{" "}
              <Link to="/politica-de-cookies" onClick={closePreferences}>
                Política de cookies
              </Link>
              .
            </p>

            <label className="ckopt ckopt--locked">
              <span className="ckopt__info">
                <b>Esenciales</b>
                <small>Necesarias para el carrito, la sesión y la seguridad.</small>
              </span>
              <span className="ckopt__state">Siempre activas</span>
            </label>

            <label className="ckopt">
              <span className="ckopt__info">
                <b>Experiencia de usuario</b>
                <small>Recuerdan tus preferencias para mejorar la navegación.</small>
              </span>
              <input
                type="checkbox"
                className="ckopt__toggle"
                checked={ux}
                onChange={(e) => setUx(e.target.checked)}
              />
            </label>

            <label className="ckopt">
              <span className="ckopt__info">
                <b>Análisis de tráfico</b>
                <small>Nos ayudan a entender cómo se usa el sitio, de forma agregada.</small>
              </span>
              <input
                type="checkbox"
                className="ckopt__toggle"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
            </label>

            <div className="ckmodal__actions">
              <button className="btn btn-ghost" onClick={rejectAll}>
                Rechazar todo
              </button>
              <button className="btn btn-soft" onClick={acceptAll}>
                Aceptar todo
              </button>
              <button
                className="btn btn-primary"
                onClick={() => save({ essential: true, ux, analytics })}
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;

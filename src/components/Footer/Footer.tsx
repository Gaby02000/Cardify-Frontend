// src/components/Footer/Footer.tsx
import { Link } from "react-router-dom";
import { Twitter, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useCookieConsent } from "../../context/CookieConsentContext";
import "./Footer.css";

const Footer = () => {
  const { openPreferences } = useCookieConsent();

  return (
    <footer id="footer" className="ft">
      <div className="container ft__grid">
        <div>
          <span className="ft__brand">
            <span className="ft__mark">◆</span> Cardify
          </span>
          <p className="ft__about">
            Gift cards digitales para gamers, techies y amantes del futuro
            digital. Entrega inmediata, pago seguro.
          </p>
          <div className="ft__social">
            <a href="#" aria-label="Twitter"><Twitter size={17} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
            <a href="#" aria-label="Discord"><MessageCircle size={17} /></a>
          </div>
        </div>

        <div className="ft__col">
          <h4>Cardify</h4>
          <ul>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/politica-de-cookies">Política de cookies</Link></li>
            <li><Link to="/politica-de-privacidad">Política de privacidad</Link></li>
          </ul>
        </div>
      </div>

      <div className="ft__bottom">
        <span>© {new Date().getFullYear()} Cardify.</span>
        <span className="ft__legal">
          <Link to="/politica-de-cookies">Política de cookies</Link>
          <Link to="/politica-de-privacidad">Política de privacidad</Link>
          <button type="button" onClick={openPreferences}>
            Preferencias de cookies
          </button>
        </span>
      </div>
    </footer>
  );
};

export default Footer;

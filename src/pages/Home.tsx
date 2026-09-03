// src/pages/Home.tsx
import { lazy, Suspense } from "react";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import "./Home.css";

// Todo lo que está debajo del pliegue se carga aparte, para que el hero
// (que es el LCP) pinte con el mínimo de JavaScript.
const CatalogBrowser = lazy(() => import("../components/Catalog/CatalogBrowser"));
const Footer = lazy(() => import("../components/Footer/Footer"));

const Home = () => {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section id="inicio" className="hero">
        <div className="container">
        <div className="hero__inner fade-up">
          <span className="eyebrow">
            <Sparkles size={14} /> codigos digitales al instante
          </span>

          <h1>
            Gift cards para el <span className="grad-text">futuro digital</span>
          </h1>

          <p className="hero__lead">
            Steam, Valorant, League of Legends y más. Elegís, pagás y recibís el código
            en tu correo en segundos.
          </p>

          <div className="hero__cta">
            <a href="#catalogo" className="btn btn-primary btn-lg">
              <Zap size={18} /> Explorar tarjetas
            </a>
            <a href="#catalogo" className="btn btn-ghost btn-lg">
              Ver categorías
            </a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <b>+120</b>
              <span>Tarjetas</span>
            </div>
            <div className="hero__stat">
              <b>24/7</b>
              <span>Entrega</span>
            </div>
            <div className="hero__stat">
              <b>100%</b>
              <span>Seguro</span>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ---------- Catálogo ---------- */}
      <section id="catalogo" className="section container">
        <div className="section-head center">
          <span className="eyebrow">
            <ShieldCheck size={14} /> Elegí por gusto
          </span>
          <h2 className="section-title">Explorá el catálogo</h2>
          <p>
            Mirá las tarjetas agrupadas por categoría o abrí la lista completa
            con buscador y filtros.
          </p>
        </div>
        <Suspense
          fallback={<div className="home__loading home__loading--tall" />}
        >
          <CatalogBrowser />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
};

export default Home;

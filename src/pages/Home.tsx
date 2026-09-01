// src/pages/Home.tsx
import { lazy, Suspense } from "react";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import "./Home.css";

// Todo lo que está debajo del pliegue se carga aparte, para que el hero
// (que es el LCP) pinte con el mínimo de JavaScript.
const PopularCategories = lazy(() => import("../components/Category/PopularCategories"));
const GiftCardList = lazy(() => import("../components/GiftCard/GiftCardList"));
const Footer = lazy(() => import("../components/Footer/Footer"));

const Home = () => {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section id="inicio" className="hero">
        <div className="hero__blob hero__blob--lime" />
        <div className="hero__blob hero__blob--violet" />

        <div className="container">
        <div className="hero__inner fade-up">
          <span className="eyebrow">
            <Sparkles size={14} /> Regalos digitales al instante
          </span>

          <h1>
            Gift cards para el <span className="grad-text">futuro digital</span>
          </h1>

          <p className="hero__lead">
            Steam, PlayStation, Netflix y más. Elegís, pagás y recibís el código
            en tu correo en segundos.
          </p>

          <div className="hero__cta">
            <a href="#giftcards" className="btn btn-primary btn-lg">
              <Zap size={18} /> Explorar tarjetas
            </a>
            <a href="#categorias" className="btn btn-ghost btn-lg">
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

      {/* ---------- Categorías ---------- */}
      <section id="categorias" className="section container">
        <div className="section-head center">
          <span className="eyebrow">
            <ShieldCheck size={14} /> Elegí por gusto
          </span>
          <h2 className="section-title">Categorías populares</h2>
          <p>Encontrá la tarjeta perfecta para cada tipo de regalo.</p>
        </div>
        <Suspense fallback={<div className="home__loading" />}>
          <PopularCategories />
        </Suspense>
      </section>

      {/* ---------- Gift cards ---------- */}
      <section id="giftcards" className="section container">
        <div className="section-head center">
          <span className="eyebrow">
            <Sparkles size={14} /> Destacadas
          </span>
          <h2 className="section-title">Nuestras gift cards</h2>
          <p>Precios claros, stock real y entrega inmediata.</p>
        </div>
        <Suspense fallback={<div className="home__loading home__loading--tall" />}>
          <GiftCardList />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
};

export default Home;

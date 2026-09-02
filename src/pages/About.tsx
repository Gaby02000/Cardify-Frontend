// src/pages/About.tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./Legal.css";

const About = () => {
  return (
    <main className="legal section">
      <div className="container legal__wrap">
        <Link to="/" className="legal__back">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <h1 className="legal__title">Nosotros</h1>

        <p>
          En Cardify creemos que comprar debería ser simple y rápido. Por eso
          desarrollamos una plataforma digital pensada para facilitar la compra
          de gift cards de tus tiendas y servicios favoritos.
        </p>

        <p>
          Nuestra propuesta combina una experiencia de compra sencilla con la
          comodidad de recibir códigos digitales, permitiendo elegir una
          tarjeta, realizar la compra y tenerla disponible de forma rápida, sin
          necesidad de productos físicos.
        </p>

        <p>
          Cardify es una empresa ficticia desarrollada en Argentina por dos
          chavales. Nuestro objetivo es crear una experiencia de compra moderna,
          intuitiva y accesible para todos los usuarios.
        </p>

        <h2>¿Qué ofrecemos?</h2>
        <p>
          Ofrecemos gift cards digitales de diferentes tiendas y servicios,
          permitiendo realizar compras de manera rápida y sencilla. Nuestra
          plataforma está diseñada para que el usuario pueda encontrar la
          tarjeta que busca, adquirirla y recibir su código digital de forma
          práctica.
        </p>
      </div>
    </main>
  );
};

export default About;

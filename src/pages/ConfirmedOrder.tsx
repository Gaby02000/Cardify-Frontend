// src/pages/ConfirmedOrder.tsx
import React from "react";

const ConfirmedOrder = () => {
  return (
    <main style={mainStyle}>
      <div style={backgroundStyle1} />
      <div style={backgroundStyle2} />

      <div style={cardStyle}>
        <h2 style={titleStyle}>¡Gracias por tu compra! 🎉</h2>
        <p style={textStyle}>Tu orden fue procesada con éxito. En breve recibirás un email con los detalles.</p>
        <a href="/" style={linkStyle}>Volver al inicio</a>
      </div>
    </main>
  );
};

export default ConfirmedOrder;

const mainStyle: React.CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  padding: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--color-bg)",
  overflow: "hidden",
};

const backgroundStyle1: React.CSSProperties = {
  position: "absolute",
  top: "2rem",
  left: "2rem",
  width: "18rem",
  height: "18rem",
  backgroundColor: "rgba(0, 255, 100, 0.2)",
  borderRadius: "50%",
  filter: "blur(60px)",
  zIndex: 0,
};

const backgroundStyle2: React.CSSProperties = {
  position: "absolute",
  bottom: "2rem",
  right: "2rem",
  width: "24rem",
  height: "24rem",
  backgroundColor: "rgba(53,2,83,0.3)",
  borderRadius: "50%",
  filter: "blur(60px)",
  zIndex: 0,
};

const cardStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  backgroundColor: "var(--color-surface)",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "var(--shadow-glow)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  color: "var(--color-primary)",
  marginBottom: "1rem",
  fontSize: "1.75rem",
  textShadow: "var(--shadow-primary)",
};

const textStyle: React.CSSProperties = {
  color: "var(--color-text)",
  marginBottom: "1.5rem",
};

const linkStyle: React.CSSProperties = {
  color: "var(--color-primary)",
  fontWeight: "bold",
  textDecoration: "underline",
};



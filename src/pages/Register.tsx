import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
        {
          withCredentials: true,
        }
      );

      // alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (error: any) {
      console.error("Error al registrarse", error);
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat();
        alert(messages.join("\n"));
      } else {
        alert("Ocurrió un error al registrarse");
      }
    }
  };

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "var(--spacing-xl) var(--spacing-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      {/* Background layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(53,2,83,0.2), transparent)",
          zIndex: 0,
        }}
      />
      <div
        className="animate-pulse"
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          width: "18rem",
          height: "18rem",
          backgroundColor: "rgba(149,255,0,0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      <div
        className="animate-pulse"
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          width: "24rem",
          height: "24rem",
          backgroundColor: "rgba(53,2,83,0.3)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      {/* Register Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "var(--color-surface)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "var(--shadow-glow)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "var(--color-primary)",
            marginBottom: "1rem",
            fontSize: "1.75rem",
            textShadow: "var(--shadow-primary)",
          }}
        >
          Crear cuenta
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleRegister} style={buttonStyle}>
            Registrarse
          </button>

          <p
            style={{
              color: "var(--color-muted)",
              marginTop: "1rem",
              fontSize: "0.9rem",
            }}
          >
            ¿Ya tenés una cuenta?{" "}
            <a
              href="/login"
              style={{ color: "var(--color-primary)", fontWeight: "bold" }}
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

const inputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid var(--color-muted)",
  fontSize: "1rem",
  backgroundColor: "var(--color-bg)",
  color: "white",
};

const buttonStyle = {
  padding: "0.75rem 1rem",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-bg)",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold" as const,
  fontSize: "1rem",
  cursor: "pointer",
};

export default Register;

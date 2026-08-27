// src/pages/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import api from "../lib/api";
import "./Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post(`/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join("\n"));
      } else {
        setError(err.response?.data?.message || "Ocurrió un error al registrarse.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__blob auth__blob--a" />
      <div className="auth__blob auth__blob--b" />

      <div className="auth__card">
        <span className="auth__brand">
          <span className="auth__mark">◆</span> Cardify
        </span>

        <h1 className="auth__title">Crear cuenta</h1>
        <p className="auth__subtitle">Unite y empezá a regalar en segundos.</p>

        <form className="auth__form" onSubmit={handleRegister}>
          {error && (
            <div className="auth__error">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <div className="field">
            <label htmlFor="name">Nombre completo</label>
            <input
              id="name"
              className="input"
              type="text"
              autoComplete="name"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="vos@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="pw">Contraseña</label>
            <div className="auth__pw">
              <input
                id="pw"
                className="input"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="pw2">Confirmar contraseña</label>
            <input
              id="pw2"
              className="input"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repetí la contraseña"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Creando…</> : "Registrarse"}
          </button>
        </form>

        <p className="auth__foot">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>

        <Link to="/" className="auth__back">
          <ArrowLeft size={15} /> Volver a la tienda
        </Link>
      </div>
    </main>
  );
};

export default Register;

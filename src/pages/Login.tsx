// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2, LogOut } from "lucide-react";
import api, { setToken, getSessionId } from "../lib/api";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, setUser, logout } = useUser();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/login`, {
        email,
        password,
        session_id: getSessionId(),
      });
      setToken(res.data.token);
      setUser(res.data.user);
      await fetchCart();
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No pudimos iniciar sesión. Revisá tus datos."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post(`/logout`, {});
    } catch {
      /* limpiamos igual */
    } finally {
      logout();
      await fetchCart();
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

        {user ? (
          <div className="auth__hi">
            <p className="auth__title">
              <CheckCircle2 size={22} /> ¡Hola, {user.name}!
            </p>
            <p className="auth__subtitle">Ya tenés la sesión iniciada.</p>
            <div className="auth__form">
              <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate("/")}>
                Ir a la tienda
              </button>
              <button className="btn btn-ghost btn-block" onClick={handleLogout}>
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="auth__title">Iniciar sesión</h1>
            <p className="auth__subtitle">Bienvenido de vuelta a Cardify.</p>

            <form className="auth__form" onSubmit={handleLogin}>
              {error && (
                <div className="auth__error">
                  <AlertCircle size={16} /> <span>{error}</span>
                </div>
              )}

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
                    autoComplete="current-password"
                    placeholder="••••••••"
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

              <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Ingresando…</> : "Ingresar"}
              </button>
            </form>

            <p className="auth__foot">
              ¿No tenés cuenta? <Link to="/register">Registrate</Link>
            </p>
          </>
        )}

        <Link to="/" className="auth__back">
          <ArrowLeft size={15} /> Volver a la tienda
        </Link>
      </div>
    </main>
  );
};

export default Login;

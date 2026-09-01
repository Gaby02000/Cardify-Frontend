// src/pages/Account.tsx
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import api from "../lib/api";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import "./Account.css";

const ES_ERRORS: Record<string, string> = {
  "The current password is incorrect.": "La contraseña actual es incorrecta.",
  "The password field must be at least 6 characters.":
    "La contraseña nueva debe tener al menos 6 caracteres.",
  "The password field confirmation does not match.": "Las contraseñas no coinciden.",
  "The email has already been taken.": "Ese correo ya está en uso.",
  "The email field must be a valid email address.":
    "Ingresá un correo electrónico válido.",
  "The name field is required.": "El nombre es obligatorio.",
  "The current password field is required when password is present.":
    "Ingresá tu contraseña actual para poder cambiarla.",
};
const translate = (m: string) => ES_ERRORS[m] ?? m;

const Account = () => {
  const { user, setUser } = useUser();
  const toast = useToast();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (pw) {
      if (pw.length < 6) {
        setError("La contraseña nueva debe tener al menos 6 caracteres.");
        return;
      }
      if (pw !== pw2) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      if (!currentPw) {
        setError("Ingresá tu contraseña actual para poder cambiarla.");
        return;
      }
    }

    setLoading(true);
    try {
      const body: Record<string, string> = { name: name.trim(), email: email.trim() };
      if (pw) {
        body.current_password = currentPw;
        body.password = pw;
        body.password_confirmation = pw2;
      }
      const res = await api.put("/user", body);
      setUser(res.data.user);
      setCurrentPw("");
      setPw("");
      setPw2("");
      toast.success("Datos actualizados.");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(
          Object.values(err.response.data.errors)
            .flat()
            .map((m) => translate(String(m)))
            .join("\n")
        );
      } else {
        setError(err.response?.data?.message || "No se pudieron guardar los cambios.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="account section">
      <div className="container account__wrap">
        <Link to="/" className="account__back">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <h1 className="account__title">Mi cuenta</h1>
        <p className="account__sub">Actualizá tus datos y tu contraseña.</p>

        <form className="account__form" onSubmit={submit}>
          {error && (
            <div className="account__error">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <div className="field">
            <label htmlFor="acc-name">Nombre completo</label>
            <input
              id="acc-name"
              className="input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="acc-email">Correo electrónico</label>
            <input
              id="acc-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="account__pwblock">
            <p className="account__pwtitle">
              Cambiar contraseña <span>· opcional</span>
            </p>

            <div className="field">
              <label htmlFor="acc-cpw">Contraseña actual</label>
              <input
                id="acc-cpw"
                className="input"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="acc-npw">Nueva contraseña</label>
              <div className="account__pw">
                <input
                  id="acc-npw"
                  className="input"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
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
              <label htmlFor="acc-npw2">Confirmar nueva contraseña</label>
              <input
                id="acc-npw2"
                className="input"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Guardando…
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Account;

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { register } from "../../services/users";

const Registro = ({ onAuthSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [name, SetName] = useState("");
  const [telefono, SetTelefono] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Eliminamos el uso de useNavigate en la versión final de Registro
  // ya que la redirección se gestiona a través de la actualización de estado en App.jsx.
  // const navigate = useNavigate(); 

  const cleanForm = () => {
    setEmail("");
    setPassword("");
    SetName("");
    SetTelefono("");
  };

  const signUp = React.useCallback(async () => {
    try {
      const res = await register(email, pass, name, telefono);

      // Asumiendo que el servicio 'register' devuelve un token al registrar exitosamente,
      // al igual que 'login'. Si solo registra y no inicia sesión automáticamente, 
      // esta lógica debe cambiar. Aquí asumimos auto-login.
      if (res.token) {
        setError(null);
        // Almacenar datos del usuario y token
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token); 
        
        cleanForm();

        // Notificar a App.jsx del éxito para que actualice el estado authUser y redirija
        if (onAuthSuccess) {
            onAuthSuccess(true); 
        }
      } else {
         // Si hay un error devuelto por el servidor (ej: "Usuario ya existe")
         setError(res.message || t("auth.registerError"));
      }
    } catch (err) {
      console.error(err);
      setError(t("auth.registerServiceError"));
    } finally {
      setIsLoading(false);
    }
  }, [email, pass, name, telefono, onAuthSuccess, t]);

  const RegisterEmail = async (e) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true);

    // Validaciones
    if (!email.trim()) {
      setError(t("auth.emailRequired"));
      setIsLoading(false);
      return;
    }
    if (!pass.trim() || pass.length < 6) {
      setError(t("auth.passwordRequired"));
      setIsLoading(false);
      return;
    }
    if (!name.trim()) {
      setError(t("auth.nameRequired"));
      setIsLoading(false);
      return;
    }

    await signUp();
  };

  return (
    <div className="login-card">
      <div className="login-card-header">
        <div className="login-logo-wrap">
          <img src="/logo.png" alt="" className="login-logo" />
        </div>
        <h1 className="login-title">{t("auth.createAccount")}</h1>
        <p className="login-subtitle">{t("auth.registerSubtitle")}</p>
      </div>
      <form onSubmit={RegisterEmail} className="login-form">
        {error && (
          <div className="alert alert-danger login-alert" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="reg-emailInput" className="form-label login-label">
            {t("auth.email")}
          </label>
          <input
            id="reg-emailInput"
            type="email"
            className="form-control login-input"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg-passwordInput" className="form-label login-label">
            {t("auth.password")}
          </label>
          <input
            id="reg-passwordInput"
            type="password"
            className="form-control login-input"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reg-nameInput" className="form-label login-label">
            {t("auth.nameAndLastName")}
          </label>
          <input
            id="reg-nameInput"
            type="text"
            className="form-control login-input"
            placeholder={t("auth.namePlaceholder")}
            value={name}
            onChange={(e) => SetName(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reg-phoneInput" className="form-label login-label">
            {t("auth.phone")} <span className="text-muted fw-normal">({t("common.optional")})</span>
          </label>
          <input
            id="reg-phoneInput"
            type="text"
            className="form-control login-input"
            placeholder={t("auth.phonePlaceholder")}
            value={telefono}
            onChange={(e) => SetTelefono(e.target.value)}
            disabled={isLoading}
            autoComplete="tel"
          />
        </div>
        <button
          type="submit"
          className="btn btn-sisvet-primary btn-login w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              {t("auth.registering")}
            </>
          ) : (
            t("auth.register")
          )}
        </button>
      </form>
    </div>
  );
};

export default Registro;
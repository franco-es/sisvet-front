import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Registro from "./Registro";
import { login } from "../../services/users";

const Login = ({ onAuthSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [esRegistro, setEsRegistro] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const auth = async () => {
    try {
      const res = await login(email, password);
      if (res.message && res.message !== "OK") {
        setError(t("auth.badCredentials"));
      } else if (res.token) {
        setError(null);
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
        if (onAuthSuccess) onAuthSuccess(true);
        navigate("/pets");
      }
    } catch (err) {
      setError(t("auth.loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyData = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!email.trim()) {
      setError(t("auth.enterEmail"));
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError(t("auth.enterPassword"));
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError(t("auth.passwordMinLength"));
      setIsLoading(false);
      return;
    }
    await auth();
  };

  const toggleRegistro = () => {
    setEsRegistro(!esRegistro);
    setError("");
  };

  if (esRegistro) {
    return (
      <div className="login-page">
        <div className="login-page-inner">
          <div className="login-card-wrap">
            <Registro onAuthSuccess={onAuthSuccess} />
            <p className="login-toggle-text mt-4 mb-0 text-center">
              <button
                type="button"
                onClick={toggleRegistro}
                className="btn btn-link link-sisvet p-0"
              >
                {t("auth.backToLogin")}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-page-inner">
        <div className="login-card-wrap">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-logo-wrap">
                <img src="/logo.png" alt="" className="login-logo" />
              </div>
              <h1 className="login-title">{t("auth.loginTitle")}</h1>
              <p className="login-subtitle">{t("auth.loginSubtitle")}</p>
            </div>
            <form onSubmit={verifyData} className="login-form">
              {error && (
                <div className="alert alert-danger login-alert" role="alert">
                  {error}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label login-label">
                  {t("auth.email")}
                </label>
                <input
                  id="emailInput"
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
              <div className="mb-4">
                <label htmlFor="passwordInput" className="form-label login-label">
                  {t("auth.password")}
                </label>
                <input
                  id="passwordInput"
                  type="password"
                  className="form-control login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
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
                    {t("auth.loggingIn")}
                  </>
                ) : (
                  t("auth.enter")
                )}
              </button>
            </form>
            <p className="login-toggle-text mt-4 mb-0 text-center">
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={toggleRegistro}
                className="btn btn-link link-sisvet p-0 fw-semibold"
              >
                {t("auth.registerHere")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

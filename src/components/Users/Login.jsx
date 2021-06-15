// FUNCIONES DE REACT
import React, { useState, useCallback } from "react";
import { withRouter } from "react-router-dom";
// FUNCIONES PROPIAS
import Registro from "./Registro"; // COMPONENT DE Registro
import login from "../../services/users/login"; //function de logeo

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [esRegistro, setesRegistro] = useState(false);

  const verifyData = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("ingrese email");
      return;
    }
    if (!password.trim()) {
      setError("ingrese password");
      return;
    }
    if (password.length < 6) {
      setError("password menor de 6 caracteres.");
      return;
    }
    console.log("pasando todas las validaciones");
    auth();
  };

  const auth = useCallback(async () => {
    await login(email, password)
      .then((res) => {
        if (res.data.message) {
          setError("email o contraseña incorrectos");
        } else if (res.data.token) {
          setError(null);
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.removeItem("token");
          localStorage.setItem("token", res.data.token);
          if (localStorage.getItem("token")) {
            props.history.push("/pets");
          }
        }
      })
      .catch((err) => {
        console.error(err);
        console.log("error en el catch");
      });
  }, [email, password, props.history]);

  return (
    <div className="mt-5 container">
      <h3>{esRegistro ? "Registro de usuarios" : "Login de usuarios"}</h3>
      <hr />
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-xl-4">
          {esRegistro ? (
            <Registro />
          ) : (
            <form onSubmit={verifyData} className="mb-3">
              {error && <div className="alert alert-danger">{error}</div>}
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Ingrese un email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Ingrese un password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn btn-dark btn-lg btn-block">
                Login
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={(e) => setesRegistro(!esRegistro)}
            className="btn btn-info btn-sm btn-block"
          >
            {esRegistro ? " Ya tienes cuenta?" : "Registrate aqui"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);

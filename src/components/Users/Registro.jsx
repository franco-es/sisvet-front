// FUNCIONES DE REACT
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
// FUNCIONES PROPIAS
import register from "../../services/users/register";

const Registro = () => {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [name, SetName] = useState("");
  const [telefono, SetTelefono] = useState("");
  const [error, setError] = useState("");

  const cleanForm = () => {
    setEmail("");
    setPassword("");
    SetName("");
    SetTelefono("");
  };

  const RegisterEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      // console.group("ingrese email");
      setError("el email es OBLIGATORIO");
      return;
    }
    if (!pass.trim()) {
      // console.group("ingrese password");
      setError("La password es OBLIGATORIA");
      return;
    }
    if (pass.length < 6) {
      // console.log("password menor de 6 caracteres.");
      setError("password menor de 6 caracteres.");
      return;
    }
    if (!telefono.trim()) {
      // console.log("password menor de 6 caracteres.");
      setError("El Numero de telefono es OBLIGATORIO.");
      return;
    }
    if (!name.trim()) {
      // console.log("password menor de 6 caracteres.");
      setError("El nombre es OBLIGATORIO.");
      return;
    }
    console.log("pasando todas las validaciones");
    signUp();
  };

  const signUp = React.useCallback(async () => {
    const res = await register(email, pass, name, telefono);
    console.log(res);
    cleanForm();
  }, [email, pass, name, telefono]);

  return (
    <div>
      <form onSubmit={RegisterEmail} className="mb-3">
        {error && <div className="alert alert-danger">{error}</div>}
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Ingrese un email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Ingrese un password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Ingrese un telefono"
          onChange={(e) => SetTelefono(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Ingrese su Nombre y Apellido"
          onChange={(e) => SetName(e.target.value)}
        />
        <button type="submit" className="btn btn-dark btn-lg btn-block">
          Registrate
        </button>
      </form>
    </div>
  );
};

export default withRouter(Registro);

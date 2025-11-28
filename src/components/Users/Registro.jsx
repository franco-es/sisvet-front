// FUNCIONES DE REACT
import React, { useState } from "react";
// replace withRouter import with useNavigate
import { useNavigate } from "react-router-dom";
// FUNCIONES PROPIAS
import {register} from "../../services/users/register";

const Registro = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [name, SetName] = useState("");
  const [telefono, SetTelefono] = useState("");
  const [error, setError] = useState("");

  // add navigate hook
  const navigate = useNavigate();

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
    // Example: replace any usage like:
    // props.history.push("/auth");
    // with:
    navigate("/pets");
  }, [email, pass, name]);

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

// export directly (no withRouter)
export default Registro;

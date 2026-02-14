// FUNCIONES DE REACT
import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; // Se mantiene, pero se usa menos
// FUNCIONES PROPIAS
import Registro from "./Registro"; // COMPONENT DE Registro
import { login } from "../../services/users/login"; //function de logeo

const Login = ({ onAuthSuccess }) => { // 👈 Agregamos una prop para notificar el éxito
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [esRegistro, setEsRegistro] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Ya no usamos 'navigate' para la redirección después del login
  // const navigate = useNavigate(); 

  // Función de autenticación
  const auth = async () => {
    try {
      // ⚠️ Asumo que la función 'login' es la encargada de guardar el token en localStorage.
      // Si no lo hace, debes agregarlo aquí: localStorage.setItem("token", res.token);
      const res = await login(email, password);

      if (res.message && res.message !== "OK") {
        setError("Email o contraseña incorrectos.");
      } else if (res.token) {
        setError(null);
        // Almacenamiento seguro
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(res.user));
        
        // 🚨 CAMBIO CLAVE: GUARDA EL TOKEN y llama a la función de éxito
        localStorage.setItem("token", res.token); 
        if (onAuthSuccess) {
            onAuthSuccess(true); // Notifica a App.jsx para que actualice el estado authUser
        }
        
        // ❌ QUITAMOS ESTA LÍNEA. App.jsx se encargará de la redirección.
        navigate("/pets"); 
      }
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión.");
    } finally {
      setIsLoading(false); // Detener carga al finalizar
    }
  };

  const verifyData = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.trim()) {
      setError("Ingrese su email.");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Ingrese su contraseña.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    await auth();
  };
  
  // Función para cambiar el estado de registro
  const toggleRegistro = () => {
    setEsRegistro(!esRegistro);
    setError(""); 
  };


  return (
    <div className="mt-5 container-fluid bg-sisvet-platino py-4 rounded-3 px-3">
      <h3 className="text-center mb-4 text-sisvet-cobalto fw-bold">
        {esRegistro ? "Registro de usuarios" : "Login de usuarios"}
      </h3>
      <hr className="border-sisvet-cobalto" style={{ borderColor: 'var(--sisvet-cobalto)', opacity: 0.3 }} />

      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-xl-4">
          {esRegistro ? (
            <Registro onAuthSuccess={onAuthSuccess} />
          ) : (
            <div className="card card-sisvet shadow-sm p-4 mb-4">
              <form onSubmit={verifyData}>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                
                {/* Campos del formulario */}
                <div className="form-group mb-3">
                  <label htmlFor="emailInput" className="form-label visually-hidden">Email</label>
                  <input
                    id="emailInput"
                    type="email"
                    className="form-control"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="passwordInput" className="form-label visually-hidden">Contraseña</label>
                  <input
                    id="passwordInput"
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {/* Botón de Login */}
                <button 
                  type="submit" 
                  className="btn btn-sisvet-primary w-100" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Botón de Registro/Volver (fuera de la Card) */}
          <button
            type="button"
            onClick={toggleRegistro}
            className={`btn ${esRegistro ? 'btn-sisvet-outline-cobalto' : 'btn-sisvet-cobalto'} w-100`}
            disabled={isLoading}
          >
            {esRegistro ? "Volver al Login" : "Regístrate aquí"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
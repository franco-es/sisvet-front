// FUNCIONES DE REACT
import React, { useState } from "react";
// Se mantiene 'useNavigate' por si se requiere redirección local, 
// aunque la redirección principal la manejará App.jsx
import { register } from "../../services/users/register"; // Función de registro

// El componente Registro se renderiza dentro de Login, por lo que no necesita un botón de "Volver al Login"
// dentro de sí, ya que el botón de toggle está en el componente padre (Login).
const Registro = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [name, SetName] = useState("");
  const [telefono, SetTelefono] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para carga

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
         setError(res.message || "Error al registrar usuario.");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error en el servicio de registro.");
    } finally {
      setIsLoading(false);
    }
  }, [email, pass, name, telefono, onAuthSuccess]); // Incluimos 'telefono' y 'onAuthSuccess'

  const RegisterEmail = async (e) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true);

    // Validaciones
    if (!email.trim()) {
      setError("El email es OBLIGATORIO.");
      setIsLoading(false);
      return;
    }
    if (!pass.trim() || pass.length < 6) {
      setError("La contraseña es OBLIGATORIA y debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }
    if (!name.trim()) {
      setError("El nombre es OBLIGATORIO.");
      setIsLoading(false);
      return;
    }

    await signUp();
  };

  return (
    <div className="card card-sisvet shadow-sm p-4 mb-4">
      <form onSubmit={RegisterEmail}>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        
        {/* Campo de Email */}
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

        {/* Campo de Contraseña */}
        <div className="form-group mb-3">
          <label htmlFor="passwordInput" className="form-label visually-hidden">Contraseña</label>
          <input
            id="passwordInput"
            type="password"
            className="form-control"
            placeholder="Ingrese una contraseña"
            value={pass}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Campo de Nombre */}
        <div className="form-group mb-3">
          <label htmlFor="nameInput" className="form-label visually-hidden">Nombre</label>
          <input
            id="nameInput"
            type="text"
            className="form-control"
            placeholder="Ingrese su Nombre y Apellido"
            value={name}
            onChange={(e) => SetName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        {/* Campo de Teléfono (Opcional, pero se mantiene el campo) */}
        <div className="form-group mb-4">
          <label htmlFor="phoneInput" className="form-label visually-hidden">Teléfono</label>
          <input
            id="phoneInput"
            type="text"
            className="form-control"
            placeholder="Teléfono (Opcional)"
            value={telefono}
            onChange={(e) => SetTelefono(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Botón de Registro */}
        <button 
          type="submit" 
          className="btn btn-sisvet-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            // Indicador de carga de Bootstrap
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Registrando...
            </>
          ) : (
            "Regístrate"
          )}
        </button>
      </form>
    </div>
  );
};

export default Registro;
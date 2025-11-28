import "./App.css";
import React, { useState, useEffect } from "react"; // Importamos useState y useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Importamos Navigate

// Componentes
import NavBar from "./components/NavBar";
import Login from "./components/Users/Login";
import Pets from "./components/pets/Pets";
import Pet from "./components/pets/Pet";
import Inicio from "./components/Inicio";

function App() {
  // Cambiamos el estado inicial a null (sin token) o undefined (aún cargando)
  const [authUser, setAuthUser] = useState(undefined);

  useEffect(() => {
    // Verificar el token solo una vez al cargar la aplicación
    const token = localStorage.getItem("token");
    setAuthUser(token ? true : false); // Seteamos a 'true' si hay token, 'false' si no hay.
  }, []);

  // 1. Mostrar "Cargando..." mientras se verifica el token
  if (authUser === undefined) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  // 2. Si ya terminó de cargar, renderizamos las rutas
  return (
    <Router>
      <div className="main-container"> {/* Clase más semántica */}
        {/* Pasamos 'authUser' como un booleano para indicar si está autenticado */}
        <NavBar auth={authUser} /> 
        
        <Routes>
          {/* ✅ CORRECCIÓN PRINCIPAL: 
            En v6, usamos la prop 'element' para renderizar el componente.
            La prop 'exact' ya no es necesaria, se comporta como 'exact' por defecto.
          */}
          
          {/* Ruta de Inicio (pública) */}
          <Route path="/" element={<Inicio />} />
          
          {/* Ruta de Login/Auth: Redirigir si ya está autenticado */}
          <Route 
            path="/auth" 
            element={authUser ? <Navigate to="/pets" replace /> : <Login />} 
          />
          
          {/* Rutas Protegidas: Requieren autenticación (authUser === true) */}
          <Route 
            path="/pets" 
            element={authUser ? <Pets /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/pets/:id" 
            element={authUser ? <Pet /> : <Navigate to="/auth" replace />} 
          />

          {/* Ruta de 404/Not Found (opcional) */}
          <Route path="*" element={<p className="text-center mt-5">404 - Página no encontrada</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
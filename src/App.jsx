import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Login from "./components/Users/Login";
import Pets from "./components/pets/Pets";
import Pet from "./components/pets/Pet";
import Inicio from "./components/Inicio";

function App() {
  const [authUser, setAuthUser] = React.useState(false);

  React.useEffect(() => {
    let auth = localStorage.getItem("token");
    auth ? setAuthUser(auth) : setAuthUser(null);
  }, []);

  return authUser !== false ? (
    <Router>
      <div className="">
        <NavBar auth={authUser} />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/pets/:id" element={<Pet />} />
          <Route path="/pets" element={<Pets />} />
        </Routes>
      </div>
    </Router>
  ) : (
    <p>Cargando...</p>
  );
}

export default App;

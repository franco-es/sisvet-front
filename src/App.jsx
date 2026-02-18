import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Login from "./components/Users/Login";
import Pets from "./components/pets/Pets";
import Pet from "./components/pets/Pet";
import Inicio from "./components/Inicio";
import OwnersPlaceholder from "./components/owner/OwnersPlaceholder";
import Ventas from "./components/sales/Ventas";
import Turnos from "./components/turnos/Turnos";
import Transcribir from "./components/transcription/Transcribir";
import Admin from "./components/admin/Admin";
import PaymentSuccess from "./components/payment/PaymentSuccess";
import PaymentPending from "./components/payment/PaymentPending";
import PaymentFailure from "./components/payment/PaymentFailure";

function App() {
  const [authUser, setAuthUser] = React.useState(false);

  React.useEffect(() => {
    let auth = localStorage.getItem("token");
    auth ? setAuthUser(auth) : setAuthUser(null);
  }, []);

  const handleLogout = React.useCallback(() => {
    setAuthUser(null);
  }, []);

  return authUser !== false ? (
    <Router>
      <div className="">
        <NavBar auth={!!authUser} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/auth" element={<Login onAuthSuccess={setAuthUser} />} />
          <Route path="/pet/:id" element={<Pet />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/owners" element={<OwnersPlaceholder />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/transcribir" element={<Transcribir />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/pending" element={<PaymentPending />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
        </Routes>
      </div>
    </Router>
  ) : (
    <p>Cargando...</p>
  );
}

export default App;

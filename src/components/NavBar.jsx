import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { hasVentasRole, hasAdminRole } from "../utils/auth";

// Recibe 'auth' (booleano) y 'onLogout' (función) desde App.jsx
const NavBar = ({ auth, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout?.();
    navigate("/");
  };

  const isAuthenticated = !!auth;

return (
    <Navbar className="navbar-sisvet" expand="lg">
      <Container>
<Navbar.Brand as={Link} to="/" className="d-flex align-items-center navbar-brand-sisvet">
          <img
            src="/logo.png"
            alt="Logo Sisvet"
            className="navbar-logo-sisvet me-2"
            style={{ objectFit: "contain" }}
          />
          Sisvet
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Nav de la izquierda: Aquí van Home y los enlaces protegidos.
             Quitamos 'me-auto' para que esta sección se quede a la izquierda, 
             y confiamos en el 'ms-auto' de la siguiente Nav para el empuje.
           */}
          <Nav> 
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            {/* Solo muestra "Pets" si está autenticado */}
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/pets">
                Pets
              </Nav.Link>
            )}
            {/* Solo muestra "Owners" si está autenticado */}
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/owners">
                Owners
              </Nav.Link>
            )}
            {isAuthenticated && hasVentasRole() && (
              <Nav.Link as={NavLink} to="/ventas">
                Ventas
              </Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/transcribir">
                Transcribir
              </Nav.Link>
            )}
            {isAuthenticated && hasAdminRole() && (
              <Nav.Link as={NavLink} to="/admin">
                Admin
              </Nav.Link>
            )}
          </Nav>
          
          {/* Nav de la derecha: Login/Logout. 
             La clase 'ms-auto' (margin-start: auto) empuja este grupo 
             completamente a la derecha.
           */}
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="/auth">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
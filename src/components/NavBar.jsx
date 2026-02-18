import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { hasVentasRole, hasAdminRole } from "../utils/auth";
import LanguageSwitcher from "./LanguageSwitcher";

const NavBar = ({ auth, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout?.();
    navigate("/");
  };

  const isAuthenticated = !!auth;

  return (
    <Navbar className="navbar-sisvet navbar-sisvet-redesign" expand="lg">
      <Container fluid className="navbar-sisvet-container">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center navbar-brand-sisvet">
          <img
            src="/logo.png"
            alt={t("nav.logoAlt")}
            className="navbar-logo-sisvet me-2"
            style={{ objectFit: "contain" }}
          />
          <span className="navbar-brand-text">Sisvet</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" className="navbar-sisvet-toggler" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="navbar-sisvet-nav me-auto">
            <Nav.Link as={NavLink} to="/" end className="navbar-sisvet-link">
              {t("nav.home")}
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/pets" className="navbar-sisvet-link">
                {t("nav.pets")}
              </Nav.Link>
            )}
            {/* {isAuthenticated && (
              <Nav.Link as={NavLink} to="/owners" className="navbar-sisvet-link">
                {t("nav.owners")}
              </Nav.Link>
            )} */}
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/turnos" className="navbar-sisvet-link">
                {t("nav.appointments")}
              </Nav.Link>
            )}
            {isAuthenticated && hasVentasRole() && (
              <Nav.Link as={NavLink} to="/ventas" className="navbar-sisvet-link">
                {t("nav.sales")}
              </Nav.Link>
            )}
            {/* {isAuthenticated && (
              <Nav.Link as={NavLink} to="/transcribir" className="navbar-sisvet-link">
                {t("nav.transcribe")}
              </Nav.Link>
            )} */}
            {isAuthenticated && hasAdminRole() && (
              <Nav.Link as={NavLink} to="/admin" className="navbar-sisvet-link">
                {t("nav.admin")}
              </Nav.Link>
            )}
          </Nav>
          <Nav className="navbar-sisvet-nav navbar-sisvet-nav-right">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Nav.Link onClick={handleLogout} className="navbar-sisvet-link navbar-sisvet-logout">
                {t("nav.logout")}
              </Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="/auth" className="navbar-sisvet-link navbar-sisvet-login">
                {t("nav.login")}
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
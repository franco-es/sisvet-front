import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Nav, Card } from "react-bootstrap";
import { hasAdminRole } from "../../utils/auth";
import AdminMercadoPagoConfig from "./AdminMercadoPagoConfig";
import AdminUsers from "./AdminUsers";
import AdminConfigGeneral from "./AdminConfigGeneral";

const CATEGORIES = [
  { id: "integraciones", label: "Integraciones", icon: "fa-plug" },
  { id: "usuarios", label: "Usuarios", icon: "fa-users" },
  { id: "config", label: "Configuración general", icon: "fa-cog" },
];

const Admin = () => {
  const [category, setCategory] = useState("integraciones");

  if (!hasAdminRole()) {
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (category) {
      case "integraciones":
        return <AdminMercadoPagoConfig />;
      case "usuarios":
        return <AdminUsers />;
      case "config":
        return <AdminConfigGeneral />;
      default:
        return <AdminMercadoPagoConfig />;
    }
  };

  return (
    <div className="admin-layout d-flex">
      <Card className="admin-sidebar flex-shrink-0 rounded-0 border-0 shadow-sm">
        <Card.Body className="p-0">
          <h5 className="px-3 py-3 mb-0 text-sisvet-cobalto border-bottom">
            Administración
          </h5>
          <Nav variant="pills" className="flex-column admin-nav">
            {CATEGORIES.map((c) => (
              <Nav.Item key={c.id}>
                <Nav.Link
                  eventKey={c.id}
                  active={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className="d-flex align-items-center gap-2 rounded-0 border-0"
                >
                  <i className={`far ${c.icon}`} style={{ width: "1.25rem" }} />
                  {c.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Body>
      </Card>
      <div className="admin-content flex-grow-1 p-4 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;

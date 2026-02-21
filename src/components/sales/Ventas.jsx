import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { hasVentasRole } from "../../utils/auth";
import ProductsSection from "./ProductsSection";
import SalesSection from "./SalesSection";

const Ventas = () => {
  const navigate = useNavigate();
  const canAccess = hasVentasRole();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }
    if (!canAccess) {
      navigate("/");
    }
  }, [navigate, canAccess]);

  if (!canAccess) {
    return null;
  }

  return (
    <div className="container-fluid ventas-page">
      <div className="ventas-page-hero">
        <h1>Ventas</h1>
        <p className="ventas-page-subtitle">Productos y ventas del local</p>
      </div>

      <Row className="ventas-page-cards g-4">
        <Col xs={12} lg={6}>
          <ProductsSection />
        </Col>
        <Col xs={12} lg={6}>
          <SalesSection />
        </Col>
      </Row>
    </div>
  );
};

export default Ventas;

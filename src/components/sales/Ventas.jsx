import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
    <Container fluid className="mt-5 px-3">
      <div className="hero-sisvet">
        <h1 className="mb-1">Ventas</h1>
        <p className="mb-0 opacity-90">Productos y ventas del local</p>
      </div>
      <Row className="mt-4 g-3">
        <Col xs={12} lg={6}>
          <ProductsSection />
        </Col>
        <Col xs={12} lg={6}>
          <SalesSection />
        </Col>
      </Row>
    </Container>
  );
};

export default Ventas;

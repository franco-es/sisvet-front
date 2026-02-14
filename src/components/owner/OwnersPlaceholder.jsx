import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const OwnersPlaceholder = () => {
  return (
    <Container fluid className="mt-5 text-center px-3">
      <h2 className="text-sisvet-cobalto fw-bold">Dueños</h2>
      <p className="text-muted mt-3">
        Los dueños se gestionan desde la ficha de cada mascota (Pets).
      </p>
      <Link to="/pets" className="btn btn-sisvet-primary mt-3">
        Ir a Pets
      </Link>
    </Container>
  );
};

export default OwnersPlaceholder;

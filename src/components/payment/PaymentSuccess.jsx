import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const PaymentSuccess = () => {
  return (
    <div className="container py-5">
      <Card className="card-sisvet shadow-sm mx-auto" style={{ maxWidth: "480px" }}>
        <Card.Body className="text-center py-5">
          <div className="text-success mb-3" style={{ fontSize: "3rem" }}>✓</div>
          <h2 className="text-sisvet-cobalto mb-2">Pago exitoso</h2>
          <p className="text-muted mb-4">
            Tu pago fue procesado correctamente. Podés ver el estado de la venta en el listado de ventas.
          </p>
          <Button as={Link} to="/ventas" className="btn-sisvet-primary">
            Ir a Ventas
          </Button>
          <Button as={Link} to="/" variant="outline-secondary" className="ms-2">
            Inicio
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

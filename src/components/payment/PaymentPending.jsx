import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const PaymentPending = () => {
  return (
    <div className="container py-5">
      <Card className="card-sisvet shadow-sm mx-auto" style={{ maxWidth: "480px" }}>
        <Card.Body className="text-center py-5">
          <div className="text-warning mb-3" style={{ fontSize: "3rem" }}>⏳</div>
          <h2 className="text-sisvet-cobalto mb-2">Pago pendiente</h2>
          <p className="text-muted mb-4">
            Tu pago está en proceso. Cuando Mercado Pago lo confirme, el estado de la venta se actualizará automáticamente.
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

export default PaymentPending;

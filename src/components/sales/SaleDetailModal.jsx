import React, { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { getSale, emitElectronicInvoice } from "../../services/sales";

const SaleDetailModal = ({ show, onClose, saleId, onEmitted, arcaConfigured = false }) => {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emitting, setEmitting] = useState(false);
  const [emitError, setEmitError] = useState(null);

  useEffect(() => {
    if (show && saleId) {
      setLoading(true);
      setEmitError(null);
      getSale(saleId)
        .then((data) => setSale(data))
        .catch(() => setSale(null))
        .finally(() => setLoading(false));
    } else {
      setSale(null);
      setEmitError(null);
    }
  }, [show, saleId]);

  const handleEmitElectronicInvoice = async () => {
    if (!sale?.id) return;
    setEmitError(null);
    setEmitting(true);
    try {
      const updated = await emitElectronicInvoice(sale.id);
      setSale(updated);
      if (onEmitted) onEmitted();
    } catch (err) {
      setEmitError(
        err.response?.data?.message || err.message || "Error al emitir factura electrónica."
      );
    } finally {
      setEmitting(false);
    }
  };

  const hasElectronicInvoice = sale?.electronicInvoiceCae != null && sale?.electronicInvoiceCae !== "";
  const isElectronicInvoiceType = () => {
    const name = (sale?.invoiceTypeName || "").toLowerCase();
    if (name.includes("electrónica") || name.includes("electronica")) return true;
    return sale?.invoiceType === "FACTURA_ELECTRONICA";
  };
  const canEmitElectronicInvoice =
    sale?.status === "COMPLETED" &&
    !hasElectronicInvoice &&
    arcaConfigured &&
    isElectronicInvoiceType();

  const formatPrice = (value) => {
    const n = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(n)) return "—";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(n);
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusLabel = (s) => {
    if (s === "COMPLETED") return "Completada";
    if (s === "PENDING") return "Pendiente";
    if (s === "CANCELLED") return "Cancelada";
    return s || "—";
  };

  const paymentStatusLabel = (p) => {
    if (p === "PAID") return "Pagado";
    if (p === "PENDING_PAYMENT") return "Pago pendiente";
    if (p === "REJECTED") return "Rechazado";
    return p ? String(p) : "—";
  };

  const invoiceTypeLabel = (t) => {
    if (!t) return "—";
    const map = { FACTURA_A: "Factura A", FACTURA_B: "Factura B", FACTURA_C: "Factura C", FACTURA_ELECTRONICA: "Factura electrónica" };
    return map[t] || t;
  };

  const paymentTypeLabel = (t) => {
    if (!t) return "—";
    const map = { EFECTIVO: "Efectivo", TARJETA: "Tarjeta", MERCADO_PAGO: "Mercado Pago" };
    return map[t] || t;
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onClose} className="modal-sisvet" size="lg">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          Detalle de venta
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        {loading ? (
          <p className="mb-0">Cargando...</p>
        ) : sale ? (
          <>
            <p className="mb-2">
              <strong>Fecha:</strong> {formatDate(sale.saleDate)}
              {" · "}
              <strong>Factura:</strong> {sale.invoiceTypeName ?? invoiceTypeLabel(sale.invoiceType)}
              {" · "}
              <strong>Tipo pago:</strong> {sale.paymentTypeName ?? paymentTypeLabel(sale.paymentType)}
              {" · "}
              <strong>Estado:</strong> {statusLabel(sale.status)}
              {" · "}
              <strong>Estado pago:</strong> {paymentStatusLabel(sale.paymentStatus)}
            </p>
            {sale.mpCheckoutUrl && sale.paymentStatus === "PENDING_PAYMENT" && (
              <p className="mb-2">
                <a href={sale.mpCheckoutUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-sisvet-primary">
                  Abrir pago en Mercado Pago
                </a>
              </p>
            )}
            {hasElectronicInvoice && (
              <div className="mb-3 p-2 rounded bg-light border">
                <strong className="text-sisvet-cobalto">Factura electrónica (AFIP)</strong>
                <ul className="mb-0 mt-1 small">
                  <li><strong>CAE:</strong> {sale.electronicInvoiceCae}</li>
                  <li><strong>Vencimiento CAE:</strong> {formatDate(sale.electronicInvoiceCaeExpiration)}</li>
                  <li><strong>Punto de venta:</strong> {sale.electronicInvoicePuntoVenta ?? "—"}</li>
                  <li><strong>Comprobante Nº:</strong> {sale.electronicInvoiceCbteNumero ?? "—"}</li>
                  <li><strong>Tipo comprobante:</strong> {sale.electronicInvoiceCbteTipo ?? "—"} (ej. 6 = Factura B)</li>
                </ul>
              </div>
            )}
            {canEmitElectronicInvoice && (
              <div className="mb-3">
                <Button
                  size="sm"
                  className="btn-sisvet-primary"
                  disabled={emitting}
                  onClick={handleEmitElectronicInvoice}
                >
                  {emitting ? "Emitiendo..." : "Emitir factura electrónica"}
                </Button>
                {emitError && (
                  <p className="text-danger small mb-0 mt-1">{emitError}</p>
                )}
              </div>
            )}
            {sale.items && sale.items.length > 0 ? (
              <Table size="sm" striped className="table-sisvet-procedure">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>P. unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.product
                          ? item.product.name || item.product.code || `#${item.product.id}`
                          : `#${item.productId}`}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.unitPrice)}</td>
                      <td>{formatPrice(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="mb-0 text-muted">Sin ítems.</p>
            )}
            <p className="mb-0 mt-2 fw-bold text-sisvet-cobalto">
              Total: {formatPrice(sale.total)}
            </p>
          </>
        ) : (
          <p className="mb-0 text-muted">No se pudo cargar la venta.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SaleDetailModal;

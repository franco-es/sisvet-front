import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table } from "react-bootstrap";
import { listProducts, createSale } from "../../services/sales";
import { listInvoiceTypes } from "../../services/invoiceTypes";
import { listPaymentTypes } from "../../services/paymentTypes";

const NewSaleModal = ({ show, onClose, onSuccess, mpConfigured = false }) => {
  const [products, setProducts] = useState([]);
  const [invoiceTypes, setInvoiceTypes] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [invoiceTypeConfigId, setInvoiceTypeConfigId] = useState("");
  const [paymentTypeConfigId, setPaymentTypeConfigId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setError(null);
      setItems([]);
      setSelectedProductId("");
      setQuantity(1);
      setLoadingTypes(true);
      Promise.all([listProducts(), listInvoiceTypes(), listPaymentTypes()])
        .then(([prods, inv, pay]) => {
          setProducts(Array.isArray(prods) ? prods : []);
          const invList = Array.isArray(inv) ? inv : [];
          const payList = Array.isArray(pay) ? pay : [];
          setInvoiceTypes(invList);
          setPaymentTypes(payList);
          setInvoiceTypeConfigId(invList[0]?.id ?? "");
          const efectivo = payList.find((p) => p.code === "EFECTIVO");
          setPaymentTypeConfigId(efectivo?.id ?? payList[0]?.id ?? "");
        })
        .catch(() => {
          setProducts([]);
          setInvoiceTypes([]);
          setPaymentTypes([]);
          setInvoiceTypeConfigId("");
          setPaymentTypeConfigId("");
        })
        .finally(() => setLoadingTypes(false));
    }
  }, [show]);

  const selectedPaymentType = paymentTypes.find((p) => p.id === paymentTypeConfigId || p.id === paymentTypeConfigId);
  const isMercadoPago = selectedPaymentType?.code === "MERCADO_PAGO";

  const addItem = () => {
    const id = selectedProductId ? parseInt(selectedProductId, 10) : null;
    if (!id || quantity < 1) return;
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const existing = items.find((i) => i.productId === id);
    if (existing) {
      setItems(
        items.map((i) =>
          i.productId === id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      setItems([...items, { productId: id, quantity, product }]);
    }
    setQuantity(1);
    setSelectedProductId("");
  };

  const removeItem = (productId) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const total = items.reduce((sum, i) => {
    const p = i.product && i.product.unitPrice != null ? i.product.unitPrice : 0;
    return sum + p * (i.quantity || 0);
  }, 0);

  const formatPrice = (value) => {
    const n = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(n)) return "—";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(n);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (items.length === 0) {
      setError("Agregá al menos un producto.");
      return;
    }
    if (!invoiceTypeConfigId) {
      setError("Elegí un tipo de factura. Si no hay ninguno, crealo en Admin > Configuración general.");
      return;
    }
    if (!paymentTypeConfigId) {
      setError("Elegí un medio de pago.");
      return;
    }
    if (isMercadoPago && !mpConfigured) {
      setError("Mercado Pago no está configurado. Elegí otro medio de pago o configuralo en Admin > Integraciones.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const body = {
        invoiceTypeConfigId: Number(invoiceTypeConfigId),
        paymentTypeConfigId: Number(paymentTypeConfigId),
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };
      const data = await createSale(body);
      onClose();
      if (onSuccess) onSuccess();
      if (isMercadoPago && (data?.mpCheckoutUrl || data?.initPoint)) {
        window.location.href = data.mpCheckoutUrl || data.initPoint;
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al registrar la venta. Revisá el stock."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} className="modal-sisvet" size="lg">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          Nueva venta
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-form-sisvet pt-3">
          {error && (
            <div className="alert alert-danger py-2 small mb-3">{error}</div>
          )}
          {loadingTypes ? (
            <p className="text-muted small mb-3">Cargando tipos...</p>
          ) : (
            <div className="row g-2 mb-3">
              <Form.Group className="col-md-6">
                <Form.Label className="small">Tipo de factura</Form.Label>
                <Form.Select
                  value={invoiceTypeConfigId}
                  onChange={(e) => setInvoiceTypeConfigId(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {invoiceTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label className="small">Medio de pago</Form.Label>
                <Form.Select
                  value={paymentTypeConfigId}
                  onChange={(e) => setPaymentTypeConfigId(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {paymentTypes.map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                      disabled={t.code === "MERCADO_PAGO" && !mpConfigured}
                    >
                      {t.name}
                      {t.code === "MERCADO_PAGO" && !mpConfigured ? " (no configurado)" : ""}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          )}
          <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
            <Form.Group className="mb-0" style={{ minWidth: "200px", flex: 1 }}>
              <Form.Label className="small">Producto</Form.Label>
              <Form.Select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {products
                  .filter((p) => (p.stock ?? 0) > 0)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.code || `#${p.id}`} — Stock: {p.stock}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-0" style={{ width: "100px" }}>
              <Form.Label className="small">Cantidad</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
              />
            </Form.Group>
            <Button
              type="button"
              className="btn-sisvet-primary"
              onClick={addItem}
              disabled={!selectedProductId}
            >
              Agregar
            </Button>
          </div>
          {items.length > 0 && (
            <>
              <Table size="sm" striped className="table-sisvet-procedure mb-3">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>P. unit.</th>
                    <th>Subtotal</th>
                    <th style={{ width: "60px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => {
                    const unitPrice =
                      i.product && i.product.unitPrice != null
                        ? i.product.unitPrice
                        : 0;
                    const subtotal = unitPrice * (i.quantity || 0);
                    return (
                      <tr key={i.productId}>
                        <td>{i.product ? i.product.name : `#${i.productId}`}</td>
                        <td>{i.quantity}</td>
                        <td>{formatPrice(unitPrice)}</td>
                        <td>{formatPrice(subtotal)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-icon btn-icon-danger p-0 border-0 bg-transparent"
                            onClick={() => removeItem(i.productId)}
                            title="Quitar"
                            aria-label="Quitar"
                          >
                            <i className="far fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <p className="mb-0 fw-bold text-sisvet-cobalto">
                Total: {formatPrice(total)}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-sisvet-platino border-0 pt-0">
          <Button
            type="button"
            className="btn-sisvet-outline-cobalto"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-sisvet-primary"
            disabled={items.length === 0 || loading || loadingTypes}
          >
            {loading ? "Guardando..." : "Confirmar venta"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NewSaleModal;

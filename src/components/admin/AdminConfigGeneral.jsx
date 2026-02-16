import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form } from "react-bootstrap";
import {
  listInvoiceTypes,
  createInvoiceType,
  updateInvoiceType,
  deleteInvoiceType,
} from "../../services/invoiceTypes";
import {
  listPaymentTypes,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
} from "../../services/paymentTypes";

const AdminConfigGeneral = () => {
  const [invoiceTypes, setInvoiceTypes] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loadingInv, setLoadingInv] = useState(true);
  const [loadingPay, setLoadingPay] = useState(true);
  const [showInvModal, setShowInvModal] = useState(false);
  const [editInv, setEditInv] = useState(null);
  const [invForm, setInvForm] = useState({ name: "", sortOrder: 0 });
  const [showPayModal, setShowPayModal] = useState(false);
  const [editPay, setEditPay] = useState(null);
  const [payForm, setPayForm] = useState({ name: "", sortOrder: 10 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadInvoiceTypes = () => {
    setLoadingInv(true);
    listInvoiceTypes()
      .then((data) => setInvoiceTypes(Array.isArray(data) ? data : []))
      .catch(() => setInvoiceTypes([]))
      .finally(() => setLoadingInv(false));
  };

  const loadPaymentTypes = () => {
    setLoadingPay(true);
    listPaymentTypes()
      .then((data) => setPaymentTypes(Array.isArray(data) ? data : []))
      .catch(() => setPaymentTypes([]))
      .finally(() => setLoadingPay(false));
  };

  useEffect(() => {
    loadInvoiceTypes();
    loadPaymentTypes();
  }, []);

  const openInvModal = (item = null) => {
    setEditInv(item);
    setInvForm(
      item ? { name: item.name ?? "", sortOrder: item.sortOrder ?? 0 } : { name: "", sortOrder: 0 }
    );
    setError("");
    setShowInvModal(true);
  };

  const saveInvoiceType = async (e) => {
    e.preventDefault();
    if (!invForm.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      if (editInv) {
        await updateInvoiceType(editInv.id, {
          name: invForm.name.trim(),
          sortOrder: Number(invForm.sortOrder) || 0,
        });
      } else {
        await createInvoiceType({
          name: invForm.name.trim(),
          sortOrder: Number(invForm.sortOrder) || 0,
        });
      }
      loadInvoiceTypes();
      setShowInvModal(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Error al guardar."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteInv = async (id) => {
    if (!window.confirm("¿Eliminar este tipo de factura?")) return;
    try {
      await deleteInvoiceType(id);
      loadInvoiceTypes();
    } catch (err) {
      window.alert(err?.response?.data?.message || "Error al eliminar.");
    }
  };

  const openPayModal = (item = null) => {
    setEditPay(item);
    setPayForm(
      item
        ? { name: item.name ?? "", sortOrder: item.sortOrder ?? 10 }
        : { name: "", sortOrder: 10 }
    );
    setError("");
    setShowPayModal(true);
  };

  const savePaymentType = async (e) => {
    e.preventDefault();
    if (!payForm.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      if (editPay) {
        await updatePaymentType(editPay.id, {
          name: payForm.name.trim(),
          sortOrder: Number(payForm.sortOrder) || 0,
        });
      } else {
        await createPaymentType({
          name: payForm.name.trim(),
          sortOrder: Number(payForm.sortOrder) || 10,
        });
      }
      loadPaymentTypes();
      setShowPayModal(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Error al guardar."
      );
    } finally {
      setSaving(false);
    }
  };

  const deletePay = async (id, system) => {
    if (system) return;
    if (!window.confirm("¿Eliminar este medio de pago?")) return;
    try {
      await deletePaymentType(id);
      loadPaymentTypes();
    } catch (err) {
      window.alert(err?.response?.data?.message || "Error al eliminar.");
    }
  };

  return (
    <>
      <Card className="card-sisvet mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center bg-sisvet-cobalto text-white">
          <span>Tipos de factura</span>
          <Button size="sm" variant="light" onClick={() => openInvModal()}>
            Nuevo tipo
          </Button>
        </Card.Header>
        <Card.Body>
          {loadingInv ? (
            <p className="mb-0">Cargando...</p>
          ) : invoiceTypes.length === 0 ? (
            <p className="mb-0 text-muted">No hay tipos de factura. Creá uno para usarlo en ventas.</p>
          ) : (
            <Table responsive size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Orden</th>
                  <th style={{ width: "100px" }}></th>
                </tr>
              </thead>
              <tbody>
                {invoiceTypes.map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.sortOrder ?? "—"}</td>
                    <td>
                      <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => openInvModal(t)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => deleteInv(t.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="card-sisvet">
        <Card.Header className="d-flex justify-content-between align-items-center bg-sisvet-cobalto text-white">
          <span>Medios de pago</span>
          <Button size="sm" variant="light" onClick={() => openPayModal()}>
            Nuevo medio
          </Button>
        </Card.Header>
        <Card.Body>
          {loadingPay ? (
            <p className="mb-0">Cargando...</p>
          ) : paymentTypes.length === 0 ? (
            <p className="mb-0 text-muted">No hay medios de pago.</p>
          ) : (
            <Table responsive size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Orden</th>
                  <th>Tipo</th>
                  <th style={{ width: "120px" }}></th>
                </tr>
              </thead>
              <tbody>
                {paymentTypes.map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td><code className="small">{t.code ?? "—"}</code></td>
                    <td>{t.sortOrder ?? "—"}</td>
                    <td>{t.system ? "Sistema" : "Personalizado"}</td>
                    <td>
                      {!t.system && (
                        <>
                          <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => openPayModal(t)}>
                            Editar
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => deletePay(t.id, t.system)}>
                            Eliminar
                          </Button>
                        </>
                      )}
                      {t.system && <span className="text-muted small">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <p className="text-muted small mt-2 mb-0">
            Los medios del sistema (Efectivo, Tarjeta, Mercado Pago) no se pueden editar ni eliminar.
          </p>
        </Card.Body>
      </Card>

      <Modal show={showInvModal} onHide={() => setShowInvModal(false)} className="modal-sisvet">
        <Modal.Header closeButton className="bg-sisvet-platino border-0">
          <Modal.Title className="text-sisvet-cobalto">
            {editInv ? "Editar tipo de factura" : "Nuevo tipo de factura"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveInvoiceType}>
          <Modal.Body>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={invForm.name}
                onChange={(e) => setInvForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ej. Factura B"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Orden</Form.Label>
              <Form.Control
                type="number"
                value={invForm.sortOrder}
                onChange={(e) => setInvForm((f) => ({ ...f, sortOrder: e.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={() => setShowInvModal(false)}>Cancelar</Button>
            <Button type="submit" className="btn-sisvet-primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showPayModal} onHide={() => setShowPayModal(false)} className="modal-sisvet">
        <Modal.Header closeButton className="bg-sisvet-platino border-0">
          <Modal.Title className="text-sisvet-cobalto">
            {editPay ? "Editar medio de pago" : "Nuevo medio de pago"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={savePaymentType}>
          <Modal.Body>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={payForm.name}
                onChange={(e) => setPayForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ej. Transferencia"
                disabled={!!editPay?.system}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Orden</Form.Label>
              <Form.Control
                type="number"
                value={payForm.sortOrder}
                onChange={(e) => setPayForm((f) => ({ ...f, sortOrder: e.target.value }))}
                disabled={!!editPay?.system}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={() => setShowPayModal(false)}>Cancelar</Button>
            {!editPay?.system && (
              <Button type="submit" className="btn-sisvet-primary" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminConfigGeneral;

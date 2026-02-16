import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddEditProduct = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState(null);

  const isEdit = Boolean(props.productToEdit);

  useEffect(() => {
    if (!props.show) return;
    setError(null);
    if (props.productToEdit) {
      const p = props.productToEdit;
      setName(p.name ?? "");
      setDescription(p.description ?? "");
      setCode(p.code ?? "");
      setUnitPrice(p.unitPrice != null ? String(p.unitPrice) : "");
      setStock(p.stock != null ? String(p.stock) : "");
    } else {
      setName("");
      setDescription("");
      setCode("");
      setUnitPrice("");
      setStock("");
    }
  }, [props.show, props.productToEdit]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const nameTrim = name.trim();
    if (!nameTrim) {
      setError("El nombre es obligatorio.");
      return;
    }
    const price = unitPrice === "" ? 0 : parseFloat(unitPrice);
    const stockNum = stock === "" ? 0 : parseInt(stock, 10);
    if (isNaN(price) || price < 0) {
      setError("Precio unitario debe ser un número mayor o igual a 0.");
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError("Stock debe ser un número entero mayor o igual a 0.");
      return;
    }
    setError(null);
    const body = {
      name: nameTrim,
      description: (description || "").trim(),
      code: (code || "").trim(),
      unitPrice: Number(price),
      stock: stockNum,
    };
    if (isEdit) {
      props.onSave(props.productToEdit.id, body);
    } else {
      props.onAdd(body);
    }
  };

  return (
    <Modal show={props.show} onHide={props.onClose} className="modal-sisvet">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          {isEdit ? "Editar producto" : "Nuevo producto"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-form-sisvet pt-3">
          {error && <div className="text-danger small mb-2">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. Antipulgas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Ej. Pipeta 3 meses"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Código</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. ANTI-001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio unitario</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-sisvet-platino border-0 pt-0">
          <Button type="button" className="btn-sisvet-outline-cobalto" onClick={props.onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="btn-sisvet-primary">
            {isEdit ? "Guardar" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditProduct;

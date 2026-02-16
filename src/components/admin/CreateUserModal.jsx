import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { createUser } from "../../services/users";

const ROL_OPTIONS = [
  { value: "ADMIN", label: "Administrador" },
  { value: "VENTAS", label: "Ventas" },
  { value: "vete", label: "Veterinario" },
];

const CreateUserModal = ({ show, onHide, onSuccess }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    rol: "vete",
    matricula: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setForm({ email: "", password: "", nombre: "", rol: "vete", matricula: "" });
    setError("");
    onHide?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim()) {
      setError("El email es obligatorio.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      await createUser(
        form.email.trim(),
        form.password,
        form.nombre.trim(),
        form.rol,
        form.matricula?.trim() || null
      );
      handleClose();
      onSuccess?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error al crear el usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="modal-sisvet">
      <Modal.Header closeButton className="bg-sisvet-platino border-0">
        <Modal.Title className="text-sisvet-cobalto">Crear usuario</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-form-sisvet pt-3">
          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="usuario@ejemplo.com"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Nombre completo"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Matrícula</Form.Label>
            <Form.Control
              type="text"
              value={form.matricula}
              onChange={(e) => setForm((f) => ({ ...f, matricula: e.target.value }))}
              placeholder="Opcional"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              value={form.rol}
              onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))}
              className="form-control"
            >
              {ROL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-sisvet-primary"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear usuario"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;

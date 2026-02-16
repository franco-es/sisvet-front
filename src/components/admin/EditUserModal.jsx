import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import {
  getUserByIdForAdmin,
  updateUserByAdmin,
  addRoleToUser,
  removeRoleFromUser,
} from "../../services/users";

const ROLES_AVAILABLE = [
  { value: "ROLE_USER", label: "Usuario" },
  { value: "ROLE_VENTAS", label: "Ventas" },
  { value: "ROLE_VET", label: "Veterinario" },
];

const normalizeRole = (r) => {
  const s = typeof r === "string" ? r : r?.authority ?? r?.role ?? "";
  if (!s) return "";
  return s.startsWith("ROLE_") ? s : `ROLE_${s}`;
};

const roleToLabel = (roleValue) => {
  const found = ROLES_AVAILABLE.find((o) => o.value === roleValue);
  if (found) return found.label;
  const r = roleValue.replace(/^ROLE_/, "").toUpperCase();
  if (r === "VET" || r === "VETE") return "Veterinario";
  if (r === "ADMIN") return "Administrador";
  return roleValue.replace(/^ROLE_/, "");
};

const EditUserModal = ({ show, user, onHide, onSuccess }) => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    matricula: "",
    roles: [],
    password: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleActionLoading, setRoleActionLoading] = useState(false);
  const [addRoleValue, setAddRoleValue] = useState("");

  const loadUser = useCallback(() => {
    if (!user?.id) return;
    setFetchLoading(true);
    setError("");
    getUserByIdForAdmin(user.id)
      .then((data) => {
        const rawRoles = data.roles ?? data.authorities ?? [];
        const roles = (Array.isArray(rawRoles) ? rawRoles : [rawRoles])
          .map(normalizeRole)
          .filter(Boolean);
        setForm({
          nombre: data.nombre ?? data.name ?? "",
          email: data.email ?? "",
          matricula: data.matricula ?? "",
          roles,
          password: "",
          active: data.active !== false,
        });
      })
      .catch(() => setError("No se pudo cargar el usuario."))
      .finally(() => setFetchLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (show && user?.id) {
      loadUser();
      setAddRoleValue("");
    }
  }, [show, user?.id, loadUser]);

  const handleClose = () => {
    setForm({
      nombre: "",
      email: "",
      matricula: "",
      roles: [],
      password: "",
      active: true,
    });
    setError("");
    setAddRoleValue("");
    onHide?.();
  };

  const handleAddRole = async () => {
    if (!user?.id || !addRoleValue) return;
    if (form.roles.includes(addRoleValue)) return;
    setError("");
    setRoleActionLoading(true);
    try {
      await addRoleToUser(user.id, addRoleValue);
      setForm((f) => ({ ...f, roles: [...f.roles, addRoleValue].sort() }));
      setAddRoleValue("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error al agregar el rol."
      );
    } finally {
      setRoleActionLoading(false);
    }
  };

  const handleRemoveRole = async (roleName) => {
    if (!user?.id) return;
    if (form.roles.length <= 1) {
      setError("El usuario debe tener al menos un rol.");
      return;
    }
    setError("");
    setRoleActionLoading(true);
    try {
      await removeRoleFromUser(user.id, roleName);
      setForm((f) => ({ ...f, roles: f.roles.filter((r) => r !== roleName) }));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error al quitar el rol (debe quedar al menos uno)."
      );
    } finally {
      setRoleActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setError("");
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!form.email.trim()) {
      setError("El email es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      const dto = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        matricula: form.matricula?.trim() || null,
        active: form.active,
      };
      if (form.password.trim()) dto.password = form.password;
      await updateUserByAdmin(user.id, dto);
      handleClose();
      onSuccess?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error al actualizar el usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  const rolesToAdd = ROLES_AVAILABLE.filter((o) => !form.roles.includes(o.value));

  return (
    <Modal show={show} onHide={handleClose} className="modal-sisvet">
      <Modal.Header closeButton className="bg-sisvet-platino border-0">
        <Modal.Title className="text-sisvet-cobalto">Editar usuario</Modal.Title>
      </Modal.Header>
      {user && (
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="modal-form-sisvet pt-3">
            {fetchLoading ? (
              <p className="mb-0">Cargando...</p>
            ) : (
              <>
                {error && (
                  <div className="alert alert-danger py-2 small mb-3">{error}</div>
                )}
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
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="email@ejemplo.com"
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
                  <Form.Label>Roles</Form.Label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {form.roles.map((role) => (
                      <span
                        key={role}
                        className="badge d-inline-flex align-items-center gap-1"
                        style={{ fontSize: "0.85rem", backgroundColor: "var(--sisvet-cobalto)" }}
                      >
                        {roleToLabel(role)}
                        <button
                          type="button"
                          className="border-0 bg-transparent text-white p-0 ms-1"
                          style={{ cursor: "pointer", opacity: 0.9 }}
                          onClick={() => handleRemoveRole(role)}
                          disabled={roleActionLoading || form.roles.length <= 1}
                          title="Quitar rol"
                          aria-label="Quitar rol"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {rolesToAdd.length > 0 && (
                    <div className="d-flex gap-2 align-items-center">
                      <Form.Select
                        value={addRoleValue}
                        onChange={(e) => setAddRoleValue(e.target.value)}
                        className="form-control form-control-sm"
                        style={{ maxWidth: "180px" }}
                      >
                        <option value="">Agregar rol...</option>
                        {rolesToAdd.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline-primary"
                        onClick={handleAddRole}
                        disabled={!addRoleValue || roleActionLoading}
                      >
                        Agregar
                      </Button>
                    </div>
                  )}
                  <Form.Text className="text-muted d-block">
                    El usuario debe tener al menos un rol. No se puede asignar Administrador desde aquí.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Dejar en blanco para no cambiar"
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="edit-user-active"
                    label="Usuario activo"
                    checked={form.active}
                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          {!fetchLoading && (
            <Modal.Footer className="border-0">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn-sisvet-primary"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </Modal.Footer>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default EditUserModal;

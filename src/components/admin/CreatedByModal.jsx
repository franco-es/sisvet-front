import React, { useState, useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { getUsersCreatedBy } from "../../services/users";

const formatRoles = (user) => {
  const raw = user?.roles ?? user?.authorities ?? [];
  if (!Array.isArray(raw) && typeof raw === "string") return raw;
  return raw
    .map((r) => (typeof r === "string" ? r : r?.authority ?? r?.role ?? ""))
    .filter(Boolean)
    .join(", ") || "—";
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCupo = (value) => {
  if (value == null || value === "") return "Sin límite";
  const n = Number(value);
  if (isNaN(n)) return "—";
  return String(n);
};

const CreatedByModal = ({ show, creatorId, onHide }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || creatorId == null) {
      setList([]);
      return;
    }
    setLoading(true);
    getUsersCreatedBy(creatorId)
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [show, creatorId]);

  return (
    <Modal show={show} onHide={onHide} className="modal-sisvet" size="lg">
      <Modal.Header closeButton className="bg-sisvet-platino border-0">
        <Modal.Title className="text-sisvet-cobalto">
          Usuarios creados por #{creatorId}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p className="mb-0">Cargando...</p>
        ) : list.length === 0 ? (
          <p className="mb-0 text-muted">
            No hay usuarios creados por este usuario.
          </p>
        ) : (
          <Table responsive size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Matrícula</th>
                <th>Rol(es)</th>
                <th>Activo</th>
                <th>Creado</th>
                <th>Cupo</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id}>
                  <td>{u.email ?? "—"}</td>
                  <td>{u.nombre ?? u.name ?? "—"}</td>
                  <td>{u.matricula ?? "—"}</td>
                  <td>{formatRoles(u)}</td>
                  <td>{u.active === false ? "No" : "Sí"}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>{formatCupo(u.maxUsersToCreate)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CreatedByModal;

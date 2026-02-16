import React, { useState, useEffect } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { getUsersCreatedBy, deleteUserByAdmin } from "../../services/users";
import { getCurrentUser } from "../../utils/auth";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import CreatedByModal from "./CreatedByModal";

const hasAdminRole = (user) => {
  const raw = user?.roles ?? user?.authorities ?? [];
  const roles = Array.isArray(raw) ? raw : [raw];
  return roles.some(
    (r) => (typeof r === "string" ? r : r?.authority ?? r?.role ?? "")
      .toUpperCase()
      .replace(/^ROLE_/, "") === "ADMIN"
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showCreatedByModal, setShowCreatedByModal] = useState(false);
  const [createdByCreatorId, setCreatedByCreatorId] = useState(null);

  const loadUsers = () => {
    const currentUser = getCurrentUser();
    const creatorId = currentUser?.id ?? currentUser?.userId;
    if (creatorId == null) {
      setUsers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUsersCreatedBy(creatorId)
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

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

  const getCreatorLabel = (u) => {
    if (u.userCreatorId == null) return null;
    const fromApi = u.creatorNombre ?? u.creatorName ?? u.creatorEmail;
    if (fromApi) return fromApi;
    const currentUser = getCurrentUser();
    const currentId = currentUser?.id ?? currentUser?.userId;
    if (currentId != null && u.userCreatorId === currentId) {
      return currentUser?.nombre ?? currentUser?.name ?? currentUser?.email ?? "Vos";
    }
    return `#${u.userCreatorId}`;
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditUser(null);
  };

  const openCreatedByModal = (creatorId) => {
    if (creatorId == null) return;
    setCreatedByCreatorId(creatorId);
    setShowCreatedByModal(true);
  };

  const closeCreatedByModal = () => {
    setShowCreatedByModal(false);
    setCreatedByCreatorId(null);
  };

  const handleDelete = async (u) => {
    if (hasAdminRole(u)) return;
    if (!window.confirm(`¿Eliminar al usuario ${u.email ?? u.nombre ?? "este usuario"}?`)) return;
    try {
      await deleteUserByAdmin(u.id);
      loadUsers();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      window.alert(msg || "Error al eliminar el usuario.");
    }
  };

  return (
    <>
      <Card className="card-sisvet mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center bg-sisvet-cobalto text-white">
          <span>Usuarios</span>
          <Button size="sm" variant="light" onClick={() => setShowCreate(true)}>
            Crear usuario
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p className="mb-0">Cargando usuarios...</p>
          ) : (
            <Table responsive className="table-sisvet-procedure mb-0">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nombre</th>
                  <th>Matrícula</th>
                  <th>Rol(es)</th>
                  <th>Creado</th>
                  <th>Creado por</th>
                  <th style={{ width: "140px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-muted">
                      No hay usuarios.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email ?? "—"}</td>
                      <td>{u.nombre ?? u.name ?? "—"}</td>
                      <td>{u.matricula ?? "—"}</td>
                      <td>{formatRoles(u)}</td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td>
                        {u.userCreatorId != null ? (
                          <Button
                            variant="link"
                            className="p-0 text-decoration-none"
                            onClick={() => openCreatedByModal(u.userCreatorId)}
                            title="Ver usuarios creados por este usuario"
                          >
                            {getCreatorLabel(u)}
                          </Button>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {!hasAdminRole(u) && (
                          <>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => openEditModal(u)}
                              className="me-1"
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(u)}
                            >
                              Eliminar
                            </Button>
                          </>
                        )}
                        {hasAdminRole(u) && (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <CreateUserModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={loadUsers}
      />

      <EditUserModal
        show={showEditModal}
        user={editUser}
        onHide={closeEditModal}
        onSuccess={loadUsers}
      />

      <CreatedByModal
        show={showCreatedByModal}
        creatorId={createdByCreatorId}
        onHide={closeCreatedByModal}
      />
    </>
  );
};

export default AdminUsers;

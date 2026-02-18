import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Container, Card, Table, Button, Badge, Modal } from "react-bootstrap";
import {
  listAppointments,
  createAppointment,
  patchAppointmentStatus,
  deleteAppointment,
} from "../../services/appointments";
import AppointmentModal from "./AppointmentModal";
import AddPetModal from "../pets/AddPetModal";

const STATUS_LABELS = {
  SCHEDULED: { text: "Programado", variant: "primary" },
  CANCELLED: { text: "Cancelado", variant: "secondary" },
  COMPLETED: { text: "Realizado", variant: "success" },
};

const Turnos = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const petIdFromQuery = searchParams.get("petId");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [defaultPetId, setDefaultPetId] = useState(null);
  const [showNoPetConfirm, setShowNoPetConfirm] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [addPetInitialName, setAddPetInitialName] = useState("");
  const [pendingAppointmentData, setPendingAppointmentData] = useState(null);

  const loadAppointments = () => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    listAppointments(params)
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }
    loadAppointments();
  }, [navigate, statusFilter]);

  useEffect(() => {
    if (petIdFromQuery) {
      setDefaultPetId(parseInt(petIdFromQuery, 10));
      setShowModal(true);
      setSearchParams({});
    }
  }, [petIdFromQuery]);

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNewClick = () => {
    setEditingAppointment(null);
    setDefaultPetId(null);
    setShowModal(true);
  };

  const handleEditClick = (apt) => {
    setEditingAppointment(apt);
    setDefaultPetId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
    setDefaultPetId(null);
  };

  const handleNoPetSelected = (searchName = "", appointmentData = null) => {
    setAddPetInitialName(searchName);
    setPendingAppointmentData(appointmentData);
    setShowNoPetConfirm(true);
  };

  const handleConfirmCreatePet = () => {
    setShowNoPetConfirm(false);
    setShowAddPetModal(true);
  };

  const handleAddPetSuccess = async (pet) => {
    const id = pet?.id ?? pet?._id;
    setShowAddPetModal(false);
    handleCloseModal();

    if (id != null && pendingAppointmentData?.scheduledAt) {
      try {
        await createAppointment({
          petId: id,
          scheduledAt: pendingAppointmentData.scheduledAt,
          description: pendingAppointmentData.description,
        });
        loadAppointments();
      } catch (err) {
        console.error("Error al crear el turno:", err);
      }
      setPendingAppointmentData(null);
    } else {
      setPendingAppointmentData(null);
    }
    if (id != null) navigate(`/pet/${id}`);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await patchAppointmentStatus(id, status);
      loadAppointments();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este turno?")) return;
    try {
      await deleteAppointment(id);
      loadAppointments();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <Container fluid className="mt-5 px-3">
      <div className="hero-sisvet">
        <h1 className="mb-1">Turnos</h1>
        <p className="mb-0 opacity-90">Citas y agenda de consultas</p>
      </div>

      <Card className="card-sisvet mt-4">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Button
                className="btn-sisvet-primary"
                onClick={handleNewClick}
              >
                <i className="far fa-plus-square me-1" aria-hidden="true" />
                Nuevo turno
              </Button>
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="SCHEDULED">Programados</option>
                <option value="COMPLETED">Realizados</option>
                <option value="CANCELLED">Cancelados</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="mb-0 text-muted">Cargando turnos...</p>
          ) : appointments.length === 0 ? (
            <p className="mb-0 text-muted">No hay turnos. Creá uno con «Nuevo turno».</p>
          ) : (
            <div className="table-responsive">
              <Table striped hover className="table-sisvet-procedure">
                <thead>
                  <tr>
                    <th>Fecha y hora</th>
                    <th>Mascota</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                    <th style={{ width: "180px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => {
                    const statusInfo = STATUS_LABELS[apt.status] || { text: apt.status, variant: "secondary" };
                    return (
                      <tr key={apt.id}>
                        <td>{formatDateTime(apt.scheduledAt)}</td>
                        <td>
                          {apt.petId ? (
                            <Link to={`/pet/${apt.petId}`} className="text-sisvet-cobalto text-decoration-none fw-medium">
                              {apt.petName ?? `#${apt.petId}`}
                            </Link>
                          ) : (
                            apt.petName ?? "—"
                          )}
                        </td>
                        <td className={!apt.description ? "text-muted" : ""}>
                          {apt.description || "—"}
                        </td>
                        <td>
                          <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>
                        </td>
                        <td className="procedure-actions">
                          {apt.status === "SCHEDULED" && (
                            <>
                              <button
                                type="button"
                                className="btn-icon"
                                onClick={() => handleEditClick(apt)}
                                title="Editar"
                                aria-label="Editar"
                              >
                                <i className="far fa-edit" />
                              </button>
                              <button
                                type="button"
                                className="btn-icon text-success"
                                onClick={() => handleStatusChange(apt.id, "COMPLETED")}
                                title="Marcar realizado"
                                aria-label="Marcar realizado"
                              >
                                <i className="far fa-check-circle" />
                              </button>
                              <button
                                type="button"
                                className="btn-icon text-warning"
                                onClick={() => handleStatusChange(apt.id, "CANCELLED")}
                                title="Cancelar turno"
                                aria-label="Cancelar turno"
                              >
                                <i className="far fa-times-circle" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="btn-icon btn-icon-danger"
                            onClick={() => handleDelete(apt.id)}
                            title="Eliminar"
                            aria-label="Eliminar"
                          >
                            <i className="far fa-trash-alt" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <AppointmentModal
        show={showModal}
        onClose={handleCloseModal}
        onSuccess={loadAppointments}
        editAppointment={editingAppointment}
        defaultPetId={defaultPetId}
        onNoPetSelected={handleNoPetSelected}
      />

      <Modal
        show={showNoPetConfirm}
        onHide={() => {
          setShowNoPetConfirm(false);
          setPendingAppointmentData(null);
        }}
        className="modal-sisvet"
        centered
      >
        <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
          <Modal.Title className="text-sisvet-cobalto fw-bold">No hay mascota seleccionada</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <p className="mb-0">¿Desea crear una nueva mascota para agendar el turno?</p>
        </Modal.Body>
        <Modal.Footer className="bg-sisvet-platino border-0 pt-0">
          <Button
            variant="secondary"
            onClick={() => {
              setShowNoPetConfirm(false);
              setPendingAppointmentData(null);
            }}
          >
            No
          </Button>
          <Button className="btn-sisvet-primary" onClick={handleConfirmCreatePet}>
            Sí, crear mascota
          </Button>
        </Modal.Footer>
      </Modal>

      <AddPetModal
        show={showAddPetModal}
        onClose={() => {
          setShowAddPetModal(false);
          setPendingAppointmentData(null);
        }}
        onSuccess={handleAddPetSuccess}
        initialName={addPetInitialName}
      />
    </Container>
  );
};

export default Turnos;

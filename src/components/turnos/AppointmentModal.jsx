import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { createAppointment, updateAppointment } from "../../services/appointments";
import { listPetsSearch } from "../../services/pets";

const toDatetimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const ownerLabel = (owner) => {
  if (!owner) return "";
  const first = owner.firstName ?? owner.nombre ?? "";
  const last = owner.lastName ?? owner.apellido ?? "";
  return [first, last].filter(Boolean).join(" ").trim();
};

const AppointmentModal = ({ show, onClose, onSuccess, editAppointment = null, defaultPetId = null, onNoPetSelected = null }) => {
  const [pets, setPets] = useState([]);
  const [petSearch, setPetSearch] = useState("");
  const [petId, setPetId] = useState(defaultPetId ? String(defaultPetId) : "");
  const [scheduledAt, setScheduledAt] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!editAppointment?.id;

  useEffect(() => {
    if (show) {
      setError("");
      if (editAppointment) {
        setPetId(String(editAppointment.petId ?? ""));
        setScheduledAt(toDatetimeLocal(editAppointment.scheduledAt));
        setDescription(editAppointment.description ?? "");
      } else {
        setPetId(defaultPetId ? String(defaultPetId) : "");
        setDescription("");
        const next = new Date();
        next.setMinutes(next.getMinutes() + 30);
        next.setMinutes(0, 0);
        setScheduledAt(toDatetimeLocal(next.toISOString()));
      }
    }
  }, [show, editAppointment, defaultPetId]);

  useEffect(() => {
    if (!show) return;
    setLoadingPets(true);
    listPetsSearch(petSearch)
      .then((data) => setPets(Array.isArray(data) ? data : []))
      .catch(() => setPets([]))
      .finally(() => setLoadingPets(false));
  }, [show, petSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const pid = petId ? parseInt(petId, 10) : null;
    let isoDatetime = scheduledAt;
    if (scheduledAt && !scheduledAt.includes(":")) isoDatetime = `${scheduledAt}T00:00:00`;
    else if (scheduledAt && scheduledAt.length === 16) isoDatetime = `${scheduledAt}:00`;

    if (!pid) {
      if (onNoPetSelected && !isEdit) {
        if (!isoDatetime) {
          setError("Indicá fecha y hora del turno.");
          return;
        }
        onNoPetSelected(petSearch?.trim() || "", {
          scheduledAt: isoDatetime,
          description: description.trim() || undefined,
        });
        return;
      }
      setError("Seleccioná una mascota.");
      return;
    }
    if (!isoDatetime) {
      setError("Indicá fecha y hora del turno.");
      return;
    }
    setLoading(true);
    try {
      const body = { petId: pid, scheduledAt: isoDatetime, description: description.trim() || undefined };
      if (isEdit) {
        await updateAppointment(editAppointment.id, body);
      } else {
        await createAppointment(body);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error al guardar el turno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} className="modal-sisvet" size="lg">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          {isEdit ? "Editar turno" : "Nuevo turno"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-form-sisvet pt-3">
          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Mascota</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre..."
              value={petSearch}
              onChange={(e) => setPetSearch(e.target.value)}
              className="mb-2"
            />
            <Form.Select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              disabled={loadingPets}
            >
              <option value="">Seleccionar mascota...</option>
              {pets.map((p) => {
                const petName = p.name || p.nombre || `#${p.id}`;
                const ownerName = ownerLabel(p.owner);
                const ownerPart = ownerName ? ` — ${ownerName}` : "";
                const speciesPart = p.speciesName ? ` (${p.speciesName})` : "";
                return (
                  <option key={p.id} value={p.id}>
                    {petName}{speciesPart}{ownerPart}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha y hora</Form.Label>
            <Form.Control
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Motivo / descripción (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Control anual, vacuna, síntomas..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-sisvet-platino border-0 pt-0">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="btn-sisvet-primary" disabled={loading}>
            {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear turno"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AppointmentModal;

import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { createPet, listSpecies } from "../../services/pets";

/**
 * Modal para agregar una nueva mascota. Reutilizable desde Pets y Turnos.
 * onSuccess(pet) recibe la mascota creada (con id). Si redirectToFicha es true, el padre puede redirigir a /pet/:id.
 */
const AddPetModal = ({ show, onClose, onSuccess, initialName = "" }) => {
  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setError("");
      setName(typeof initialName === "string" ? initialName : "");
      setSpeciesId("");
      setBreed("");
      setColor("");
      setBirthDate("");
    }
  }, [show, initialName]);

  useEffect(() => {
    if (show) {
      setLoadingSpecies(true);
      listSpecies()
        .then((data) => setSpeciesList(Array.isArray(data) ? data : []))
        .catch(() => setSpeciesList([]))
        .finally(() => setLoadingSpecies(false));
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name?.trim() || !speciesId || !breed?.trim()) {
      setError("Nombre, especie y raza son obligatorios.");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    const sid = speciesId ? (Number(speciesId) || speciesId) : undefined;
    try {
      const res = await createPet(token, name.trim(), sid, breed.trim(), color.trim() || undefined, birthDate || undefined);
      const pet = res?.data ?? res;
      const id = pet?.id ?? pet?._id;
      if (id != null) {
        onSuccess?.({ ...pet, id });
        onClose?.();
      } else {
        setError("No se recibió el ID de la mascota creada.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error al crear la mascota.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} className="modal-sisvet" size="md">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          Agregar mascota
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-form-sisvet pt-3">
          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Especie</Form.Label>
            <Form.Select
              value={speciesId}
              onChange={(e) => setSpeciesId(e.target.value)}
              required
              disabled={loading || loadingSpecies}
            >
              <option value="">Seleccionar especie...</option>
              {speciesList.map((s) => {
                const sid = s.id ?? s._id;
                const label = s.name ?? s.nombre ?? sid;
                return <option key={sid} value={sid}>{label}</option>;
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Raza</Form.Label>
            <Form.Control
              type="text"
              placeholder="Raza"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Color (opcional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de nacimiento (opcional)</Form.Label>
            <Form.Control
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-sisvet-platino border-0 pt-0">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="btn-sisvet-primary" disabled={loading}>
            {loading ? "Guardando..." : "Agregar mascota"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddPetModal;

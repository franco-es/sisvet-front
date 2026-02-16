import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const toDatetimeLocal = (iso) =>
  iso ? String(iso).slice(0, 16) : "";

const AddVacuna = (props) => {
  const [vaccineName, setVaccineName] = useState("");
  const [dose, setDose] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [performedAt, setPerformedAt] = useState("");
  const [nextDoseAt, setNextDoseAt] = useState("");
  const [notes, setNotes] = useState("");

  const isEdit = Boolean(props.vacunaToEdit);

  useEffect(() => {
    if (!props.show) return;
    if (props.vacunaToEdit) {
      const v = props.vacunaToEdit;
      setVaccineName(v.vaccineName ?? v.nombre ?? "");
      setDose(v.dose ?? "");
      setLotNumber(v.lotNumber ?? "");
      setPerformedAt(toDatetimeLocal(v.performedAt ?? v.fecha));
      setNextDoseAt(toDatetimeLocal(v.nextDoseAt ?? v.prox_aplicacion));
      setNotes(v.notes ?? "");
    } else {
      setVaccineName("");
      setDose("");
      setLotNumber("");
      setPerformedAt("");
      setNextDoseAt("");
      setNotes("");
    }
  }, [props.show, props.vacunaToEdit]);

  const toISO = (local) =>
    local ? `${local}:00` : new Date().toISOString().slice(0, 19);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const performedAtISO = toISO(performedAt);
    const nextDoseAtISO = nextDoseAt ? toISO(nextDoseAt) : null;
    if (isEdit && props.handelEditVacuna) {
      const id = props.vacunaToEdit.id ?? props.vacunaToEdit._id;
      props.handelEditVacuna(id, {
        vaccineName,
        dose,
        lotNumber,
        nextDoseAt: nextDoseAtISO,
        performedAt: performedAtISO,
        notes,
      });
    } else {
      props.handelAddVacuna({
        vaccineName,
        dose,
        lotNumber,
        nextDoseAt: nextDoseAtISO,
        performedAt: performedAtISO,
        notes,
      });
    }
  };

  return (
    <Modal show={props.show} onHide={props.handleCloseAddClick} className="modal-sisvet">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          {isEdit ? "Editar Vacuna" : "Vacuna Nueva"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-form-sisvet pt-3">
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la vacuna</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. Antirrábica, Polivalente"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dosis</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. 1 ml, refuerzo"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Número de lote</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lote del laboratorio"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha y hora de aplicación</Form.Label>
            <Form.Control
              type="datetime-local"
              value={performedAt}
              onChange={(e) => setPerformedAt(e.target.value)}
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Próxima dosis (fecha y hora)</Form.Label>
            <Form.Control
              type="datetime-local"
              value={nextDoseAt}
              onChange={(e) => setNextDoseAt(e.target.value)}
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notas</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Observaciones, reacciones, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-control"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-sisvet-platino border-0 pt-0">
          <Button
            type="button"
            className="btn-sisvet-outline-cobalto"
            onClick={props.handleCloseAddClick}
          >
            Cancelar
          </Button>
          <Button type="submit" className="btn-sisvet-primary">
            {isEdit ? "Guardar" : "Agregar Vacuna"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddVacuna;

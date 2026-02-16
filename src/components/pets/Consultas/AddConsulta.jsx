import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import VoiceToTextField from "../../transcription/VoiceToTextField";

const AddConsulta = (props) => {
  const [performedAt, setPerformedAt] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const isEdit = Boolean(props.consultaToEdit);

  useEffect(() => {
    if (!props.show) return;
    if (props.consultaToEdit) {
      const c = props.consultaToEdit;
      setPerformedAt(
        c.performedAt ? c.performedAt.slice(0, 16) : ""
      );
      setSymptoms(c.symptoms ?? "");
      setDiagnosis(c.diagnosis ?? "");
      setNotes(c.notes ?? "");
    } else {
      setPerformedAt("");
      setSymptoms("");
      setDiagnosis("");
      setNotes("");
    }
  }, [props.show, props.consultaToEdit]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const performedAtISO = performedAt
      ? `${performedAt}:00`
      : new Date().toISOString().slice(0, 19);
    if (isEdit && props.handelEditConsulta) {
      const id = props.consultaToEdit.id ?? props.consultaToEdit._id;
      props.handelEditConsulta(id, symptoms, diagnosis, notes, performedAtISO);
    } else {
      props.handelAddConsulta(symptoms, diagnosis, notes, performedAtISO);
    }
  };

  return (
    <Modal show={props.show} onHide={props.handleCloseAddClick} className="modal-sisvet">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          {isEdit ? "Editar Consulta" : "Consulta Nueva"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-form-sisvet pt-3">
          <Form.Group className="mb-3">
            <Form.Label>Fecha y hora</Form.Label>
            <Form.Control
              type="datetime-local"
              value={performedAt}
              onChange={(e) => setPerformedAt(e.target.value)}
              className="form-control"
              required
            />
          </Form.Group>
          <VoiceToTextField
            label="Síntomas"
            value={symptoms}
            onChange={setSymptoms}
            placeholder="Síntomas observados"
            rows={3}
          />
          <VoiceToTextField
            label="Diagnóstico"
            value={diagnosis}
            onChange={setDiagnosis}
            placeholder="Diagnóstico"
            rows={3}
          />
          <VoiceToTextField
            label="Notas"
            value={notes}
            onChange={setNotes}
            placeholder="Notas adicionales (tratamiento, indicaciones, etc.)"
            rows={3}
          />
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
            {isEdit ? "Guardar" : "Agregar Consulta"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddConsulta;

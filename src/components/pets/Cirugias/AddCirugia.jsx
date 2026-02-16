import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import VoiceToTextField from "../../transcription/VoiceToTextField";

const toDatetimeLocal = (iso) => (iso ? String(iso).slice(0, 16) : "");

const AddCirugia = (props) => {
  const [surgeryType, setSurgeryType] = useState("");
  const [surgeon, setSurgeon] = useState("");
  const [anesthesiaType, setAnesthesiaType] = useState("");
  const [performedAt, setPerformedAt] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [successful, setSuccessful] = useState(true);
  const [notes, setNotes] = useState("");

  const isEdit = Boolean(props.cirugiaToEdit);

  useEffect(() => {
    if (!props.show) return;
    if (props.cirugiaToEdit) {
      const s = props.cirugiaToEdit;
      setSurgeryType(s.surgeryType ?? s.contenido ?? "");
      setSurgeon(s.surgeon ?? "");
      setAnesthesiaType(s.anesthesiaType ?? "");
      setPerformedAt(toDatetimeLocal(s.performedAt ?? s.fecha));
      setScheduledAt(toDatetimeLocal(s.scheduledAt));
      setSuccessful(s.successful !== false);
      setNotes(s.notes ?? "");
    } else {
      setSurgeryType("");
      setSurgeon("");
      setAnesthesiaType("");
      setPerformedAt("");
      setScheduledAt("");
      setSuccessful(true);
      setNotes("");
    }
  }, [props.show, props.cirugiaToEdit]);

  const toISO = (local) =>
    local ? `${local}:00` : new Date().toISOString().slice(0, 19);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const performedAtISO = toISO(performedAt);
    const scheduledAtISO = scheduledAt ? toISO(scheduledAt) : null;
    const payload = {
      surgeryType,
      surgeon,
      anesthesiaType,
      scheduledAt: scheduledAtISO,
      successful,
      performedAt: performedAtISO,
      notes,
    };
    if (isEdit && props.handelEditCirugia) {
      const id = props.cirugiaToEdit.id ?? props.cirugiaToEdit._id;
      props.handelEditCirugia(id, payload);
    } else {
      props.handelAddCirugia(payload);
    }
  };

  return (
    <Modal show={props.show} onHide={props.handleCloseAddClick} className="modal-sisvet">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          {isEdit ? "Editar Cirugía" : "Cirugía Nueva"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-form-sisvet pt-3">
          <VoiceToTextField
            label="Tipo de cirugía"
            value={surgeryType}
            onChange={setSurgeryType}
            placeholder="Ej. Esterilización, Extracción"
            as="input"
            required
          />
          <VoiceToTextField
            label="Cirujano"
            value={surgeon}
            onChange={setSurgeon}
            placeholder="Nombre del profesional"
            as="input"
          />
          <VoiceToTextField
            label="Tipo de anestesia"
            value={anesthesiaType}
            onChange={setAnesthesiaType}
            placeholder="Ej. General, local"
            as="input"
          />
          <Form.Group className="mb-3">
            <Form.Label>Fecha y hora de realización</Form.Label>
            <Form.Control
              type="datetime-local"
              value={performedAt}
              onChange={(e) => setPerformedAt(e.target.value)}
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha y hora programada (si aplica)</Form.Label>
            <Form.Control
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="successful"
              label="Cirugía exitosa"
              checked={successful}
              onChange={(e) => setSuccessful(e.target.checked)}
            />
          </Form.Group>
          <VoiceToTextField
            label="Notas"
            value={notes}
            onChange={setNotes}
            placeholder="Detalles, complicaciones, postoperatorio, etc."
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
            {isEdit ? "Guardar" : "Agregar Cirugía"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCirugia;

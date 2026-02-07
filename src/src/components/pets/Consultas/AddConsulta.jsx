import React, { useState } from "react";

import { Button, Modal, Form } from "react-bootstrap";

const AddConsulta = (props) => {
  const [date, setDate] = useState("");
  const [consulta, setConsulta] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [diagnostico, setDiagnostico] = useState("");

  const addConsult = () =>
    props.handelAddConsulta(date, consulta, tratamiento, diagnostico);

  return (
    <>
      <Modal show={props.show} onHide={props.handleCloseAddClick}>
        <Modal.Header closeButton>
          <Modal.Title>Consulta Nueva</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Control
              id="date"
              type="date"
              placeholder="fecha"
              className="mx-2"
              onChange={(e) => setDate(e.target.valueAsDate)}
            />
            <br />
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Contenido"
              className="mx-2"
              id="contenido"
              onChange={(e) => setConsulta(e.target.value)}
            />
            <br />
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Diagnostico"
              className="mx-2"
              id="diagnostico"
              onChange={(e) => setDiagnostico(e.target.value)}
            />
            <br />
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Tratamiento"
              className="mx-2"
              id="tratamiento"
              onChange={(e) => setTratamiento(e.target.value)}
            />
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleCloseAddClick}>
              Close
            </Button>
            <Button variant="primary" onClick={addConsult}>
              Agregar Consulta
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddConsulta;

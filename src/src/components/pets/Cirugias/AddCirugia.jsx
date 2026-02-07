import React, { useState } from "react";

import { Button, Modal, Form } from "react-bootstrap";

const AddCirugia = (props) => {
  const [date, setDate] = useState("");
  const [contenido, setContenido] = useState("");

  const addConsult = () => props.handelAddCirugia(date, contenido);

  return (
    <>
      <Modal show={props.show} onHide={props.handleCloseAddClick}>
        <Modal.Header closeButton>
          <Modal.Title>Cirugia Nueva</Modal.Title>
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
              type="text"
              placeholder="Contenido"
              className="mx-2"
              id="contenido"
              onChange={(e) => setContenido(e.target.value)}
            />
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

export default AddCirugia;

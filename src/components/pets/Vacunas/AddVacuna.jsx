import React, { useState } from "react";

import { Button, Modal, Form } from "react-bootstrap";

const AddVacuna = (props) => {
  const [date, setDate] = useState("");
  const [nombre, setNombre] = useState("");
  const [nextDate, setNextDate] = useState("");

  const addVacuna = () => {
    props.handelAddVacuna(date, nombre, nextDate);
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleCloseAddClick}>
        <Modal.Header closeButton>
          <Modal.Title>Vacuna Nueva</Modal.Title>
        </Modal.Header>
        <Form onSubmit={addVacuna}>
          <Modal.Body>
            <Form.Control
              type="date"
              placeholder="fecha"
              className="mx-2"
              onChange={(e) => setDate(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Contenido"
              className="mx-2"
              onChange={(e) => setNombre(e.target.value)}
            />
            <Form.Control
              type="date"
              placeholder="Proxima aplicacion"
              className="mx-2"
              onChange={(e) => setNextDate(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleCloseAddClick}>
              Close
            </Button>
            <Button className="btn-sisvet-primary" onClick={addVacuna}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddVacuna;

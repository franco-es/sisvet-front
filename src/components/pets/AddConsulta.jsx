import React, { useState } from "react";

import { Button, Modal, Form } from "react-bootstrap";

const AddConsulta = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className="add" onClick={handleShow}>
        <i className="far fa-plus-square"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Consulta Nueva</Modal.Title>
        </Modal.Header>
        <Form onSubmit={props.addNew}>
          <Modal.Body>
            <Form.Control type="date" placeholder="fecha" className="mx-2" />
            <br />
            <Form.Control
              type="text"
              placeholder="Contenido"
              className="mx-2"
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Tratamiento"
              className="mx-2"
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Diagnostico"
              className="mx-2"
            />
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Agregar Consulta
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddConsulta;

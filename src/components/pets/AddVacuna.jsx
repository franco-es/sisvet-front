import React, { useState } from "react";

import { Button, Modal, Form } from "react-bootstrap";

const AddVacuna = () => {
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
          <Modal.Title>Vacuna Nueva</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Control type="date" placeholder="fecha" className="mx-2" />
            <Form.Control
              type="text"
              placeholder="Contenido"
              className="mx-2"
            />
            <Form.Control type="text" placeholder="vacuna" className="mx-2" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddVacuna;

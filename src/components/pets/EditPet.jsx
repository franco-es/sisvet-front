// REACT
import React, { useState, useEffect } from "react";
// BOOTSTRAP
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const EditPet = (props) => {
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [color, setColor] = useState("");
  const [especie, setEspecie] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setNombre(props.nombre);
    setRaza(props.raza);
    setColor(props.color);
    setEspecie(props.especie);
  }, [setEspecie, setNombre, setColor, setRaza, props]);

  const verifyData = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("Por Favor escriba el nombre de la mascota");
      console.log(error);
      return;
    }
    if (!raza.trim()) {
      setError("Por Favor escriba la raza de la mascota");
      console.log(error);

      return;
    }
    if (!color.trim()) {
      setError("Por Favor escriba el pelaje de la mascota");
      console.log(error);

      return;
    }
    if (!especie.trim()) {
      setError("Por Favor escriba la especie de la mascota");
      console.log(error);

      return;
    }
    editPet();
  };

  const editPet = () => {
    props.handleEditPet(nombre, raza, color, especie);
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleCloseAddClick}>
        <Modal.Header closeButton className="text-center">
          <Modal.Title>Mascota</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            {error ? <span className="text-danger">{error}</span> : null}
            <Form.Group>
              <Form.Label>Nombre:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                className="mx-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Raza:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Raza"
                className="mx-2"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Especie:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Especie"
                className="mx-2"
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Pelaje:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pelaje"
                className="mx-2"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleCloseAddClick}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                verifyData(e);
              }}
            >
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EditPet;

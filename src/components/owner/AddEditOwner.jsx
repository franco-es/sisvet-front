import React, { useState, useEffect } from "react";

// BOOTSTRAP
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// PROPIOS
const AddEditOwner = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [type, setType] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsEdit(props.isEdit);
    setError(null);
    if (isEdit === true) {
      setNombre(props.nombre);
      setApellido(props.apellido);
      setTelefono(props.telefono);
      setDireccion(props.direccion);
      setEmail(props.email);
    } else {
      setNombre("");
      setApellido("");
      setTelefono("");
      setDireccion("");
      setEmail("");
    }
  }, [props, setIsEdit, isEdit]);

  const verifyData = () => {
    if (!nombre.trim()) {
      setError("Por favor, Agregue un Nombre.");
      return;
    }
    if (!apellido.trim()) {
      setError("Por favor, Agregue un Apellido.");
      return;
    }
    if (!direccion.trim()) {
      setError("Por favor, Agregue una Direccion.");
      return;
    }
    if (!telefono.trim()) {
      setError("Por favor, Agregue un Telefono.");
      return;
    }
    if (!email.trim()) {
      setError("Por favor, Agregue un Email.");
      return;
    }
    setError(null);

    if (props.isEdit == true) {
      setType("update");
      props.handleEditClick(nombre, apellido, telefono, direccion, email, type);
    } else {
      setType("new");
      props.handleAddClick(nombre, apellido, telefono, direccion, email, type);
    }

  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleCloseAddClick}>
        <Modal.Header closeButton className="text-center bg-sisvet-platino border-0 pb-0">
          <Modal.Title className="text-sisvet-cobalto">
            {isEdit === true ? "Editar Propietario" : "Agregar Propietario"}
          </Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body className="modal-form-sisvet pt-3">
            {error ? <span className="text-danger">{error}</span> : null}
            <Form.Group>
              <Form.Label>Nombre: *</Form.Label>
              <Form.Control
                id="text"
                type="text"
                placeholder="Nombre"
                className="mx-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Apellido: *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellido"
                className="mx-2"
                id="contenido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Direccion: *</Form.Label>
              <Form.Control
                id="text"
                type="text"
                placeholder="Direccion"
                className="mx-2"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Telefono: *</Form.Label>
              <Form.Control
                id="text"
                type="text"
                placeholder="Telefono"
                className="mx-2"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Email: *</Form.Label>
              <Form.Control
                id="text"
                type="email"
                placeholder="Email"
                className="mx-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <br />
          </Modal.Body>
          <Modal.Footer className="bg-sisvet-platino">
            <Button className="btn-sisvet-outline-cobalto" onClick={props.handleCloseAddClick}>
              Cancelar
            </Button>
            <Button className="btn-sisvet-primary" onClick={verifyData}>
              {isEdit === true ? "Editar Propietario" : "Agregar Propietario"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddEditOwner;
